"use server";

import prisma from "@/lib/prisma";

export async function getCompanies(paramsString?: string) {
  const searchParams = new URLSearchParams(paramsString);
  const query = searchParams.get("query");

  const where = query
    ? {
        AND: [
          { isActive: { not: false } },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            ],
          },
        ],
      }
    : { isActive: { not: false } };

  try {
    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        // skip: limit * page,
        // take: limit,

        select: {
          id: true,
          name: true,
          logo: true,
          works: { select: { name: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.company.count({ where }),
    ]);
    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
