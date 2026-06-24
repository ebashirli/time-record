"use server";

import prisma from "@/lib/prisma";

export async function getPositions(paramsString?: string) {
  const searchParams = new URLSearchParams(paramsString);
  const query = searchParams.get("query") || undefined;

  const where = query
    ? { name: { contains: query, mode: "insensitive" as const } }
    : {};

  try {
    const [data, total] = await Promise.all([
      prisma.position.findMany({
        where,
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.position.count({ where }),
    ]);
    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
