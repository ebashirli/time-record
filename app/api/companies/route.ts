import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = parseInt(searchParams.get("skip") || "0");

    const companies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        works: true,
      },
      take: limit,
      skip: skip,
    });

    return NextResponse.json({
      companies,
      total: await prisma.company.count(),
      skip,
      limit,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 },
    );
  }
}
