"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser, requireRole, requireUser } from "@/lib/auth";
import { startCheckout, type CheckoutSession } from "@/lib/payments";

export type BookingState = { error?: string; checkout?: CheckoutSession };

export async function bookAppointment(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const user = await getSessionUser();
  const doctorId = String(formData.get("doctorId") ?? "");
  const slot = String(formData.get("slot") ?? "");
  const mode = String(formData.get("mode") ?? "IN_CLINIC") === "VIDEO" ? "VIDEO" : "IN_CLINIC";
  const reason = String(formData.get("reason") ?? "");
  const payOnline = String(formData.get("paymentMethod") ?? "CASH_AT_CLINIC") === "ONLINE";

  if (!user) redirect(`/login?next=/doctors/${doctorId}`);
  if (!slot) return { error: "Pick an available slot" };

  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, status: "APPROVED" },
    include: { user: { select: { name: true } } },
  });
  if (!doctor) return { error: "This doctor is not accepting appointments" };

  const scheduledAt = new Date(slot);
  const clash = await prisma.appointment.findFirst({
    where: { doctorId, scheduledAt, status: { not: "CANCELLED" } },
  });
  if (clash) return { error: "That slot was just booked. Please choose another one." };

  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId: user.id,
      scheduledAt,
      mode,
      reason,
      paymentMethod: payOnline ? "ONLINE" : "CASH_AT_CLINIC",
    },
  });

  revalidatePath("/dashboard");

  if (!payOnline) redirect("/dashboard?booked=1");

  const checkout = await startCheckout({
    user,
    purpose: "APPOINTMENT",
    amountInr: doctor.consultationFee,
    title: `Dr. ${doctor.user.name}`,
    description: `${mode === "VIDEO" ? "Video" : "In-clinic"} consultation fee`,
    redirectTo: "/dashboard?booked=1&paid=1",
    appointmentId: appointment.id,
  });

  return { checkout };
}

/** Re-opens checkout for an appointment whose online payment was never completed. */
export async function payForAppointment(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const appointment = await prisma.appointment.findFirst({
    where: { id, patientId: user.id, status: { not: "CANCELLED" } },
    include: { doctor: { include: { user: { select: { name: true } } } } },
  });

  if (!appointment) return { error: "Appointment not found" };
  if (appointment.paymentStatus === "PAID") return { error: "This consultation is already paid" };

  const checkout = await startCheckout({
    user,
    purpose: "APPOINTMENT",
    amountInr: appointment.doctor.consultationFee,
    title: `Dr. ${appointment.doctor.user.name}`,
    description: `${appointment.mode === "VIDEO" ? "Video" : "In-clinic"} consultation fee`,
    redirectTo: "/dashboard?paid=1",
    appointmentId: appointment.id,
  });

  await prisma.appointment.update({ where: { id }, data: { paymentMethod: "ONLINE" } });
  return { checkout };
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
  if (appointment.paymentStatus === "PAID") {
    await prisma.payment.updateMany({ where: { appointmentId: id }, data: { status: "REFUNDED" } });
    await prisma.appointment.update({ where: { id }, data: { paymentStatus: "REFUNDED" } });
  }
  revalidatePath("/dashboard");
  revalidatePath("/doctor");
  revalidatePath("/admin/appointments");
}

/** Records an offline (cash/UPI at the clinic) consultation fee collection. */
export async function markFeeCollected(formData: FormData) {
  const user = await requireRole("DOCTOR", "ADMIN");
  const id = String(formData.get("id") ?? "");
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: true },
  });
  if (!appointment) return;
  if (user.role === "DOCTOR" && appointment.doctor.userId !== user.id) return;

  await prisma.appointment.update({
    where: { id },
    data: { paymentStatus: "PAID", paymentMethod: "CASH_AT_CLINIC" },
  });

  revalidatePath("/doctor");
  revalidatePath("/dashboard");
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
