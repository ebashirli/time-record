"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

type Error = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

const GoogleLoginButton = () => {
  // const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<null | Error>(null);

  async function handleSocialSignIn(provider: "google" | "github") {
    // setLoading(false);
    setError(null);
    console.log({ provider });
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    if (error) setError(error);
  }

  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleSocialSignIn("google")}
      >
        Login with Google
      </Button>

      {error && <p>{error?.message}</p>}
    </>
  );
};

export default GoogleLoginButton;
