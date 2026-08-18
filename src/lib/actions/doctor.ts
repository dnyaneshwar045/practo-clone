"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctor } from "@/lib/auth";
import type { FormState } from "@/lib/actions/auth";

export async function updateDoctorProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const { doctor } = await requireDoctor();
  const specialty = String(formData.get("specialty") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const clinicName = String(formData.get("clinicName") ?? "").trim();

  if (!specialty || !city || !clinicName) {
    return { error: "Specialty, city and clinic are required" };
  }

  await prisma.doctor.update({
    where: { id: doctor.id },
    data: {
      specialty,
      city,
      clinicName,
      about: String(formData.get("about") ?? ""),
      photoUrl: String(formData.get("photoUrl") ?? "") || null,
      experienceYears: Number(formData.get("experienceYears") ?? 0),
      consultationFee: Number(formData.get("consultationFee") ?? 0),
    },
  });

  revalidatePath("/doctor/profile");
  return { success: "Profile updated" };
}

export async function addAvailability(_prev: FormState, formData: FormData): Promise<FormState> {
  const { doctor } = await requireDoctor();
  const dayOfWeek = Number(formData.get("dayOfWeek") ?? 1);
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const slotMinutes = Number(formData.get("slotMinutes") ?? 30);

  if (!startTime || !endTime || startTime >= endTime) {
    return { error: "End time must be after start time" };
  }

  try {
    await prisma.availability.create({
      data: { doctorId: doctor.id, dayOfWeek, startTime, endTime, slotMinutes },
    });
  } catch {
    return { error: "That time window already exists" };
  }

  revalidatePath("/doctor/availability");
  return { success: "Availability added" };
}

export async function deleteAvailability(formData: FormData) {
  const { doctor } = await requireDoctor();
  const id = String(formData.get("id") ?? "");
  await prisma.availability.deleteMany({ where: { id, doctorId: doctor.id } });
  revalidatePath("/doctor/availability");
}
