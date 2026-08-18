"use client";

import { useFormState } from "react-dom";
import type { Plan } from "@prisma/client";
import { savePlan } from "@/lib/actions/content";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function PlanForm({ plan }: { plan?: Plan }) {
  const [state, formAction] = useFormState(savePlan, {});

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} />
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plan name">
          <input name="name" defaultValue={plan?.name} required className={input} />
        </Field>
        <Field label="Slug" hint="Leave blank to generate from the name">
          <input name="slug" defaultValue={plan?.slug} className={input} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₹)">
          <input name="priceInr" type="number" min={0} defaultValue={plan?.priceInr ?? 499} className={input} />
        </Field>
        <Field label="Billing period (days)">
          <input name="intervalDays" type="number" min={1} defaultValue={plan?.intervalDays ?? 30} className={input} />
        </Field>
        <Field label="Included consultations">
          <input name="consultations" type="number" min={0} defaultValue={plan?.consultations ?? 2} className={input} />
        </Field>
      </div>
      <Field label="Description">
        <textarea name="description" rows={2} defaultValue={plan?.description} className={input} />
      </Field>
      <Field label="Features" hint="One feature per line">
        <textarea name="features" rows={5} defaultValue={plan?.features} className={input} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" defaultChecked={plan?.active ?? true} />
        Active
      </label>
      <SubmitButton>{plan ? "Update plan" : "Create plan"}</SubmitButton>
    </form>
  );
}
