"use client";

import { useFormState } from "react-dom";
import { subscribe } from "@/lib/actions/plans";
import { SubmitButton } from "@/components/SubmitButton";
import { CheckoutBridge } from "@/components/payments/CheckoutBridge";
import { Alert } from "@/components/ui";
import { inr } from "@/lib/format";

export function PlanSubscribeForm({
  planId,
  priceInr,
  current,
}: {
  planId: string;
  priceInr: number;
  current: boolean;
}) {
  const [state, formAction] = useFormState(subscribe, {});

  return (
    <form action={formAction} className="mt-6 space-y-2">
      <Alert error={state.error} />
      {state.checkout ? <CheckoutBridge checkout={state.checkout} /> : null}
      <input type="hidden" name="planId" value={planId} />
      <SubmitButton className="w-full" variant={current ? "ghost" : "primary"}>
        {current ? `Renew for ${inr(priceInr)}` : `Pay ${inr(priceInr)} & subscribe`}
      </SubmitButton>
    </form>
  );
}
