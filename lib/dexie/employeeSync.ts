import { getEmployeeChanges } from "@/actions/scan-actions";
import { db } from "./db";

const POLL_INTERVAL_MS = 60_000;
const WATERMARK_KEY = "lastEmployeeSyncAt";

let checkInFlight = false;
let pollHandle: ReturnType<typeof setInterval> | null = null;

/**
 * Mirror the full active roster into Dexie, not just employees this terminal
 * has already scanned — that's what lets lookupEmployee() resolve a card it's
 * never seen before even while offline (see lookupEmployee.ts). For an
 * employee newly seeded this way, lastAction/lastActionAt are forced to null
 * and lastActionKnown to false, since this terminal hasn't itself confirmed
 * them against the server — that's local check-in state, not server "profile"
 * data, and guessing at it would corrupt the duplicate-detection logic in
 * recordAction.ts. For employees already cached, only profile fields are
 * refreshed; lastAction/lastActionAt/lastActionKnown are left untouched.
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

      if (!change.isActive) {
        if (cached) await db.employees.delete(change.cardId);
        continue;
      }

      if (!cached) {
        await db.employees.add({
          cardId: change.cardId,
          id: change.id,
          fullName: change.fullName,
          companyName: change.companyName,
          departmentName: change.departmentName,
          positionName: change.positionName,
          image: change.image,
          imageBlob: null,
          lastAction: null,
          lastActionAt: null,
          lastActionKnown: false,
          cachedAt: new Date().toISOString(),
        });
        continue;
      }

      await db.employees.update(change.cardId, {
        fullName: change.fullName,
        companyName: change.companyName,
        departmentName: change.departmentName,
        positionName: change.positionName,
      });
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
