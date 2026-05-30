"use server";

import prisma from "@/lib/prisma";

export async function getEmployees({
  limit,
  page,
  query,
}: {
  limit: number;
  page: number;
  query: null | string;
}) {
  const where = query
    ? {
        AND: [
          { isActive: { not: false } },
          {
            OR: [
              {
                fullName: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
              {
                cardId: {
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
      prisma.employee.findMany({
        where,
        skip: limit * page,
        take: limit,

        select: {
          id: true,
          fullName: true,
          cardId: true,
          image: true,
          company: { select: { name: true } },
          department: { select: { name: true } },
          position: { select: { name: true } },
        },
      }),
      prisma.employee.count({ where }),
    ]);
    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
