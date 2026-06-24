"use server";

import { User } from "@/components/pages/users/types";
import { Role, type Prisma } from "@/prisma/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { hashPassword } from "better-auth/crypto";

export async function getUsers(
  paramsString: string,
  paginate: boolean = true,
): Promise<{
  success: boolean;
  error?: string;
  data?: User[];
  total?: number;
}> {
  try {
    const params = new URLSearchParams(paramsString);
    const where = buildUsersWhere(params);

    const page = Math.max(0, parseInt(params.get("page") || "0", 10) || 0);
    const limit = Math.max(1, parseInt(params.get("limit") || "20", 10) || 20);

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        // orderBy: { dateTime: "desc" },
        include: { gate: { select: { name: true } } },
        ...(paginate && { skip: limit * page, take: limit }),
      }),
      prisma.user.count({ where }),
    ]);

    const result: User[] =
      data?.map((user, i) => ({
        "#": i + 1 + (paginate ? page * (limit ?? 0) : 0),
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
        gateName: user.gate?.name ?? null,
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

export async function createUser({
  email,
  name,
  password,
  role = Role.TERMINAL,
}: {
  email: string;
  name: string;
  password: string;
  role?: Role;
}) {
  const user = await prisma.user.create({
    data: { email, role, name, emailVerified: true },
  });

  const account = await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: user.id,
      userId: user.id,
      providerId: "credential",
      password: await hashPassword(password),
    },
  });

  return { success: true, data: account };
}

function buildUsersWhere(params: URLSearchParams): Prisma.UserWhereInput {
  const query = params.get("query") || undefined;
  const where: Prisma.UserWhereInput = {};
  const user: Prisma.UserWhereInput = {};

  if (query) {
    user.name = { contains: query, mode: "insensitive" };
  }

  return where;
}
