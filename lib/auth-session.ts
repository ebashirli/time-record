import { Role } from "@/prisma/lib/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export function isTerminalRole(role: Role) {
  return role === Role.TERMINAL;
}

export function isAdminRole(role: Role) {
  return role === Role.ADMIN;
}

export function getDefaultRouteForRole(role: Role) {
  return isTerminalRole(role) ? "/scanner" : "/dashboard";
}
