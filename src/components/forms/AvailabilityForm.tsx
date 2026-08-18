"use client";

import { useFormState } from "react-dom";
import { addAvailability } from "@/lib/actions/doctor";
import { SubmitButton } from "@/components/SubmitButton";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";
import { DAYS } from "@/lib/format";

export function AvailabilityForm() {
  const [state, formAction] = useFormState(addAvailability, {});

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-5 sm:items-end">
      <div className="sm:col-span-5">
        <Alert error={state.error} success={state.success} />
      </div>
      <Field label="Day">
        <select name="dayOfWeek" className={input} defaultValue={1}>
          {DAYS.map((day, index) => (
            <option key={day} value={index}>
              {day}
            </option>
          ))}
        </select>
      </Field>
      <Field label="From">
        <input name="startTime" type="time" defaultValue="10:00" required className={input} />
      </Field>
      <Field label="To">
        <input name="endTime" type="time" defaultValue="13:00" required className={input} />
      </Field>
      <Field label="Slot (mins)">
        <input name="slotMinutes" type="number" min={10} step={5} defaultValue={30} className={input} />
      </Field>
      <SubmitButton>Add slot window</SubmitButton>
    </form>
  );
}
