"use server";

import prisma from "@/lib/prisma";

export async function getCheckins(
  {
    // limit = 20,
    // page = 1,
    // query,
  }: {
    limit?: number;
    page?: number;
    query?: null | string;
  },
) {
  try {
    // 2. Create a date object for yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // 3. Set the time strictly to 17:00:00.000 local time
    yesterday.setHours(17, 0, 0, 0);

    const [data, total] = await Promise.all([
      prisma.checkin.findMany({
        // skip: limit * page,
        // take: limit,
        where: {
          dateTime: {
            gte: yesterday,
          },
        },
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
