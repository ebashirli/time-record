import { z } from "zod";

// Enums matching your Prisma schema
export const IdCardSerieEnum = z.enum(["AZE", "AA", "MYI"]);
export const NationalityEnum = z.enum([
  "Azerbaijan",
  "Turkey",
  "Russia",
  "Other",
]);
export const SexEnum = z.enum(["Male", "Female"]);
export const BloodTypeEnum = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);
export const ShiftEnum = z.enum(["Day", "Night", "Rotating"]);

export const employeeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  middleName: z.string().max(100).optional().nullable(),
  patronymic: z.string().max(100).optional().nullable(),
  lastName: z.string().min(1, "Last name is required").max(100),
  fullName: z.string().max(300).optional().nullable(),

  idCardSerie: IdCardSerieEnum.optional().nullable(),
  idCardNo: z.string().max(50).optional().nullable(),
  idCardPin: z
    .string()
    .min(7, "PIN must be at least 7 characters")
    .max(20)
    .regex(/^[A-Z0-9]+$/, "PIN must contain only uppercase letters and numbers")
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

  cardId: z.string().min(1, "Card ID is required").max(100),

  departmentId: z.string().min(1, "Department is required"),
  positionId: z.string().min(1, "Position is required"),

  image: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export type EmployeeFormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    idCardPin?: string[];
    cardId?: string[];
    departmentId?: string[];
    positionId?: string[];
    phoneNumber?: string[];
    emergencyPhoneNumber?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};
