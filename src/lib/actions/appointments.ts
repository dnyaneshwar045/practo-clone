"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser, requireRole, requireUser } from "@/lib/auth";
import type { FormState } from "@/lib/actions/auth";

export async function bookAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getSessionUser();
  const doctorId = String(formData.get("doctorId") ?? "");
  const slot = String(formData.get("slot") ?? "");
  const mode = String(formData.get("mode") ?? "IN_CLINIC") === "VIDEO" ? "VIDEO" : "IN_CLINIC";
  const reason = String(formData.get("reason") ?? "");

  if (!user) redirect(`/login?next=/doctors/${doctorId}`);
  if (!slot) return { error: "Pick an available slot" };

  const scheduledAt = new Date(slot);
  const clash = await prisma.appointment.findFirst({
    where: { doctorId, scheduledAt, status: { not: "CANCELLED" } },
  });
  if (clash) return { error: "That slot was just booked. Please choose another one." };

  await prisma.appointment.create({
    data: { doctorId, patientId: user.id, scheduledAt, mode, reason },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard?booked=1");
}

export async function cancelAppointment(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: true },
  });
  if (!appointment) return;

  const allowed =
    user.role === "ADMIN" ||
    appointment.patientId === user.id ||
    appointment.doctor.userId === user.id;
  if (!allowed) return;

  await prisma.appointment.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/dashboard");
  revalidatePath("/doctor");
  revalidatePath("/admin/appointments");
}

export async function setAppointmentStatus(formData: FormData) {
  const user = await requireRole("DOCTOR", "ADMIN");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as AppointmentStatus;
  const notes = formData.get("notes");

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: true },
  });
  if (!appointment) return;
  if (user.role === "DOCTOR" && appointment.doctor.userId !== user.id) return;

  await prisma.appointment.update({
    where: { id },
    data: { status, ...(typeof notes === "string" ? { notes } : {}) },
  });

  revalidatePath("/doctor");
  revalidatePath("/dashboard");
  revalidatePath("/admin/appointments");
}
