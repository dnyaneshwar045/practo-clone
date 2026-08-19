import { createHmac, randomUUID } from "node:crypto";

const API = "https://api.razorpay.com/v1";

export type RazorpayOrder = { id: string; amount: number; currency: string };

export const keyId = () => process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = () => process.env.RAZORPAY_KEY_SECRET ?? "";

/**
 * Live Razorpay checkout needs both keys. Without them the app falls back to a
 * clearly-labelled simulated gateway so the booking and subscription flows stay usable.
 */
export const razorpayConfigured = () => Boolean(keyId() && keySecret());

export async function createOrder(amountInr: number, receipt: string, notes: Record<string, string>) {
  if (!razorpayConfigured()) {
    return { id: `order_demo_${randomUUID().replace(/-/g, "").slice(0, 14)}`, amount: amountInr * 100, currency: "INR" };
  }

  const response = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${Buffer.from(`${keyId()}:${keySecret()}`).toString("base64")}`,
    },
    body: JSON.stringify({ amount: amountInr * 100, currency: "INR", receipt, notes }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Razorpay order failed (${response.status}): ${await response.text()}`);
  }

  return (await response.json()) as RazorpayOrder;
}

/** Razorpay signs `order_id|payment_id` with the key secret; simulated orders skip verification. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  if (orderId.startsWith("order_demo_")) return true;
  if (!razorpayConfigured()) return false;

  const expected = createHmac("sha256", keySecret()).update(`${orderId}|${paymentId}`).digest("hex");
  return expected.length === signature.length && createHmacSafeEqual(expected, signature);
}

function createHmacSafeEqual(a: string, b: string) {
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
