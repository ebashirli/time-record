"use server";

import { CheckinRow } from "@/components/pages/checkins/types";
import prisma from "@/lib/prisma";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
import type { Prisma } from "@/prisma/lib/generated/prisma/client";

function getYesterday(hour: number = 17) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(hour, 0, 0, 0);
  return yesterday;
}

const checkinSelect = {
  id: true,
  employee: {
    select: {
      fullName: true,
      department: { select: { name: true } },
      company: { select: { name: true } },
      position: { select: { name: true } },
    },
  },
  checkedBy: { select: { name: true } },
  dateTime: true,
  direction: true,
} satisfies Prisma.CheckinSelect;

function buildCheckinsWhere(
  params: URLSearchParams,
  paginate: boolean = true,
): Prisma.CheckinWhereInput {
  const query = params.get("query") || undefined;
  const from = params.get("from");
  const to = params.get("to");
  const companyId = params.get("companyId") || undefined;
  const checkedById = params.get("checkedById") || undefined;
  const direction = (params.get("direction") as Direction) || undefined;

  const where: Prisma.CheckinWhereInput = {};

  if (from || to) {
    where.dateTime = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to) }),
    };
  } else {
    if (!paginate) where.dateTime = { gte: getYesterday() };
  }

  if (checkedById) {
    where.checkedById = checkedById;
  }

  if (direction) {
    where.direction = direction;
  }

  const employee: Prisma.EmployeeWhereInput = {};
  if (query) {
    employee.fullName = { contains: query, mode: "insensitive" };
  }
  if (companyId) {
    employee.companyId = companyId;
  }

  if (Object.keys(employee).length > 0) {
    where.employee = employee;
  }

  return where;
}

export async function getCheckins(
  paramsString: string,
  paginate: boolean = true,
): Promise<{
  success: boolean;
  error?: string;
  data?: CheckinRow[];
  total?: number;
}> {
  try {
    const params = new URLSearchParams(paramsString);
    const where = buildCheckinsWhere(params, paginate);

    const page = Math.max(0, parseInt(params.get("page") || "0", 10) || 0);
    const limit = Math.max(1, parseInt(params.get("limit") || "30", 10) || 30);

    const [data, total] = await Promise.all([
      prisma.checkin.findMany({
        where,
        orderBy: { dateTime: "desc" },
        select: checkinSelect,
        ...(paginate && { skip: limit * page, take: limit }),
      }),
      prisma.checkin.count({ where }),
    ]);

    const result: CheckinRow[] =
      data?.map((checkin, i) => ({
        "#": i + 1 + (paginate ? page * (limit ?? 0) : 0),
        id: checkin.id,
        fullName: checkin.employee.fullName || "Unknown Employee",
        companyName: checkin.employee.company.name || "Unknown Company",
        departmentName: checkin.employee.department.name,
        positionName: checkin.employee.position.name,
        checkedByName: checkin.checkedBy.name || "Unknown Terminal",
        dateTime: checkin.dateTime,
        direction: (checkin.direction === Direction.IN ? "In" : "Out") as
          | "In"
          | "Out",
      })) ?? [];

    return { success: true, data: result, total };
  } catch (error) {
    return {
      success: false,
      data: undefined,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
