import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = parseInt(searchParams.get("skip") || "0");
    // const where = { NOT: { isActive: true } };

    const data = await prisma.employee.findMany({
      where: { NOT: { isActive: false } },
      orderBy: { createdAt: "desc" },
      select: {
        company: true,
        department: true,
        position: true,
        fullName: true,
        id: true,
      },
      take: limit,
      skip: skip,
    });

    return NextResponse.json({
      data,
      total: await prisma.employee.count(),
      skip,
      limit,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
