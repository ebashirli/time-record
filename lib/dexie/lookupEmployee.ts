import { getEmployeeByCardId } from "@/actions/scan-actions";
import { fetchAndSaveEmployeeImage } from "./fetchAndSaveEmployeeImage";
import { CachedEmployee, db } from "./db";

export type LookupResult =
  | { status: "found"; employee: CachedEmployee; fromCache: boolean }
  | { status: "not_found" }
  | { status: "network_error" }
  | { status: "no_gate"; message: string };

/**
 * Cache-first employee lookup. A cache hit never touches the network.
 * On a cache miss, the three server outcomes (found / not found / unreachable)
 * are kept distinguishable all the way to the caller — conflating "unknown
 * card" with "network down" misleads the guard about what to do next.
 */
export async function lookupEmployee(cardId: string): Promise<LookupResult> {
  const cached = await db.employees.get(cardId);
  if (cached) return { status: "found", employee: cached, fromCache: true };

  let result;
  try {
    result = await getEmployeeByCardId(cardId);
  } catch {
    return { status: "network_error" };
  }

  if ("error" in result) {
    if (result.code === "NOT_FOUND") return { status: "not_found" };
    if (result.code === "NO_GATE") {
      return { status: "no_gate", message: result.error };
    }
    return { status: "network_error" };
  }

  const imageBlob = await fetchAndSaveEmployeeImage(result.data.image);
  const employee: CachedEmployee = { ...result.data, imageBlob };
  await db.employees.put(employee);
  return { status: "found", employee, fromCache: false };
}
