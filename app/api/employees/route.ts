// app/api/employees/route.ts
// Example API route with CASL authorization
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAbilityFromSession } from "@/lib/casl/abilities";
import { authorize, AuthorizationError } from "@/lib/casl/server-utils";
import { accessibleBy } from "@casl/prisma";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with employee relationship
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { employee: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create ability for this user
    const ability = createAbilityFromSession(user);

    // Fetch only employees the user can read
    const employees = await prisma.employee.findMany({
      where: accessibleBy(ability, "read").Employee,
      include: {
        company: true,
        department: true,
        position: true,
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { employee: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ability = createAbilityFromSession(user);

    // Check if user can create employees
    authorize(ability, "create", "Employee");

    const data = await request.json();

    const newEmployee = await prisma.employee.create({
      data,
    });

    return NextResponse.json({ employee: newEmployee }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
