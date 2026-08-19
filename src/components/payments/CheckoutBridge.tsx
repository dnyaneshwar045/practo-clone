"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CheckoutSession } from "@/lib/payments";
import { inr } from "@/lib/format";

type CheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: CheckoutResponse) => void;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = { open: () => void };

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Could not load Razorpay checkout")));
    if (!existing) document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay checkout for a server-created order and verifies the result.
 * When Razorpay keys are not configured the server marks the order as a demo one and
 * this renders a clearly labelled simulated gateway instead.
 */
export function CheckoutBridge({ checkout }: { checkout: CheckoutSession }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const verify = useCallback(
    async (response: CheckoutResponse) => {
      setBusy(true);
      const result = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(response),
      })
        .then((r) => r.json())
        .catch(() => ({ ok: false, error: "Network error while confirming payment" }));

      if (result.ok) {
        router.push(result.redirectTo ?? checkout.redirectTo);
        router.refresh();
        return;
      }
      setBusy(false);
      setError(result.error ?? "Payment could not be confirmed");
    },
    [checkout.redirectTo, router]
  );

  useEffect(() => {
    if (checkout.demo) return;
    let cancelled = false;

    loadRazorpay()
      .then(() => {
        if (cancelled || !window.Razorpay) return;
        new window.Razorpay({
          key: checkout.keyId,
          amount: checkout.amountInr * 100,
          currency: "INR",
          name: checkout.title,
          description: checkout.description,
          order_id: checkout.orderId,
          prefill: checkout.prefill,
          theme: { color: "#0284c7" },
          handler: (response) => void verify(response),
          modal: { ondismiss: () => setError("Payment cancelled — your booking is saved as payment pending.") },
        }).open();
      })
      .catch((cause: Error) => setError(cause.message));

    return () => {
      cancelled = true;
    };
  }, [checkout, verify]);

  if (!checkout.demo && !error) {
    return <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-700">Opening secure Razorpay checkout…</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>
        <button
          type="button"
          onClick={() => router.push(checkout.redirectTo.split("&paid=1")[0])}
          className="text-sm font-medium text-sky-700 hover:underline"
        >
          Go to my dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Simulated gateway</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">{checkout.title}</h2>
        <p className="text-sm text-slate-500">{checkout.description}</p>
        <p className="mt-4 text-3xl font-bold text-slate-900">{inr(checkout.amountInr)}</p>
        <p className="mt-2 text-xs text-slate-500">
          Razorpay keys are not configured on this server, so no real charge is made. Set
          RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to use live checkout.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void verify({
                razorpay_order_id: checkout.orderId,
                razorpay_payment_id: `pay_demo_${checkout.orderId.slice(-10)}`,
                razorpay_signature: "demo",
              })
            }
            className="flex-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {busy ? "Processing…" : `Pay ${inr(checkout.amountInr)}`}
          </button>
          <button
            type="button"
            onClick={() => setError("Payment cancelled — nothing was charged.")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
