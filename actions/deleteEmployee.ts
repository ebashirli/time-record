"use server";

import prisma from "@/lib/prisma";

export async function deleteEmployee(id: string) {
  try {
    const data = await prisma.employee.update({
      where: { id },
      data: { isActive: false, terminationDate: new Date() },
      select: { fullName: true, id: true },
    });
    return { success: true, data: { name: data.fullName, id: data.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
