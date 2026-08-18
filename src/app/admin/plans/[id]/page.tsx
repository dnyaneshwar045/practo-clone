import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlanForm } from "@/components/forms/PlanForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditPlanPage({ params }: { params: { id: string } }) {
  const plan = await prisma.plan.findUnique({ where: { id: params.id } });
  if (!plan) notFound();

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">Edit plan</h2>
      <PlanForm plan={plan} />
    </Card>
  );
}
