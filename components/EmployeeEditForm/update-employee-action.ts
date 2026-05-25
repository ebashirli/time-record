"use server";

import { revalidatePath } from "next/cache";
import {
  employeeFormSchema,
  type EmployeeFormState,
} from "./employee-form-schema";
import prisma from "@/lib/prisma";

export async function updateEmployee(
  employeeId: string,
  prevState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  try {
    // Convert FormData to object

    const rawData = {
      tab: formData.get("tab"),

      firstName: formData.get("firstName") || undefined,
      middleName: formData.get("middleName") || undefined,
      patronymic: formData.get("patronymic") || undefined,
      lastName: formData.get("lastName") || undefined,
      fullName: formData.get("fullName") || undefined,

      sex: formData.get("sex") || undefined,
      nationality: formData.get("nationality") || undefined,

      birthDate: formData.get("birthDate") || undefined,
      bloodType: formData.get("bloodType") || undefined,

      idCardSerie: formData.get("idCardSerie") || undefined,
      idCardNo: formData.get("idCardNo") || undefined,
      idCardPin: formData.get("idCardPin") || undefined,
      cardId: formData.get("cardId") || undefined,

      companyId: formData.get("companyId") || undefined,
      departmentId: formData.get("departmentId") || undefined,
      positionId: formData.get("positionId") || undefined,
      shift: formData.get("shift") || undefined,
      hireDate: formData.get("hireDate") || undefined,
      terminationDate: formData.get("terminationDate") || undefined,
      isActive: formData.get("isActive") || undefined,

      phoneNumber: formData.get("phoneNumber") || undefined,
      emergencyPhoneNumber: formData.get("emergencyPhoneNumber") || undefined,
      image: formData.get("image") || undefined,
    };

    // Validate with Zod
    const validatedFields = employeeFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed. Please check the form.",
        // rawData,
        success: false,
      };
    }

    const data = validatedFields.data;

    // Check if idCardPin is unique (excluding current employee)

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee)
      return {
        errors: {},
        message: "Employee not found",
        success: false,
      };

    // // Check if cardId is unique (excluding current employee)
    // const existingCard = await prisma.employee.findFirst({
    //   where: {
    //     cardId: data.cardId ,
    //     NOT: { id: employeeId },
    //   },
    // });

    // if (existingCard) {
    //   return {
    //     errors: {
    //       cardId: ["This Card ID is already in use"],
    //     },
    //     message: "Card ID must be unique",
    //     success: false,
    //   };
    // }

    // Convert date strings to Date objects
    const updateData = {
      ...data,
      tab: undefined,
      sex: data.sex ? data.sex : undefined,
      shift: data.shift ? data.shift : undefined,
      bloodType: data.bloodType ? data.bloodType : undefined,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
      terminationDate: data.terminationDate
        ? new Date(data.terminationDate)
        : null,
      companyId: data.companyId ?? undefined,
      departmentId: data.departmentId ?? undefined,
      positionId: data.positionId ?? undefined,
    };

    // Update employee in database
    await prisma.employee.update({
      where: { id: employeeId },
      data: updateData,
    });

    revalidatePath("/employees");
    revalidatePath(`/employees/${employeeId}`);

    return {
      message: "Employee updated successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error updating employee:", error);
    return {
      errors: {
        _form: ["Failed to update employee. Please try again."],
      },
      message: "An error occurred while updating the employee",
      success: false,
    };
  }
}
