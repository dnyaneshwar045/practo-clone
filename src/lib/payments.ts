import type { PaymentPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createOrder, keyId, razorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay";
import type { SessionUser } from "@/lib/auth";

/** Everything the browser needs to open Razorpay checkout for one order. */
export type CheckoutSession = {
  orderId: string;
  amountInr: number;
  keyId: string;
  demo: boolean;
  title: string;
  description: string;
  prefill: { name: string; email: string };
  redirectTo: string;
};

type StartArgs = {
  user: SessionUser;
  purpose: PaymentPurpose;
  amountInr: number;
  title: string;
  description: string;
  redirectTo: string;
  appointmentId?: string;
  subscriptionId?: string;
};

/** Creates a Razorpay order plus its local Payment row and returns the checkout payload. */
export async function startCheckout({
  user,
  purpose,
  amountInr,
  title,
  description,
  redirectTo,
  appointmentId,
  subscriptionId,
}: StartArgs): Promise<CheckoutSession> {
  const order = await createOrder(amountInr, `${purpose.toLowerCase()}_${appointmentId ?? subscriptionId ?? user.id}`, {
    purpose,
    userId: user.id,
  });

  // An abandoned checkout leaves an unpaid order behind; replace it so a retry can reuse the link.
  if (appointmentId || subscriptionId) {
    await prisma.payment.deleteMany({
      where: {
        status: { not: "PAID" },
        ...(appointmentId ? { appointmentId } : { subscriptionId }),
      },
    });
  }

  await prisma.payment.create({
    data: {
      userId: user.id,
      purpose,
      method: "ONLINE",
      provider: razorpayConfigured() ? "razorpay" : "demo",
      amountInr,
      orderId: order.id,
      appointmentId,
      subscriptionId,
    },
  });

  return {
    orderId: order.id,
    amountInr,
    keyId: keyId(),
    demo: !razorpayConfigured(),
    title,
    description,
    prefill: { name: user.name, email: user.email },
    redirectTo,
  };
}

export type SettleResult = { ok: true; redirectTo: string } | { ok: false; error: string };

/**
 * Verifies a Razorpay checkout callback and activates whatever the payment was for:
 * an appointment's consultation fee or a premium plan subscription.
 */
export async function settlePayment(
  userId: string,
  orderId: string,
  paymentId: string,
  signature: string
): Promise<SettleResult> {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment || payment.userId !== userId) return { ok: false, error: "Unknown payment order" };

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED", paymentId } });
    return { ok: false, error: "Payment signature verification failed" };
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "PAID", paymentId, signature },
  });

  if (payment.appointmentId) {
    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: { paymentStatus: "PAID" },
    });
    return { ok: true, redirectTo: "/dashboard?booked=1&paid=1" };
  }

  if (payment.subscriptionId) {
    const subscription = await prisma.subscription.findUnique({ where: { id: payment.subscriptionId } });
    if (subscription) {
      await prisma.subscription.updateMany({
        where: { userId, status: "ACTIVE", NOT: { id: subscription.id } },
        data: { status: "CANCELLED" },
      });
      await prisma.subscription.update({ where: { id: subscription.id }, data: { status: "ACTIVE" } });
    }
    return { ok: true, redirectTo: "/dashboard?subscribed=1&paid=1" };
  }

  return { ok: true, redirectTo: "/dashboard" };
}
