"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export async function getEmployeeByCardId(cardId: string) {
  if (!cardId) return { error: "Card ID not provided" };

  try {
    const employee = await prisma.employee.findFirst({
      where: { cardId },
      include: {
        company: true,
        position: true,
        department: true,
        checkins: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            direction: true,
          },
        },
      },
    });
    if (!employee) return { error: "Employee not found" };
    return { data: employee };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "An error occurred while fetching employee data" };
  }
}

type PrevState = {
  error?: string;
  data?: { employee: { fullName: string | null }; id: string };
};

export async function submitCheckIn(
  prevState: PrevState | null,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
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
    console.log({ error });
    if (error instanceof Error) return { error: error.message };
    return { error: "Something happened" };
  }
}
