"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";

type Error = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

const LoginForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<null | Error>(null);

  async function handleSocialSignIn(provider: "google" | "github") {
    setLoading(false);
    setError(null);
    console.log({ provider });
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    if (error) {
      setError(error);
    }
  }

  return (
    <div>
      <button onClick={() => handleSocialSignIn("google")}>
        Sign{loading ? "ing" : ""} in with google
      </button>

      {error && <p>{error?.message}</p>}
    </div>
  );
};

export default LoginForm;
