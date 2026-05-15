import { PrismaClient } from "@/prisma/lib/generated/prisma/client";
import { accessibleBy } from "@casl/prisma";
import { AppAbility } from "./abilities";
import {
  CheckinArgs,
  CompanyArgs,
  DepartmentArgs,
  EmployeeArgs,
  PositionArgs,
  WorkArgs,
} from "./types";

// Extend Prisma Client with CASL filtering
export function createAbilityAwarePrisma(
  prisma: PrismaClient,
  ability: AppAbility,
) {
  return {
    user: prisma.user.findMany.bind(prisma.user),
    employee: {
      ...prisma.employee,
      findMany: (args?: EmployeeArgs) =>
        prisma.employee.findMany({
          ...args,
          where: {
            ...args?.where,
            AND: accessibleBy(ability, "read").Employee,
          },
        }),
    },
    work: {
      ...prisma.work,
      findMany: (args?: WorkArgs) =>
        prisma.work.findMany({
          ...args,
          where: {
            ...args?.where,
            AND: accessibleBy(ability, "read").Work,
          },
        }),
    },
    checkin: {
      ...prisma.checkin,
      findMany: (args?: CheckinArgs) =>
        prisma.checkin.findMany({
          ...args,
          where: {
            ...args?.where,
            AND: accessibleBy(ability, "read").Checkin,
          },
        }),
    },
    company: {
      ...prisma.company,
      findMany: (args?: CompanyArgs) =>
        prisma.company.findMany({
          ...args,
          where: {
            ...args?.where,
            AND: accessibleBy(ability, "read").Company,
          },
        }),
    },
    department: {
      ...prisma.department,
      findMany: (args?: DepartmentArgs) =>
        prisma.department.findMany({
          ...args,
          where: {
            ...args?.where,
            AND: accessibleBy(ability, "read").Department,
          },
        }),
    },
    position: {
      ...prisma.position,
      findMany: (args?: PositionArgs) =>
        prisma.position.findMany({
          ...args,
          where: {
            ...args?.where,
            AND: accessibleBy(ability, "read").Position,
          },
        }),
    },
  };
}
