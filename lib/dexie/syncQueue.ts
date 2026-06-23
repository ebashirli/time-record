import { submitCheckIn } from "@/actions/scan-actions";
import { db } from "./db";

// Replace with your actual existing Server Action import, e.g.:
// import { submitCheckin } from "@/actions/checkin";

const POLL_INTERVAL_MS = 15_000; // periodic safety-net sweep, in case events are missed

let syncInFlight = false;
let pollHandle: ReturnType<typeof setInterval> | null = null;

/**
 * Attempt to sync every row currently in the pendingActions queue.
 * Safe to call repeatedly/concurrently — guarded by syncInFlight so
 * overlapping triggers (immediate call + interval tick + online event)
 * don't race each other.
 */
export async function syncPendingActions(): Promise<void> {
  if (syncInFlight) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  syncInFlight = true;
  try {
    const queued = await db.pendingActions.orderBy("dateTime").toArray();

    for (const item of queued) {
      // Skip items already mid-flight from a previous overlapping call
      // (defensive — shouldn't occur given syncInFlight, but cheap to check).
      if (item.syncStatus === "syncing") continue;

      await db.pendingActions.update(item.clientEventId, {
        syncStatus: "syncing",
      });

      try {
        const formData = new FormData();
        formData.set("employeeId", item.employeeId);
        formData.set("direction", item.action);
        formData.set("dateTime", item.dateTime);

        await submitCheckIn(null, formData);

        // Success — remove from the queue entirely (server is now source of truth).
        await db.pendingActions.delete(item.clientEventId);
      } catch (err) {
        const retryCount = item.retryCount + 1;
        await db.pendingActions.update(item.clientEventId, {
          syncStatus: "failed",
          retryCount,
          lastError: err instanceof Error ? err.message : String(err),
        });

        // Stop processing the rest of the queue for now if we hit a network
        // failure — likely all subsequent items will fail too, and we don't
        // want to hammer a dead connection. A real server-side rejection
        // (e.g. validation error) vs. a network error could be distinguished
        // here if submitCheckin throws typed errors; for now, back off and
        // let the next interval/online event retry everything.
        break;
      }
    }
  } finally {
    syncInFlight = false;
  }
}

/**
 * Call this right after a write (see commitAction in recordAction.ts) to
 * attempt sync immediately rather than waiting for the next poll tick.
 * Fire-and-forget by design — callers don't await this.
 */
export async function triggerImmediateSync(): Promise<void> {
  await syncPendingActions();
}

/**
 * Returns a live count of unsynced actions, for the pending-sync badge.
 * Pair with dexie-react-hooks' useLiveQuery in the component, e.g.:
 *
 *   const pendingCount = useLiveQuery(() => db.pendingActions.count(), [], 0);
 */
export async function getPendingCount(): Promise<number> {
  return db.pendingActions.count();
}

/**
 * Wire this up once, e.g. in a top-level client component (layout or a
 * dedicated <SyncManager /> mounted alongside <RegisterSW />):
 *
 *   useEffect(() => {
 *     startSyncManager();
 *     return () => stopSyncManager();
 *   }, []);
 */
export function startSyncManager(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("online", handleOnline);

  if (!pollHandle) {
    pollHandle = setInterval(() => {
      void syncPendingActions();
    }, POLL_INTERVAL_MS);
  }

  // Attempt once on startup too, in case items were queued while the app
  // was closed and connectivity is already available.
  void syncPendingActions();
}

export function stopSyncManager(): void {
  if (typeof window === "undefined") return;

  window.removeEventListener("online", handleOnline);

  if (pollHandle) {
    clearInterval(pollHandle);
    pollHandle = null;
  }
}

function handleOnline(): void {
  void syncPendingActions();
}
