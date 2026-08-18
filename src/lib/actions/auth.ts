"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type FormState = { error?: string; success?: string };

const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PATIENT", "DOCTOR"]),
  specialty: z.string().optional(),
  city: z.string().optional(),
  clinicName: z.string().optional(),
  experienceYears: z.coerce.number().min(0).optional(),
  consultationFee: z.coerce.number().min(0).optional(),
});

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const data = parsed.data;

  if (await prisma.user.findUnique({ where: { email: data.email } })) {
    return { error: "An account with this email already exists" };
  }

  if (data.role === "DOCTOR" && !(data.specialty && data.city && data.clinicName)) {
    return { error: "Specialty, city and clinic name are required for doctors" };
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      passwordHash: await hashPassword(data.password),
      ...(data.role === "DOCTOR"
        ? {
            doctor: {
              create: {
                specialty: data.specialty!,
                city: data.city!,
                clinicName: data.clinicName!,
                experienceYears: data.experienceYears ?? 0,
                consultationFee: data.consultationFee ?? 500,
                availabilities: {
                  create: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
                    dayOfWeek,
                    startTime: "10:00",
                    endTime: "13:00",
                  })),
                },
              },
            },
          }
        : {}),
    },
  });

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect(user.role === "DOCTOR" ? "/doctor" : "/dashboard");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password" };
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect(user.role === "ADMIN" ? "/admin" : user.role === "DOCTOR" ? "/doctor" : "/dashboard");
}

export async function logout() {
  destroySession();
  redirect("/");
}
