"use client";

import { useFormState } from "react-dom";
import { requestDemo } from "@/lib/actions/demo";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function DemoForm({ defaults }: { defaults?: { name?: string; email?: string } }) {
  const [state, formAction] = useFormState(requestDemo, {});

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} success={state.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <input name="name" required defaultValue={defaults?.name} className={input} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required defaultValue={defaults?.email} className={input} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone">
          <input name="phone" required className={input} />
        </Field>
        <Field label="Preferred date &amp; time">
          <input name="preferredAt" type="datetime-local" required className={input} />
        </Field>
      </div>
      <Field label="What do you need help with?">
        <textarea name="topic" rows={3} required className={input} placeholder="General physician consultation for recurring headaches" />
      </Field>
      <SubmitButton className="w-full">Schedule free demo consultation</SubmitButton>
    </form>
  );
}
