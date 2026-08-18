import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePlan } from "@/lib/actions/content";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty } from "@/components/ui";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    include: { _count: { select: { subscriptions: true } } },
    orderBy: { priceInr: "asc" },
  });

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Premium plans</h2>
        <Link href="/admin/plans/new" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
          New plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <Empty>No plans configured.</Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {plans.map((plan) => (
            <li key={plan.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{plan.name}</p>
                <p className="text-slate-500">
                  {inr(plan.priceInr)} / {plan.intervalDays} days · {plan.consultations} consultations ·{" "}
                  {plan._count.subscriptions} subscriber(s)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={plan.active ? "green" : "slate"}>{plan.active ? "ACTIVE" : "INACTIVE"}</Badge>
                <Link href={`/admin/plans/${plan.id}`} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  Edit
                </Link>
                <form action={deletePlan}>
                  <input type="hidden" name="id" value={plan.id} />
                  <SubmitButton variant="danger">Delete</SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
