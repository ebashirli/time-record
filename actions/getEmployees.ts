"use server";

import prisma from "@/lib/prisma";
import { EmployeeRow } from "@/components/pages/employees/types";
import type { Prisma } from "@/prisma/lib/generated/prisma/client";
import dayjs from "dayjs";

export async function getEmployees(
  paramsString?: string,
  paginate: boolean = true,
) {
  const searchParams = new URLSearchParams(paramsString);
  const query = searchParams.get("query");
  const companyId = searchParams.get("companyId") || undefined;
  const departmentId = searchParams.get("departmentId") || undefined;
  const positionId = searchParams.get("positionId") || undefined;
  const isActiveParam = searchParams.get("isActive");
  const idsParam = searchParams.get("ids");
  const limit = Number(searchParams.get("limit") ?? 20);
  const page = Number(searchParams.get("page") ?? 0);

  const isActive =
    isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;
  const ids = idsParam ? idsParam.split(",") : undefined;

  const where: Prisma.EmployeeWhereInput = ids
    ? { id: { in: ids } }
    : {
        ...(isActive !== undefined ? { isActive } : {}),
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

          firstName: true,
          middleName: true,
          patronymic: true,
          lastName: true,
          idCardSerie: true,
          idCardNo: true,
          idCardPin: true,
          nationality: true,
          sex: true,
          birthDate: true,
          bloodType: true,
          phoneNumber: true,
          emergencyPhoneNumber: true,
          shift: true,
          hireDate: true,
          terminationDate: true,
          createdAt: true,
          updatedAt: true,
          isActive: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    const data: EmployeeRow[] = employees.map((employee, i) => ({
      ...employee,
      "#": i + 1 + (paginate ? page * limit : 0),
      id: employee.id,
      fullName: employee.fullName,
      cardId: employee.cardId,
      image: employee.image,
      companyName: employee.company.name,
      departmentName: employee.department.name,
      positionName: employee.position.name,
      birthDate: employee.birthDate ? dayjs(employee.birthDate).format("YYYY-DD-MM") : "",
      hireDate: employee.hireDate ? dayjs(employee.hireDate).format("YYYY-DD-MM") : "",
      terminationDate: employee.terminationDate ? dayjs(employee.terminationDate).format("YYYY-DD-MM") : "",
      createdAt: employee.createdAt ? dayjs(employee.createdAt).format("YYYY-DD-MM") : "",
      updatedAt: employee.updatedAt ? dayjs(employee.updatedAt).format("YYYY-DD-MM") : "",
      isActive: !!employee.isActive ? 'Active' : "",

    }));

    return { success: true, data, total };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
