import {
  BloodType,
  Nationality,
  Sex,
  Shift,
} from "@/prisma/lib/generated/prisma/browser";
import { z } from "zod";

// Enums matching your Prisma schema
export const IdCardSerieEnum = z.enum(["AZE", "AA", "MYI"]);
export const NationalityEnum = z.enum([
  Nationality.AZERBAIJANI,
  Nationality.TURKISH,
  Nationality.RUSSIAN,
]);
export const SexEnum = z.enum([Sex.MALE, Sex.FEMALE]);
export const BloodTypeEnum = z.enum([
  BloodType.O_I_RH_POSITIVE,
  BloodType.O_I_RH_NEGATIVE,
  BloodType.A_II_RH_POSITIVE,
  BloodType.A_II_RH_NEGATIVE,
  BloodType.B_III_RH_POSITIVE,
  BloodType.B_III_RH_NEGATIVE,
  BloodType.AB_IV_RH_POSITIVE,
  BloodType.AB_IV_RH_NEGATIVE,
]);
export const ShiftEnum = z.enum([
  Shift.DAY,
  Shift.EVENING,
  Shift.NIGHT,
  Shift.OFFICE,
]);

export const TabEnum = z.enum([
  "personal",
  "identification",
  "employment",
  "contact",
]);

export const formSchema = z
  .object({
    tab: TabEnum,

    firstName: z.string().optional(),
    middleName: z.string().optional(),
    patronymic: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),

    idCardSerie: IdCardSerieEnum.optional().nullable(),
    idCardNo: z.string().max(50).optional().nullable(),
    idCardPin: z
      .string()
      .min(7, "PIN must be at least 7 characters")
      .max(20)
      .regex(
        /^[A-Z0-9]+$/,
        "PIN must contain only uppercase letters and numbers",
      )
      .optional()
      .nullable(),

    nationality: NationalityEnum.optional().nullable(),
    sex: SexEnum.optional().nullable(),

    birthDate: z.string().optional().nullable(), // ISO date string
    bloodType: BloodTypeEnum.optional().nullable(),

    phoneNumber: z
      .string()
      .regex(/^[\d\s+()-]*$/, "Invalid phone number format")
      .max(20)
      .optional()
      .nullable(),
    emergencyPhoneNumber: z
      .string()
      .regex(/^[\d\s+()-]*$/, "Invalid phone number format")
      .max(20)
      .optional()
      .nullable(),

    shift: ShiftEnum.optional().nullable(),
    hireDate: z.string().optional().nullable(),
    terminationDate: z.string().optional().nullable(),

    cardId: z.string().optional(),

    companyId: z.string().optional().nullable(),
    departmentId: z.string().optional().nullable(),
    positionId: z.string().optional().nullable(),

    image: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const checkRequired = (
      value: string | undefined | null,
      fieldName: string,
      label: string,
    ) => {
      if (!value || value.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: `${label} is required`,
          path: [fieldName],
        });
      }
    };

    if (data.tab === "personal") {
      checkRequired(data.fullName, "fullName", "Full name");
    }

    if (data.tab === "employment") {
      checkRequired(data.companyId, "companyId", "Company");
      checkRequired(data.departmentId, "departmentId", "Department");
      checkRequired(data.positionId, "positionId", "Position");
    }

    if (data.tab === "identification") {
      checkRequired(data.cardId, "cardId", "Card ID");
    }
  });

export type EmployeeFormValues = z.infer<typeof formSchema>;

export type EmployeeFormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    idCardPin?: string[];
    cardId?: string[];
    companyId?: string[];
    departmentId?: string[];
    positionId?: string[];
    phoneNumber?: string[];
    emergencyPhoneNumber?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};
