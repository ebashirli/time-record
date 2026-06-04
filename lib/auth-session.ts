import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export function isTerminalRole(role: string | undefined | null) {
  return role === "TERMINAL";
}

export function getDefaultRouteForRole(role: string | undefined | null) {
  return isTerminalRole(role) ? "/scanner" : "/dashboard";
}
