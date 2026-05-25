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
  console.log({
    employeeId,
    prevState,
    formData,
  });
  try {
    // Convert FormData to object
    const rawData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName") || null,
      patronymic: formData.get("patronymic") || null,
      lastName: formData.get("lastName"),
      fullName: formData.get("fullName") || null,
      idCardSerie: formData.get("idCardSerie") || null,
      idCardNo: formData.get("idCardNo") || null,
      idCardPin: formData.get("idCardPin") || null,
      nationality: formData.get("nationality") || null,
      sex: formData.get("sex") || null,
      birthDate: formData.get("birthDate") || null,
      bloodType: formData.get("bloodType") || null,
      phoneNumber: formData.get("phoneNumber") || null,
      emergencyPhoneNumber: formData.get("emergencyPhoneNumber") || null,
      shift: formData.get("shift") || null,
      hireDate: formData.get("hireDate") || null,
      terminationDate: formData.get("terminationDate") || null,
      cardId: formData.get("cardId"),
      departmentId: formData.get("departmentId"),
      positionId: formData.get("positionId"),
      image: formData.get("image") || null,
      isActive: formData.get("isActive") === "true",
    };

    // Validate with Zod
    const validatedFields = employeeFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed. Please check the form.",
        success: false,
      };
    }

    const data = validatedFields.data;

    // Check if idCardPin is unique (excluding current employee)
    if (data.idCardPin) {
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          idCardPin: data.idCardPin,
          NOT: { id: employeeId },
        },
      });

      if (existingEmployee) {
        return {
          errors: {
            idCardPin: ["This ID Card PIN is already in use"],
          },
          message: "ID Card PIN must be unique",
          success: false,
        };
      }
    }

    // Check if cardId is unique (excluding current employee)
    const existingCard = await prisma.employee.findFirst({
      where: {
        cardId: data.cardId,
        NOT: { id: employeeId },
      },
    });

    if (existingCard) {
      return {
        errors: {
          cardId: ["This Card ID is already in use"],
        },
        message: "Card ID must be unique",
        success: false,
      };
    }

    // Convert date strings to Date objects
    const updateData = {
      ...data,
      sex: data.sex ? data.sex : null,
      shift: data.shift ? data.shift : null,
      bloodType: data.bloodType ? data.bloodType : null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      hireDate: data.hireDate ? new Date(data.hireDate) : null,
      terminationDate: data.terminationDate
        ? new Date(data.terminationDate)
        : null,
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
