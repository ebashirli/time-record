"use server";

import prisma from "@/lib/prisma";

export async function getGateById(id: string): Promise<string | null> {
  const gate = await prisma.gate.findUnique({ where: { id }, select: { name: true } });
  return gate?.name ?? null;
}
