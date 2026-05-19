"use server";

import * as XLSX from "xlsx";

import prisma from "@/lib/prisma";
import {
  BloodType,
  IdCardSerie,
  Nationality,
  Sex,
  Shift,
} from "@/prisma/lib/generated/prisma/browser";

type Row = {
  firstName?: string;
  middleName?: string;
  patronymic?: string;
  lastName?: string;
  fullName?: string;
  idCardSerie?: string;
  idCardNo?: string;
  idCardPin?: string;
  nationality?: string;
  sex?: string;
  birthDate?: string;
  bloodType?: string;
  phoneNumber?: string;
  emergencyPhoneNumber?: string;
  company: string;
  department: string;
  position: string;
  shift?: string;
  hireDate?: string;
  cardId: string;
};

export async function uploadExcel(formData: FormData) {
  try {
    const file = formData.get("excelFile") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    // 1. Convert the file to an ArrayBuffer, then to a Node.js Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Parse the Excel buffer
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Target the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 3. Convert sheet data to JSON array
    // raw: false ensures dates/numbers are formatted, raw: true keeps native types.
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false,
    }) as Row[];

    if (rawData.length === 0) {
      return { success: false, error: "The excel file is empty." };
    }

    const data = await Promise.all(
      rawData.slice(1).map(async (row) => await proccessRow(row as Row)),
    );

    const batchPayload = await prisma.employee.createMany({ data });
    if (!batchPayload?.count) return { error: "Something went wrong!" };

    return {
      success: true,
      message: `Successfully inserted ${batchPayload.count} rows.`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

const nationality = {
  AZERBAIJANI: Nationality.AZERBAIJANI,
  RUSSIAN: Nationality.RUSSIAN,
  TURKISH: Nationality.TURKISH,
};

const shift = {
  DAY: Shift.DAY,
  EVENING: Shift.EVENING,
  NIGHT: Shift.NIGHT,
  OFFICE: Shift.OFFICE,
};

const sex = {
  MALE: Sex.FEMALE,
  FEMALE: Sex.MALE,
};

const bloodType = {
  "O(I)RH+": BloodType.O_I_RH_POSITIVE,
  "O(I)RH-": BloodType.O_I_RH_NEGATIVE,
  "A(II)RH+": BloodType.A_II_RH_POSITIVE,
  "A(II)RH-": BloodType.A_II_RH_NEGATIVE,
  "B(III)RH+": BloodType.B_III_RH_POSITIVE,
  "B(III)RH-": BloodType.B_III_RH_NEGATIVE,
  "AB(IV)RH+": BloodType.AB_IV_RH_POSITIVE,
  "AB(IV)RH-": BloodType.AB_IV_RH_NEGATIVE,
};

const idCardSerie = {
  AA: IdCardSerie.AA,
  AZE: IdCardSerie.AZE,
  MYİ: IdCardSerie.MYI,
};

async function proccessRow(row: Row) {
  // 2. Upsert Company and connect Work
  const company = await prisma.company.upsert({
    where: { name: row.company },
    update: {
      // works: {
      //   connect: { id: work.id },
      // },
    },
    create: { name: row.company },
    // works: {
    //   connect: { id: work.id },
    // },
  });
  // 3. Upsert Department

  const department = await prisma.department.upsert({
    where: { name: row.department },
    update: {},
    create: { name: row.department },
  });
  // 4. Upsert Position
  const position = await prisma.position.upsert({
    where: { name: row.position },
    update: {},
    create: { name: row.position },
  });
  // 5. Create Employee

  const data = {
    firstName: row.firstName,
    middleName: row.middleName,
    patronymic: row.patronymic,
    lastName: row.lastName,
    fullName: row.fullName,
    idCardNo: String(row.idCardNo),
    idCardPin: row.idCardPin,
    birthDate: row.birthDate ? new Date(Date.parse(row.birthDate)) : undefined,
    phoneNumber: String(row.phoneNumber),
    emergencyPhoneNumber: row.emergencyPhoneNumber,
    hireDate: row.hireDate ? new Date(Date.parse(row.hireDate)) : undefined,
    cardId: row.cardId,
    companyId: company.id,
    departmentId: department.id,
    positionId: position.id,

    idCardSerie: idCardSerie[row.idCardSerie as keyof typeof idCardSerie],
    bloodType: bloodType[row.bloodType as keyof typeof bloodType],
    nationality: nationality[row.nationality as keyof typeof nationality],
    shift: shift[row.shift as keyof typeof shift],
    sex: sex[row.sex as keyof typeof sex],
  };

  return data;
}
