"use server";

import prisma from "@/lib/prisma";

export async function getEmployeeByPin(pin: string) {
  const employee = await prisma.employee.findFirst({
    where: { idCardPin: pin },
    include: { company: true, position: true, department: true },
  });

  return employee;
}

export async function submitCheckIn(formData: FormData) {
  console.log({ formData });
}
