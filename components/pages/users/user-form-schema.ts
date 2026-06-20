import { Role } from "@/prisma/lib/generated/prisma/enums";
import { z } from "zod";

export const RoleEnum = z.enum([
  Role.ADMIN,
  Role.HR,
  Role.MANAGER,
  Role.TERMINAL,
]);

export const formSchema = z
  .object({
    id: z.string().optional().nullable(),
    currentUserRole: RoleEnum.optional().nullable(),

    name: z.string(),
    email: z.string(),
    role: RoleEnum.optional().nullable(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    console.log({ data, ctx });
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

    checkRequired(data.name, "name", "Email");
    checkRequired(data.email, "email", "Email");
    checkRequired(data.role, "role", "Role");
    checkRequired(data.password, "password", "Password");
  });

export type UserFormValues = z.infer<typeof formSchema>;

export type UserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
};
