import { getCheckins } from "@/actions/getChekins";
import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { CheckinRow } from "@/components/pages/checkins/types";


export async function GET(request: NextRequest) {
  const paramsString = request.nextUrl.searchParams.toString();
  const { data } = await getCheckins(paramsString);

  const buffer = await generateExcelBuffer(data);

  // 2. Return a standard web Response object
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": 'attachment; filename="checkins_report.xlsx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}

async function generateExcelBuffer(checkins?: CheckinRow[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("results");

  // 3. Define columns and headers
  worksheet.columns = [
    { header: "#", key: "#", width: 10 },
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
  checkins?.forEach((checkin) => {
    worksheet.addRow({
      "#": checkin["#"],
      name: checkin.fullName,
      company: checkin.companyName,
      position: checkin.positionName,
      department: checkin.departmentName,
      terminal: checkin.checkedByName,
      dateTime: checkin.dateTime,
      direction: checkin.direction === "In" ? "Giriş" : "Çıxış",
    });
  });

  // 6. Format the Excel file into a buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
