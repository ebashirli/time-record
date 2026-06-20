"use server";

import { revalidatePath } from "next/cache";
import { formSchema, type UserFormState } from "./user-form-schema";
import prisma from "@/lib/prisma";
import { Role } from "@/prisma/lib/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { hashPassword } from "better-auth/crypto";
// import { generatePassword } from "@/lib/helpers/passwordGenerator";

export async function userAddUpdateAction(
  id: string | null,
  prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  try {
    // Convert FormData to object

    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    const rawData = {
      id,
      currentUserRole: user?.role,
      name: formData.get("name") || undefined,
      email: formData.get("email") || undefined,
      role: formData.get("role") || undefined,
      password: formData.get("password") || undefined,
    };

    // Validate with Zod
    const validatedFields = formSchema.safeParse(rawData);

    console.log({ validatedFields });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed. Please check the form.",
        // rawData,
        success: false,
      };
    }

    const data = validatedFields.data;

    if (rawData.role !== Role.TERMINAL && user?.role !== Role.ADMIN)
      return {
        errors: {},
        message: "You are not allowinf to add ",
        success: false,
      };

    // Convert date strings to Date objects
    const updateData = {
      // ...data,

      role: data.role ?? Role.TERMINAL,
      name: data.name,
      email: data.email,
    };

    // Update employee in database
    // await prisma.user.upsert({
    //   where: {
    //     id: id || undefined,
    //     email: id ? undefined : data.email,
    //   },
    //   create: {
    //     role: data.role ?? Role.TERMINAL,
    //     name: data.name,
    //     email: data.email,
    //     emailVerified: true,
    //     accounts: {
    //       create: [
    //         {
    //           accountId: terminal1.id,
    //           userId: terminal1.id,
    //           id: crypto.randomUUID(),
    //           providerId: "credential",
    //           password: hashedPassword,
    //         },
    //       ],
    //     },
    //   },
    //   update: updateData,
    // });

    if (id) {
      // Update existing
      await prisma.user.update({
        where: { id },
        data: updateData,
      });
    } else {
      // 1. Create the user first to generate the ID
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          role: data.role ?? Role.TERMINAL,
          emailVerified: true,
        },
      });

      // 2. Use the new user's ID to build the account record

      const hashedPassword = await hashPassword(data.password ?? "");

      await prisma.account.create({
        data: {
          id: crypto.randomUUID(),
          userId: newUser.id,
          accountId: newUser.id, // Now you safely have access to the ID!
          providerId: "credential",
          password: hashedPassword,
        },
      });
    }

    revalidatePath("/users");
    if (id) revalidatePath(`/users/${id}`);

    return {
      message: `User ${id ? "updated" : "added"} successfully`,
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
