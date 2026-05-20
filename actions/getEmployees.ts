"use server";

import prisma from "@/lib/prisma";

export async function getEmployees(params: {
  [k: string]: null | string | number;
}) {
  try {
    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where: {},
        skip: 12 * parseInt((params.page as string) ?? "0"),
        take: 12,

        select: {
          id: true,
          fullName: true,
          company: { select: { name: true } },
          department: { select: { name: true } },
          position: { select: { name: true } },
        },
      }),
      prisma.employee.count({ where: {} }),
    ]);
    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
