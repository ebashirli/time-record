import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { Role } from "@/prisma/lib/generated/prisma/enums";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.TERMINAL,
        input: false,
      },
      gateId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
});
