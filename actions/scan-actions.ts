"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Your Better Auth instance
import { headers } from "next/headers";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
import { Checkin } from "@/prisma/lib/generated/prisma/browser";

export async function getEmployeeByPin(pin: string) {
  if (!pin) return { error: "PIN not provided" };
  const employee = await prisma.employee.findFirst({
    where: { idCardPin: pin },
    include: { company: true, position: true, department: true },
  });

  if (!employee) return { error: "Employee not found" };
  return { data: employee };
}

type PrevState = {
  error?: string;
  data?: Checkin;
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
    });
    return { data: checkin };
  } catch (error: unknown) {
    console.log({ error });
    if (error instanceof Error) return { error: error.message };
    return { error: "Something happened" };
  }
}
