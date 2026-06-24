import { Direction } from "@/prisma/lib/generated/prisma/enums";
import { db } from "./db";

const DUPLICATE_WARNING_LABEL: Record<Direction, string> = {
  IN: "Giriş",
  OUT: "Çıxış",
};

export type RecordActionResult =
  | { status: "recorded"; clientEventId: string }
  | {
      status: "needs_confirmation";
      lastAction: Direction;
      lastActionAt: string;
    }
  | { status: "employee_not_cached" }; // shouldn't happen if lookup ran first, but guard anyway

/**
 * Step 1: check whether this action would be a duplicate of the employee's
 * last known action. Call this when the guard taps Entry/Leave, BEFORE
 * writing anything. If it returns "needs_confirmation", show the soft
 * warning and only call commitAction() if the guard confirms.
 */
export async function checkAction(
  cardId: string,
  action: Direction,
): Promise<RecordActionResult> {
  const employee = await db.employees.get(cardId);

  if (!employee) {
    // Shouldn't happen in practice — lookupEmployee() should run first
    // and populate the cache. Treat as a guard rail, not the main path.
    return { status: "employee_not_cached" };
  }

  if (employee.lastAction === action && employee.lastActionAt) {
    return {
      status: "needs_confirmation",
      lastAction: employee.lastAction,
      lastActionAt: employee.lastActionAt,
    };
  }

  // Different from last action (or no prior action recorded) — go straight through.
  return commitAction(cardId, employee.id, action);
}

export async function commitAction(
  cardId: string,
  employeeId: string,
  action: Direction,
  // gateId: string = getGateId(),
): Promise<RecordActionResult> {
  const clientEventId = crypto.randomUUID();
  const dateTime = new Date().toISOString();

  await db.transaction("rw", db.pendingActions, db.employees, async () => {
    await db.pendingActions.add({
      clientEventId,
      employeeId,
      action,
      dateTime,
      syncStatus: "pending",
      retryCount: 0,
    });

    await db.employees.update(cardId, {
      lastAction: action,
      lastActionAt: dateTime,
    });
  });

  // Fire-and-forget — don't block the UI on this. The sync loop (syncQueue.ts)
  // will also pick this up on its own interval/online-event trigger if this
  // immediate attempt fails or the tab is backgrounded mid-request.
  void triggerImmediateSync();

  return { status: "recorded", clientEventId };
}

export function describeLastAction(
  action: Direction,
  dateTime: string,
): string {
  const minutesAgo = Math.max(
    0,
    Math.round((Date.now() - new Date(dateTime).getTime()) / 60000),
  );
  const timeLabel = minutesAgo === 0 ? "İndicə" : `${minutesAgo} dəqiqə əvvəl`;
  return `${DUPLICATE_WARNING_LABEL[action]} ${timeLabel} artıq qeydə alınıb`;
}

// --- helpers ---

// Defined in syncQueue.ts — imported here to kick off an immediate attempt
// right after a write, rather than waiting for the next interval tick.
import { triggerImmediateSync } from "./syncQueue";
