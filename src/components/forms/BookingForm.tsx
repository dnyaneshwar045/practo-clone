"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { bookAppointment } from "@/lib/actions/appointments";
import { SubmitButton } from "@/components/SubmitButton";
import { SlotPicker } from "@/components/forms/SlotPicker";
import { CheckoutBridge } from "@/components/payments/CheckoutBridge";
import { Alert, Field } from "@/components/ui";
import { input } from "@/components/forms/styles";
import { inr } from "@/lib/format";
import type { Slot } from "@/lib/slots";

const modes = [
  { value: "IN_CLINIC", label: "In clinic", hint: "Visit the clinic" },
  { value: "VIDEO", label: "Video call", hint: "Consult from home" },
];

export function BookingForm({
  doctorId,
  slots,
  fee,
}: {
  doctorId: string;
  slots: Slot[];
  fee: number;
}) {
  const [state, formAction] = useFormState(bookAppointment, {});
  const [mode, setMode] = useState("IN_CLINIC");
  const [payOnline, setPayOnline] = useState(true);

  if (slots.length === 0) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
        This doctor has no open slots in the next 7 days.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Alert error={state.error} />
      <input type="hidden" name="doctorId" value={doctorId} />
      {state.checkout ? <CheckoutBridge checkout={state.checkout} /> : null}

      <SlotPicker slots={slots} />

      <Field label="Consultation type">
        <div className="grid grid-cols-2 gap-2">
          {modes.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border px-3 py-2 text-center transition ${
                mode === option.value
                  ? "border-sky-500 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="block text-[11px] text-slate-500">{option.hint}</span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Payment">
        <div className="space-y-2">
          {[
            {
              online: true,
              title: `Pay ${inr(fee)} online`,
              hint: "UPI, cards, netbanking & wallets via Razorpay",
            },
            {
              online: false,
              title: "Pay at the clinic",
              hint: "Cash or UPI when you arrive for the visit",
            },
          ].map((option) => (
            <label
              key={String(option.online)}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                payOnline === option.online
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-200 bg-white hover:border-sky-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.online ? "ONLINE" : "CASH_AT_CLINIC"}
                checked={payOnline === option.online}
                onChange={() => setPayOnline(option.online)}
                className="mt-1 accent-sky-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">{option.title}</span>
                <span className="block text-[11px] text-slate-500">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Reason for visit">
        <textarea name="reason" rows={3} className={input} placeholder="Describe your symptoms" />
      </Field>

      <SubmitButton className="w-full shadow-lg shadow-sky-600/20">
        {payOnline ? `Pay ${inr(fee)} & book` : "Book appointment"}
      </SubmitButton>
    </form>
  );
}
