"use server";
import prisma from "@/lib/prisma";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import getCurrentSession from "@/lib/getCurrentSession";

type PrevState = {
  error?: string;
  data?: { employee: { fullName: string | null }; id: string };
};

export async function submitEmployeeEdit(
  prevState: PrevState | null,
  formData: FormData,
) {
  const { user } = await getCurrentSession();

  if (!user) return { error: "Unauthorized" };
  const employeeId = formData.get("employeeId") as string;
  const direction = formData.get("direction") as Direction;

  if (!employeeId || !direction)
    return { error: "Employee ID and direction is required" };

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) return { error: "Employee not found" };

  try {
    const checkin = await prisma.checkin.create({
      data: {
        employeeId,
        direction,
        checkedById: user.id,
        dateTime: new Date(),
      },
      // include: { employee: true },
      select: { employee: { select: { fullName: true } }, id: true },
    });
    revalidatePath("/scanner");
    return { data: checkin };
  } catch (error: unknown) {
    console.error({ error });
    if (error instanceof Error) return { error: error.message };
    return { error: "Something happened" };
  }
}
