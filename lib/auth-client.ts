import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(), // This syncs custom fields automatically
  ],
});
