import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = parseInt(searchParams.get("skip") || "0");

    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        position: true,
        company: true,
        department: true,
      },
      take: limit,
      skip: skip,
    });

    return NextResponse.json({
      employees,
      total: await prisma.employee.count(),
      skip,
      limit,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}
