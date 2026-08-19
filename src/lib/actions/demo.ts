"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser, requireRole } from "@/lib/auth";
import { parseAppDateTime } from "@/lib/format";
import type { FormState } from "@/lib/actions/auth";

const demoSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  topic: z.string().min(3, "Tell us what you need help with"),
  preferredAt: z.string().min(1, "Pick a preferred date and time"),
});

export async function requestDemo(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = demoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const preferredAt = parseAppDateTime(parsed.data.preferredAt);
  if (Number.isNaN(preferredAt.getTime()) || preferredAt <= new Date()) {
    return { error: "Preferred time must be in the future" };
  }

  const user = await getSessionUser();
  await prisma.demoRequest.create({
    data: { ...parsed.data, preferredAt, userId: user?.id ?? null },
  });

  revalidatePath("/admin/demos");
  return { success: "Thanks! Our care team will confirm your free demo consultation shortly." };
}

export async function setDemoStatus(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["REQUESTED", "SCHEDULED", "DONE", "CANCELLED"].includes(status)) return;

  await prisma.demoRequest.update({
    where: { id },
    data: { status: status as "REQUESTED" | "SCHEDULED" | "DONE" | "CANCELLED" },
  });
  revalidatePath("/admin/demos");
}
