"use client";

import { useFormState } from "react-dom";
import { bookAppointment } from "@/lib/actions/appointments";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";
import type { Slot } from "@/lib/slots";

export function BookingForm({ doctorId, slots }: { doctorId: string; slots: Slot[] }) {
  const [state, formAction] = useFormState(bookAppointment, {});

  if (slots.length === 0) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
        This doctor has no open slots in the next 7 days.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Alert error={state.error} />
      <input type="hidden" name="doctorId" value={doctorId} />

      <Field label="Available slot">
        <select name="slot" required className={input} defaultValue={slots[0].iso}>
          {slots.map((slot) => (
            <option key={slot.iso} value={slot.iso}>
              {slot.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Consultation type">
        <select name="mode" className={input}>
          <option value="IN_CLINIC">In clinic</option>
          <option value="VIDEO">Video consultation</option>
        </select>
      </Field>

      <Field label="Reason for visit">
        <textarea name="reason" rows={3} className={input} placeholder="Describe your symptoms" />
      </Field>

      <SubmitButton className="w-full">Book appointment</SubmitButton>
    </form>
  );
}
