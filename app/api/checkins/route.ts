import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.checkin.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = "Error fetching check-ins";
    console.error(`${message}: ${error}`);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { employeeId } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 },
      );
    }

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { company: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    // Create check-in
    // const checkin = await prisma.checkin.create({
    //   data: {
    //     employeeId: employeeId,
    //     checkedById: session.user.id,
    //     dateTime: new Date(),
    //     // direction:
    //   },
    //   include: {
    //     employee: {
    //       include: {
    //         company: true,
    //       },
    //     },
    //   },
    // });

    return NextResponse.json({
      success: true,
      // checkin,
      employee: {
        name: `${employee.firstName} ${employee.lastName}`,
        company: employee.company.name,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
