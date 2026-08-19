"use client";

import { useFormState } from "react-dom";
import { payForAppointment, type BookingState } from "@/lib/actions/appointments";
import { CheckoutBridge } from "@/components/payments/CheckoutBridge";
import { SubmitButton } from "@/components/SubmitButton";
import { inr } from "@/lib/format";

const initial: BookingState = {};

export function PayNowForm({ appointmentId, fee }: { appointmentId: string; fee: number }) {
  const [state, action] = useFormState(payForAppointment, initial);

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={appointmentId} />
      <SubmitButton>Pay {inr(fee)}</SubmitButton>
      {state.error ? <p className="text-xs text-rose-600">{state.error}</p> : null}
      {state.checkout ? <CheckoutBridge checkout={state.checkout} /> : null}
    </form>
  );
}
