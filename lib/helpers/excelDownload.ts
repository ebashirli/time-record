import ExcelJS from "exceljs";

import prisma from "../prisma";
import { Employee } from "@/prisma/lib/generated/prisma/client";
import path from "path";

export async function generateExcelBuffer<T, U>(
  data: T[],
  prepRow: (item: T, index: number) => U,
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("results");

  worksheet.columns = [
    { header: "Sıra sayı", key: "#", width: 10 },
    { header: "Tam ad", key: "fullName" },
    { header: "Kart nömrəsi", key: "cardId" },
    { header: "Şirkət", key: "company" },
    { header: "Şöbə", key: "department" },
    { header: "Vəzifə", key: "position" },
    { header: "Giriş tarixi", key: "hireDate" },
    { header: "Növbə", key: "shift" },
    { header: "Vətəndaşlığı", key: "nationality" },
    { header: "ŞV/ MİV seriyası", key: "idCardSerie" },
    { header: "ŞV/MİV nömrəsi", key: "idCardNo" },
    { header: "FİN kodu", key: "idCardPin" },
    { header: "Cinsi", key: "sex" },
    { header: "Doğum tarixi", key: "birthDate" },
    { header: "Qan qrupu", key: "bloodType" },
    { header: "Telefon nömrəsi", key: "phoneNumber" },
    {
      header: "Fövqəladə hal üçün telefon nömrəsi",
      key: "emergencyPhoneNumber",
    },
    { header: "Şəkil", key: "image" },
    { header: "Giriş-çıxış sayı", key: "checkins" },
  ];

  // 5. Add rows from Prisma query result
  data?.forEach((item, i) => {
    worksheet.addRow(prepRow(item, i + 1));
  });

  // const filePath = path.join(__dirname, "my_excel_file.xlsx");

  // const targetFolder = "G:/My Drive/3-S2 Project/6. Reports/STP/1-Daily Report";
  const targetFolder = "D:/DataServer/Idari Ishler/Vusal Abdullayev/backup/KART/Images";
  const fileName = "daily_report.xlsx"; // Change this to whatever you want to name the file

  const filePath = path.join(targetFolder, fileName);

  await workbook.xlsx.writeFile(filePath);
  console.log(`File successfully saved to ${filePath}`);

  // 6. Format the Excel file into a buffer
  // const buffer = await workbook.xlsx.writeBuffer();
  // return buffer;
}

const data = await prisma.employee.findMany({
  include: {
    company: { select: { name: true } },
    department: { select: { name: true } },
    position: { select: { name: true } },
    _count: {
      select: { checkins: true },
    },
  },
});

generateExcelBuffer(data, propRow);

function propRow(
  item: Employee & {
    company: {
      name: string;
    };
    department: {
      name: string;
    };
    position: {
      name: string;
    };
    _count: {
      checkins: number;
    };
  },
  index: number,
) {
  return {
    "#": index,
    fullName: item.fullName,
    cardId: item.cardId,
    company: item.company.name,
    department: item.department.name,
    position: item.position.name,
    hireDate: item.hireDate,
    shift: item.shift,
    nationality: item.nationality,
    idCardSerie: item.idCardSerie,
    idCardNo: item.idCardNo,
    idCardPin: item.idCardPin,
    sex: item.sex,
    birthDate: item.birthDate,
    // A_II_RH_NEGATIVE
    // B_III_RH_POSITIVE

    bloodType: item.bloodType?.replace("_RH_", ")RH ").replace("_", "("),
    phoneNumber: item.phoneNumber,
    emergencyPhoneNumber: item.emergencyPhoneNumber,
    image: item.image,
    checkins: item._count.checkins,
  };
}
