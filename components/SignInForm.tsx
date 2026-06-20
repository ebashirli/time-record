"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import * as React from "react";
import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { signIn } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";

const formSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function SignInFormInner({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/dashboard";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:
        process.env.NODE_ENV === "production" ? "" : "ebesirli@kolin.com.tr",
      password: process.env.NODE_ENV === "production" ? "" : "Password123!",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    return signIn.email({ ...data, callbackURL });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
                        required
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
              <PasswordField control={form.control} />
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function SignInForm(props: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SignInFormInner {...props} />
    </Suspense>
  );
}

function PasswordField({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <Controller
      name="password"
      control={control}
      render={({ field, fieldState }) => {
        return (
          // <Field data-invalid={fieldState.invalid}>
          //   <FieldLabel htmlFor="password">Password</FieldLabel>
          //   <Input
          //     {...field}
          //     id="password"
          //     type="password"
          //     required
          //     aria-invalid={fieldState.invalid}
          //     placeholder="••••••••"
          //   />
          //   {fieldState.invalid && (
          //     <FieldError errors={[fieldState.error]} />
          //   )}
          // </Field>
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                type={showPassword ? "text" : "password"}
                required
                aria-invalid={fieldState.invalid}
                id="password"
                placeholder="••••••••"
              />
              <InputGroupAddon>
                <InputGroupText></InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Button
                  onClick={() => setShowPassword((prev) => !prev)}
                  variant="ghost"
                  type="button"
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
