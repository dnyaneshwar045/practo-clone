"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { startCheckout, type CheckoutSession } from "@/lib/payments";

export type SubscribeState = { error?: string; checkout?: CheckoutSession };

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const user = await getSessionUser();
  const planId = String(formData.get("planId") ?? "");
  if (!user) redirect("/login?next=/plans");

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan || !plan.active) return { error: "This plan is no longer available" };

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.intervalDays);

  const subscription = await prisma.subscription.create({
    data: { userId: user.id, planId, expiresAt, status: "PENDING" },
  });

  const checkout = await startCheckout({
    user,
    purpose: "SUBSCRIPTION",
    amountInr: plan.priceInr,
    title: `${plan.name} plan`,
    description: `${plan.intervalDays}-day premium care subscription`,
    redirectTo: "/dashboard?subscribed=1&paid=1",
    subscriptionId: subscription.id,
  });

  revalidatePath("/dashboard");
  return { checkout };
}

export async function cancelSubscription(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  await prisma.subscription.updateMany({
    where: { id: String(formData.get("id") ?? ""), userId: user.id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/dashboard");
}
