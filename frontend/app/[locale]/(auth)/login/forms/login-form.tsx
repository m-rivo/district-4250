"use client";

import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Link } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";

const initialState: LoginState = {};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (!state.error) return;

    toast.add({
      type: "error",
      title: "Login failed",
      description: state.error,
    });
  }, [state.errorId]);

  const hasError = Boolean(state.error);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-email">Email</FieldLabel>

          <Input
            id="form-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={hasError}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-password">Password</FieldLabel>

          <Input
            id="form-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={hasError}
            required
          />
        </Field>
      </FieldGroup>

      <Button className="mt-6 w-full" type="submit" disabled={pending}>
        {pending ? (
          <>
            <Spinner data-icon="inline-start" />
            Logging in
          </>
        ) : (
          "Login"
        )}
      </Button>

      <Link href="/signup">
        <Button className="mt-2 w-full" variant="link" type="button">
          Don&apos;t have an account? Sign up
        </Button>
      </Link>

      <Button className="mt-2 w-full" variant="link" type="button">
        Forgot password?
      </Button>
    </form>
  );
}
