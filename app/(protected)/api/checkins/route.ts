import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import ExcelJS from "exceljs";
import { Direction } from "@/prisma/lib/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const companyId = searchParams.get("companyId") || undefined;

    const where = {
      dateTime: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
      employee: { companyId },
    };

    const checkins = await prisma.checkin.findMany({
      where,
      include: {
        employee: {
          select: {
            fullName: true,
            company: { select: { name: true } },
            position: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
        checkedBy: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2. Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("results");

    // 3. Define columns and headers
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Company", key: "company", width: 25 },
      { header: "Position", key: "position", width: 25 },
      { header: "Department", key: "department", width: 25 },
      { header: "Terminal", key: "terminal", width: 25 },
      { header: "Date and Time", key: "dateTime", width: 25 },
      { header: "Direction", key: "direction", width: 25 },
    ];

    // 4. Style the header row (Optional but recommended for professional look)
    // const headerRow = worksheet.getRow(1);
    // headerRow.font = {
    //   name: "Arial",
    //   size: 12,
    //   bold: true,
    //   color: { argb: "FFFFFF" },
    // };
    // headerRow.fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "1F4E78" }, // Dark blue background
    // };
    // headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // 5. Add rows from Prisma query result
    checkins.forEach((checkin) => {
      worksheet.addRow({
        name: checkin.employee.fullName,
        company: checkin.employee.company.name,
        position: checkin.employee.position.name,
        department: checkin.employee.department.name,
        terminal: checkin.checkedBy.name,
        dateTime: checkin.dateTime,
        direction: checkin.direction === Direction.IN ? "Giriş" : "Çıxış",
      });
    });

    // 6. Format the Excel file into a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 7. Return the response with proper headers to trigger automatic browser download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="checkins_report.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Excel generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
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
        name: employee.fullName || `${employee.firstName} ${employee.lastName}`,
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
