"use server";

import prisma from "@/lib/prisma";

export async function getUsers(paramsString?: string) {
  const searchParams = new URLSearchParams(paramsString);
  const query = searchParams.get("query");

  // const where = {
  //   AND: [
  //     {
  //       OR: [
  //         {
  //           name: {
  //             contains: query,
  //             mode: "insensitive" as const,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // };

  try {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        // where,
        // skip: limit * page,
        // take: limit,

        select: {
          id: true,
          name: true,
          role: true,
        },
        orderBy: { name: "asc" },
      }),
      // prisma.users.count({ where }),
    ]);
    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
