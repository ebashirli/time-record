import { getEmployeeChanges } from "@/actions/scan-actions";
import { fetchAndSaveEmployeeImage } from "./fetchAndSaveEmployeeImage";
import { CachedEmployee, db } from "./db";

const POLL_INTERVAL_MS = 60_000;
const WATERMARK_KEY = "lastEmployeeSyncAt";

let checkInFlight = false;
let pollHandle: ReturnType<typeof setInterval> | null = null;

/**
 * Refresh profile fields for employees already cached on this terminal.
 * Never proactively caches employees this terminal hasn't itself scanned,
 * and never touches lastAction/lastActionAt — that's local check-in state,
 * not server "profile" data, and overwriting it here would corrupt the
 * duplicate-detection logic in recordAction.ts.
 */
export async function checkForEmployeeUpdates(): Promise<void> {
  if (checkInFlight) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  checkInFlight = true;
  try {
    const watermark = await db.meta.get(WATERMARK_KEY);
    const { changes, syncedAt } = await getEmployeeChanges(
      watermark?.value ?? null,
    );

    for (const change of changes) {
      const cached = await db.employees.get(change.cardId);
      if (!cached) continue; // lazy cache — only refresh what's already here

      if (!change.isActive) {
        await db.employees.delete(change.cardId);
        continue;
      }

      const patch: Partial<CachedEmployee> = {
        fullName: change.fullName,
        companyName: change.companyName,
        departmentName: change.departmentName,
        positionName: change.positionName,
      };

      if (change.imageUpdatedAt !== (cached.imageUpdatedAt ?? null)) {
        if (!change.image) {
          patch.image = null;
          patch.imageBlob = null;
          patch.imageUpdatedAt = null;
        } else {
          const newBlob = await fetchAndSaveEmployeeImage(change.image);
          if (newBlob) {
            patch.image = change.image;
            patch.imageBlob = newBlob;
            patch.imageUpdatedAt = change.imageUpdatedAt;
          } else {
            // Fetch failed (transient network issue or legacy API hiccup).
            // Leave image/imageBlob/imageUpdatedAt untouched this cycle
            // rather than blank a working photo — logged for visibility.
            console.warn(
              `[employeeSync] image refresh failed for cardId ${change.cardId}; keeping previously cached photo`,
            );
          }
        }
      }

      await db.employees.update(change.cardId, patch);
    }

    await db.meta.put({ key: WATERMARK_KEY, value: syncedAt });
  } finally {
    checkInFlight = false;
  }
}

export function startEmployeeSyncManager(): void {
  if (typeof window === "undefined") return;
  if (!pollHandle) {
    pollHandle = setInterval(() => {
      void checkForEmployeeUpdates();
    }, POLL_INTERVAL_MS);
  }
  void checkForEmployeeUpdates();
}

export function stopEmployeeSyncManager(): void {
  if (pollHandle) {
    clearInterval(pollHandle);
    pollHandle = null;
  }
}
