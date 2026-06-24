import { getEmployees } from "@/actions/getEmployees";
import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { EmployeeRow } from "@/components/pages/employees/types";

export async function GET(request: NextRequest) {
  const paramsString = request.nextUrl.searchParams.toString();
  const { data } = await getEmployees(paramsString, false);

  const buffer = await generateExcelBuffer(data);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": 'attachment; filename="employees_report.xlsx"',
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}

async function generateExcelBuffer(employees?: EmployeeRow[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("results");

  worksheet.columns = [
    { header: "#", key: "#", width: 10 },
    { header: "Name", key: "name", width: 25 },
    { header: "Card ID", key: "cardId", width: 20 },
    { header: "Company", key: "company", width: 25 },
    { header: "Department", key: "department", width: 25 },
    { header: "Position", key: "position", width: 25 },
  ];

  employees?.forEach((employee) => {
    worksheet.addRow({
      "#": employee["#"],
      name: employee.fullName,
      cardId: employee.cardId,
      company: employee.companyName,
      department: employee.departmentName,
      position: employee.positionName,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
