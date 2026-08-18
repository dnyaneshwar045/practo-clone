"use client";

import { useFormState } from "react-dom";
import { login } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function LoginForm() {
  const [state, formAction] = useFormState(login, {});

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} />
      <Field label="Email">
        <input name="email" type="email" required className={input} placeholder="you@example.com" />
      </Field>
      <Field label="Password">
        <input name="password" type="password" required className={input} placeholder="••••••••" />
      </Field>
      <SubmitButton className="w-full">Log in</SubmitButton>
    </form>
  );
}
