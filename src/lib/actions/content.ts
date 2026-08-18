"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { slugify } from "@/lib/format";
import type { FormState } from "@/lib/actions/auth";

export async function saveArticle(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!title || !content || !category) return { error: "Title, category and content are required" };

  const data = {
    title,
    content,
    category,
    excerpt: String(formData.get("excerpt") ?? "").trim() || content.slice(0, 160),
    coverUrl: String(formData.get("coverUrl") ?? "") || null,
    published: formData.get("published") === "on",
    slug: String(formData.get("slug") ?? "").trim() || slugify(title),
  };

  if (id) {
    await prisma.article.update({ where: { id }, data });
  } else {
    await prisma.article.create({ data: { ...data, authorId: user.id } });
  }

  revalidatePath("/articles");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireRole("ADMIN");
  await prisma.article.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function savePlan(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Plan name is required" };

  const data = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    description: String(formData.get("description") ?? ""),
    priceInr: Number(formData.get("priceInr") ?? 0),
    intervalDays: Number(formData.get("intervalDays") ?? 30),
    consultations: Number(formData.get("consultations") ?? 0),
    features: String(formData.get("features") ?? ""),
    active: formData.get("active") === "on",
  };

  if (id) {
    await prisma.plan.update({ where: { id }, data });
  } else {
    await prisma.plan.create({ data });
  }

  revalidatePath("/plans");
  revalidatePath("/admin/plans");
  redirect("/admin/plans");
}

export async function deletePlan(formData: FormData) {
  await requireRole("ADMIN");
  await prisma.plan.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/plans");
  revalidatePath("/admin/plans");
}

export async function setDoctorStatus(formData: FormData) {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) return;

  await prisma.doctor.update({
    where: { id },
    data: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
  });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
}
