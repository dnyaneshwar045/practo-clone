"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { register } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function RegisterForm({ defaultRole = "PATIENT" }: { defaultRole?: "PATIENT" | "DOCTOR" }) {
  const [state, formAction] = useFormState(register, {});
  const [role, setRole] = useState(defaultRole);

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} />

      <div className="grid grid-cols-2 gap-2">
        {(["PATIENT", "DOCTOR"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              role === option ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-300 text-slate-600"
            }`}
          >
            {option === "PATIENT" ? "I am a patient" : "I am a doctor"}
          </button>
        ))}
      </div>
      <input type="hidden" name="role" value={role} />

      <Field label="Full name">
        <input name="name" required className={input} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input name="email" type="email" required className={input} />
        </Field>
        <Field label="Phone">
          <input name="phone" required className={input} />
        </Field>
      </div>
      <Field label="Password" hint="At least 6 characters">
        <input name="password" type="password" required minLength={6} className={input} />
      </Field>

      {role === "DOCTOR" ? (
        <div className="space-y-4 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Practice details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Specialty">
              <input name="specialty" required className={input} placeholder="Dermatologist" />
            </Field>
            <Field label="City">
              <input name="city" required className={input} placeholder="Pune" />
            </Field>
          </div>
          <Field label="Clinic name">
            <input name="clinicName" required className={input} placeholder="Skin & Care Clinic" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Years of experience">
              <input name="experienceYears" type="number" min={0} defaultValue={5} className={input} />
            </Field>
            <Field label="Consultation fee (₹)">
              <input name="consultationFee" type="number" min={0} defaultValue={500} className={input} />
            </Field>
          </div>
          <p className="text-xs text-slate-500">
            Doctor profiles go live after admin verification.
          </p>
        </div>
      ) : null}

      <SubmitButton className="w-full">Create account</SubmitButton>
    </form>
  );
}
