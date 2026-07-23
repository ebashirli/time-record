import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export type ImageCheckResult = {
  status: "ok" | "already_running";
  checked: number;
  changed: number;
  missing: string[];
};

const ALREADY_RUNNING_RESULT: ImageCheckResult = {
  status: "already_running",
  checked: 0,
  changed: 0,
  missing: [],
};

let checkInFlight = false;

/**
 * Detects real employee photo changes by content hash, not mtime — the
 * image folder is a backup/restore target (see IMAGES_DIR), and copy tools
 * commonly preserve the source file's mtime, which would make mtime a
 * false-negative-prone signal for exactly the "wrong photo" bug this exists
 * to catch. size/mtime are still recorded, but only as diagnostics.
 */
export async function checkEmployeeImages(): Promise<ImageCheckResult> {
  if (checkInFlight) return ALREADY_RUNNING_RESULT;

  const imagesDir = process.env.IMAGES_DIR;
  if (!imagesDir) {
    console.error("[imageAssetSync] IMAGES_DIR is not set; skipping check");
    return { status: "ok", checked: 0, changed: 0, missing: [] };
  }

  checkInFlight = true;
  try {
    const employees = await prisma.employee.findMany({
      where: { image: { not: null }, isActive: { not: false } },
      select: { image: true },
      distinct: ["image"],
    });

    let changed = 0;
    const missing: string[] = [];

    for (const { image: fileName } of employees) {
      if (!fileName) continue;
      const filePath = path.join(imagesDir, fileName);

      let stat;
      try {
        stat = await fs.stat(filePath);
      } catch {
        missing.push(fileName);
        continue;
      }

      let fileBuffer;
      try {
        fileBuffer = await fs.readFile(filePath);
      } catch (error) {
        console.warn(
          `[imageAssetSync] failed to read "${fileName}":`,
          error,
        );
        continue;
      }

      const contentHash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      const existing = await prisma.imageAsset.findUnique({
        where: { fileName },
      });

      if (!existing) {
        // First time we've seen this file — record a baseline, not a change.
        await prisma.imageAsset.create({
          data: {
            fileName,
            fileSizeBytes: stat.size,
            fileMtimeMs: stat.mtimeMs,
            contentHash,
          },
        });
        continue;
      }

      if (existing.contentHash !== contentHash) {
        await prisma.imageAsset.update({
          where: { fileName },
          data: {
            fileSizeBytes: stat.size,
            fileMtimeMs: stat.mtimeMs,
            contentHash,
            lastChangedAt: new Date(),
          },
        });
        await prisma.employee.updateMany({
          where: { image: fileName, isActive: { not: false } },
          data: { imageUpdatedAt: new Date() },
        });
        changed++;
      }
    }

    if (missing.length) {
      console.warn(
        `[imageAssetSync] ${missing.length} referenced image file(s) not found on disk:`,
        missing,
      );
    }

    return { status: "ok", checked: employees.length, changed, missing };
  } finally {
    checkInFlight = false;
  }
}

export function startImageAssetScheduler(intervalMs: number): void {
  checkEmployeeImages().catch((error) =>
    console.error("[imageAssetSync] initial check failed:", error),
  );
  setInterval(() => {
    checkEmployeeImages().catch((error) =>
      console.error("[imageAssetSync] scheduled check failed:", error),
    );
  }, intervalMs);
}
