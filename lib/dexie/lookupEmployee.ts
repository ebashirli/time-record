import { getEmployeeByCardId } from "@/actions/scan-actions";
import { fetchAndSaveEmployeeImage } from "./fetchAndSaveEmployeeImage";
import { CachedEmployee, db } from "./db";

export type LookupResult =
  | { status: "found"; employee: CachedEmployee; fromCache: boolean }
  | { status: "not_found" }
  | { status: "network_error" }
  | { status: "no_gate"; message: string };

/**
 * Cache-first employee lookup, with a twist: a cache hit only skips the
 * network when lastActionKnown is true (i.e. this terminal has already
 * resolved the employee against the server at least once). Directory-only
 * rows seeded by the bulk roster sync (employeeSync.ts) have lastAction
 * forced to null, which isn't trustworthy for duplicate-detection yet — so
 * those still try the network first for an authoritative answer, and only
 * fall back to the unverified directory entry if the network is down.
 * This is what lets the guard scan an employee who's never been seen at
 * this terminal before even while offline, as long as the roster sync has
 * run at least once while online.
 */
export async function lookupEmployee(cardId: string): Promise<LookupResult> {
  const cached = await db.employees.get(cardId);
  if (cached?.lastActionKnown) {
    return { status: "found", employee: cached, fromCache: true };
  }

  let result;
  try {
    result = await getEmployeeByCardId(cardId);
  } catch {
    if (cached) return { status: "found", employee: cached, fromCache: true };
    return { status: "network_error" };
  }

  if ("error" in result) {
    if (result.code === "NOT_FOUND") return { status: "not_found" };
    if (result.code === "NO_GATE") {
      return { status: "no_gate", message: result.error };
    }
    if (cached) return { status: "found", employee: cached, fromCache: true };
    return { status: "network_error" };
  }

  const imageBlob =
    cached?.imageBlob ?? (await fetchAndSaveEmployeeImage(result.data.image));
  const employee: CachedEmployee = {
    ...result.data,
    imageBlob,
    lastActionKnown: true,
  };
  await db.employees.put(employee);
  return { status: "found", employee, fromCache: false };
}
