"use server";

import prisma from "@/lib/prisma";

export async function getCheckins({
  // limit = 20,
  // page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query?: null | string;
}) {
  console.log({ query });
  try {
    const [data, total] = await Promise.all([
      prisma.checkin.findMany({
        // skip: limit * page,
        // take: limit,
        orderBy: { dateTime: "desc" },
        select: {
          id: true,
          employee: {
            select: {
              fullName: true,
              department: { select: { name: true } },
            },
          },
          checkedBy: { select: { name: true } },
          dateTime: true,
          direction: true,
        },
      }),
      prisma.checkin.count(),
    ]);
    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
