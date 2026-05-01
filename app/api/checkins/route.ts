import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
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
    const body = await request.json();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const data = {
      checkedById: session!.user.id,
      employeeId: body.employeeId,
    };

    const checkin = await prisma.checkin.create({ data });
    return NextResponse.json({ success: true, data: checkin });
  } catch (error) {
    const message = "Error creating check-in";
    console.error(`${message}: ${error}`);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
