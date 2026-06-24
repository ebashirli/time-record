"use server";

import prisma from "@/lib/prisma";
import { EmployeeRow } from "@/components/pages/employees/types";
import type { Prisma } from "@/prisma/lib/generated/prisma/client";

export async function getEmployees(
  paramsString?: string,
  paginate: boolean = true,
) {
  const searchParams = new URLSearchParams(paramsString);
  const query = searchParams.get("query");
  const companyId = searchParams.get("companyId") || undefined;
  const departmentId = searchParams.get("departmentId") || undefined;
  const positionId = searchParams.get("positionId") || undefined;
  const limit = Number(searchParams.get("limit") ?? 20);
  const page = Number(searchParams.get("page") ?? 0);

  const where: Prisma.EmployeeWhereInput = {
    isActive: { not: false },
    companyId,
    departmentId,
    positionId,
  };

  if (query) {
    where.OR = [
      "firstName",
      "middleName",
      "patronymic",
      "lastName",
      "fullName",
      "idCardNo",
      "idCardPin",
      "phoneNumber",
      "emergencyPhoneNumber",
      "cardId",
      "image",
      "companyId",
      "departmentId",
      "positionId",
    ].map((field) => ({
      [field]: { contains: query, mode: "insensitive" as const },
    }));
  }

  try {
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        ...(paginate && { skip: limit * page, take: limit }),

        select: {
          id: true,
          fullName: true,
          cardId: true,
          image: true,
          company: { select: { name: true } },
          department: { select: { name: true } },
          position: { select: { name: true } },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    const data: EmployeeRow[] = employees.map((employee, i) => ({
      "#": i + 1 + (paginate ? page * limit : 0),
      id: employee.id,
      fullName: employee.fullName,
      cardId: employee.cardId,
      image: employee.image,
      companyName: employee.company.name,
      departmentName: employee.department.name,
      positionName: employee.position.name,
    }));

    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
