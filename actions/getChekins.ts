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
  checkedBy: { select: { name: true, gate: { select: { name: true } } } },
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
    if (paginate) where.dateTime = { gte: getYesterday() };
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
    const limit = Math.max(1, parseInt(params.get("limit") || "20", 10) || 20);

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
        gateName: checkin.checkedBy.gate?.name || "Unknown Gate",
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

type StatsData = { date: Date; in: number; out: number }[];
export async function getCheckinsStats(timeRange: string): Promise<{
  success: boolean;
  error?: string;
  data?: StatsData;
}> {
  try {
    const data = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "dateTime") AS "date",
        SUM(CASE WHEN direction = 'IN' THEN 1 ELSE 0 END)::int AS "in",
        SUM(CASE WHEN direction = 'OUT' THEN 1 ELSE 0 END)::int AS "out"
      FROM "checkin"
      WHERE "dateTime" >= ${getStartDate(timeRange)}
      GROUP BY DATE_TRUNC('day', "dateTime")
      ORDER BY "date" ASC;
    `;

    return { success: true, data: data as StatsData };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: undefined,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

const getStartDate = (timeRange: string) => {
  const referenceDate = new Date();
  let daysToSubtract = 90;
  if (timeRange === "30d") {
    daysToSubtract = 30;
  } else if (timeRange === "7d") {
    daysToSubtract = 7;
  }
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  return startDate;
};
