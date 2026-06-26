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
    { header: "Full Name", key: "name", width: 25 },
    { header: "Card ID", key: "cardId", width: 20 },
    { header: "Company", key: "company", width: 25 },
    { header: "Department", key: "department", width: 25 },
    { header: "Position", key: "position", width: 25 },

    { header: "first Name", key: "firstName", width: 25 },
    { header: "middle Name", key: "middleName", width: 25 },
    { header: "patronymic", key: "patronymic", width: 25 },
    { header: "last Name", key: "lastName", width: 25 },
    { header: "ID Card Serie", key: "idCardSerie", width: 25 },
    { header: "ID Card No", key: "idCardNo", width: 25 },
    { header: "ID Card PIN", key: "idCardPin", width: 25 },
    { header: "Nationality", key: "nationality", width: 25 },
    { header: "Sex", key: "sex", width: 25 },
    { header: "Birth Date", key: "birthDate", width: 25 },
    { header: "Blood Type", key: "bloodType", width: 25 },
    { header: "Phone Number", key: "phoneNumber", width: 25 },
    { header: "Emergency Phone Number", key: "emergencyPhoneNumber", width: 25 },
    { header: "Shift", key: "shift", width: 25 },
    { header: "Hire Date", key: "hireDate", width: 25 },
    { header: "Termination Date", key: "terminationDate", width: 25 },
    { header: "Created at", key: "createdAt", width: 25 },
    { header: "Updated at", key: "updatedAt", width: 25 },
    { header: "Is active", key: "isActive", width: 25 },
    { header: "Image", key: "image", width: 25 },
  ];

  employees?.forEach((employee) => {
    worksheet.addRow({
      "#": employee["#"],
      ...employee,
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
