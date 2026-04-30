"use server";

import { auth } from "@/lib/auth";

type Body = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: Body) => {
  await auth.api.signInEmail({
    body: { email, password },
  });
};

export const signUp = async (
  body: Body & { name: string; confirmPassword: string },
) => {
  await auth.api.signUpEmail({ body });
};

export const signOut = async () => {
  await auth.api.signOut();
};
