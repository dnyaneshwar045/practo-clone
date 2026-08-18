"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function subscribe(formData: FormData) {
  const user = await getSessionUser();
  const planId = String(formData.get("planId") ?? "");
  if (!user) redirect("/login?next=/plans");

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan || !plan.active) redirect("/plans?error=unavailable");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.intervalDays);

  await prisma.subscription.updateMany({
    where: { userId: user.id, status: "ACTIVE" },
    data: { status: "CANCELLED" },
  });
  await prisma.subscription.create({ data: { userId: user.id, planId, expiresAt } });

  revalidatePath("/dashboard");
  redirect("/dashboard?subscribed=1");
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
