"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Role } from "@/prisma/lib/generated/prisma/browser";
import { DialogClose } from "@/components/ui/dialog";
import { User } from "./types";
import { userAddUpdateAction as userAddUpdateAction } from "./user-add-update-action";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import * as React from "react";
import { Control, Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { FormSelectField } from "@/components/FormSelectField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formSchema } from "./user-form-schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SubmitButton({
  pendingLabel = "Updating",
  label = "Update user",
}: {
  pendingLabel?: string;
  label?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingLabel}...
        </>
      ) : (
        label
      )}
    </Button>
  );
}

type UserFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];

    _form?: string[];
  };
  message?: string;
  success?: boolean;
};

export function UserAddEditForm({ user }: { user: User | null }) {
  const { replace } = useRouter();
  const initialState: UserFormState = { message: "", success: undefined };
  const { isAdmin } = useCurrentSession();

  const { control } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const addEditUser = userAddUpdateAction.bind(null, user?.id ?? null);

  const [state, formAction] = useActionState(addEditUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      replace("/users", { scroll: false });
    }
    if (state.success === false) {
      toast.error(state.message);
    }
  }, [state.success, state.message, replace]);

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <FormSelectField
                fieldState={fieldState}
                field={field}
                items={
                  isAdmin
                    ? Object.keys(Role).map((k) => ({
                        id: k,
                        name: k,
                      }))
                    : [{ id: Role.TERMINAL, name: Role.TERMINAL }]
                }
                errors={state.errors}
                name="role"
                label="Role"
                required
              />
            )}
          />
          {isAdmin && (
            <>
              <PasswordField control={control} />
              <PasswordField
                control={control}
                name="confirmPassword"
                id="confirm-password"
                label="Confirm Password"
              />
            </>
          )}

          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton
              pendingLabel={user ? "Updating" : "Adding"}
              label={user ? "Update user" : "Add user"}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordField({
  control,
  name = "password",
  id = "password",
  label = "Password",
}: {
  control: Control<z.infer<typeof formSchema>>;
  name?: "confirmPassword" | "password";
  id?: string;
  label?: string;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>
              {label} <span className="text-red-500">*</span>
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...field}
                type={showPassword ? "text" : "password"}
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
