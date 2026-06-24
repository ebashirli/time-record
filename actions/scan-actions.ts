"use server";
import prisma from "@/lib/prisma";
import { Direction } from "@/prisma/lib/generated/prisma/enums";
import { Prisma } from "@/prisma/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";
import getCurrentSession from "@/lib/getCurrentSession";

export type GetEmployeeByCardIdError = {
  error: string;
  code: "UNAUTHORIZED" | "NO_GATE" | "NOT_FOUND";
};

export async function getEmployeeByCardId(
  cardId: string,
): Promise<{ data: EmployeeScanResult } | GetEmployeeByCardIdError> {
  if (!cardId) return { error: "Card ID not provided", code: "NOT_FOUND" };

  const { user } = await getCurrentSession();
  if (!user) return { error: "Unauthorized", code: "UNAUTHORIZED" };

  const gateId = user.gateId;
  if (!gateId) {
    return {
      error: "Terminal heç bir keçidə (gate) təyin olunmayıb",
      code: "NO_GATE",
    };
  }

  const employee = await prisma.employee.findFirst({
    where: { cardId, isActive: { not: false } },
    include: {
      company: true,
      position: true,
      department: true,
      checkins: {
        where: { checkedBy: { gateId } },
        orderBy: { dateTime: "desc" },
        take: 1,
        select: {
          direction: true,
          dateTime: true,
        },
      },
    },
  });
  if (!employee) return { error: "Employee not found", code: "NOT_FOUND" };

  return {
    data: {
      id: employee.id,
      cardId: employee.cardId,
      fullName: employee.fullName ?? "",
      companyName: employee.company.name,
      departmentName: employee.department.name,
      positionName: employee.position.name,
      lastAction: employee.checkins[0]?.direction ?? null,
      lastActionAt: employee.checkins[0]?.dateTime.toISOString() ?? null,
      cachedAt: new Date().toISOString(),
      image: employee.image,
    },
  };
}

type EmployeeScanResult = {
  id: string;
  cardId: string;
  fullName: string;
  companyName: string;
  departmentName: string;
  positionName: string;
  lastAction: Direction | null;
  lastActionAt: string | null;
  cachedAt: string;
  image: string | null;
};

export async function submitCheckin({
  clientEventId,
  cardId,
  action,
  occurredAt,
}: {
  clientEventId: string;
  cardId: string;
  action: Direction;
  occurredAt: string;
}): Promise<{ status: "recorded" | "duplicate"; checkinId: string }> {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const existing = await prisma.checkin.findUnique({ where: { clientEventId } });
  if (existing) return { status: "duplicate", checkinId: existing.id };

  const employee = await prisma.employee.findUnique({ where: { cardId } });
  if (!employee) throw new Error("Employee not found");

  try {
    const checkin = await prisma.checkin.create({
      data: {
        employeeId: employee.id,
        direction: action,
        checkedById: user.id,
        dateTime: new Date(occurredAt),
        clientEventId,
      },
      select: { id: true },
    });
    revalidatePath("/scanner");
    revalidatePath("/attendance-tracking-system");
    return { status: "recorded", checkinId: checkin.id };
  } catch (err) {
    // Two near-simultaneous retries can both pass the existence check above
    // before either insert completes — the unique constraint is the real guard.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const raceWinner = await prisma.checkin.findUnique({
        where: { clientEventId },
      });
      if (raceWinner) return { status: "duplicate", checkinId: raceWinner.id };
    }
    throw err;
  }
}

export async function getEmployeeChanges(since: string | null) {
  const changes = await prisma.employee.findMany({
    where: since ? { updatedAt: { gt: new Date(since) } } : {},
    select: {
      cardId: true,
      fullName: true,
      isActive: true,
      company: { select: { name: true } },
      department: { select: { name: true } },
      position: { select: { name: true } },
    },
  });

  return {
    changes: changes.map((employee) => ({
      cardId: employee.cardId,
      fullName: employee.fullName ?? "",
      companyName: employee.company.name,
      departmentName: employee.department.name,
      positionName: employee.position.name,
      isActive: employee.isActive ?? true,
    })),
    syncedAt: new Date().toISOString(),
  };
}
