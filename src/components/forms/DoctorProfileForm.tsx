"use client";

import { useFormState } from "react-dom";
import type { Doctor } from "@prisma/client";
import { updateDoctorProfile } from "@/lib/actions/doctor";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";

export function DoctorProfileForm({ doctor }: { doctor: Doctor }) {
  const [state, formAction] = useFormState(updateDoctorProfile, {});

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} success={state.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Specialty">
          <input name="specialty" defaultValue={doctor.specialty} required className={input} />
        </Field>
        <Field label="City">
          <input name="city" defaultValue={doctor.city} required className={input} />
        </Field>
      </div>
      <Field label="Clinic name">
        <input name="clinicName" defaultValue={doctor.clinicName} required className={input} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Years of experience">
          <input name="experienceYears" type="number" min={0} defaultValue={doctor.experienceYears} className={input} />
        </Field>
        <Field label="Consultation fee (₹)">
          <input name="consultationFee" type="number" min={0} defaultValue={doctor.consultationFee} className={input} />
        </Field>
      </div>
      <Field label="Photo URL">
        <input name="photoUrl" defaultValue={doctor.photoUrl ?? ""} className={input} />
      </Field>
      <Field label="About">
        <textarea name="about" rows={4} defaultValue={doctor.about} className={input} />
      </Field>
      <SubmitButton>Save profile</SubmitButton>
    </form>
  );
}
