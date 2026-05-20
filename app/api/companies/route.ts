import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = parseInt(searchParams.get("skip") || "0");
    const where = { NOT: { isActive: false } };

    const data = await prisma.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        works: true,
      },
      take: limit,
      skip: skip,
    });

    return NextResponse.json({
      data,
      total: await prisma.company.count({ where }),
      skip,
      limit,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
