"use server";
import prisma from "@/lib/prisma";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import getCurrentSession from "@/lib/getCurrentSession";

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
          //  where: {
          //   checkedBy: { gateId },
          // },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            direction: true,
            dateTime: true,
          },
        },
      },
    });
    if (!employee) return { error: "Employee not found" };
    return {
      data: {
        id: employee.id,
        cardId: employee.cardId,
        fullName: employee.fullName ?? "",
        companyName: employee.company.name,
        departmentName: employee.department.name,
        positionName: employee.position.name,
        lastAction: employee.checkins.at(0)?.direction ?? null,
        lastActionAt: employee.checkins.at(0)?.dateTime.toISOString() ?? null,
        cachedAt: new Date().toISOString(),
        image: employee.image,
      },
    };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "An error occurred while fetching employee data" };
  }
}

export async function submitCheckIn({
  employeeId,
  direction,
  dateTime,
}: {
  employeeId: string;
  direction: Direction;
  dateTime: Date;
}) {
  const { user } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  if (!employeeId || !direction)
    throw new Error("Employee ID and direction is required");

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const checkin = await prisma.checkin.create({
    data: { employeeId, direction, checkedById: user.id, dateTime },
    select: { employee: { select: { fullName: true } }, id: true },
  });
  revalidatePath("/scanner");
  revalidatePath("/attendance-tracking-system");
  return { data: checkin };
}
