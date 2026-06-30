"use server";

import prisma from "@/lib/prisma";

export async function toggleEmployeeStatus(ids: string[], isActive: boolean) {
  if (!ids.length) return { success: false, error: "No IDs provided" };

  try {
    await prisma.employee.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
