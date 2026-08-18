import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { subscribe } from "@/lib/actions/plans";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty, SectionTitle } from "@/components/ui";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const user = await getSessionUser();
  const [plans, active] = await Promise.all([
    prisma.plan.findMany({ where: { active: true }, orderBy: { priceInr: "asc" } }),
    user
      ? prisma.subscription.findFirst({
          where: { userId: user.id, status: "ACTIVE" },
          include: { plan: true },
        })
      : null,
  ]);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Premium care plans"
        subtitle="Save on consultations, get unlimited follow-up chats and priority slots"
      />

      {active ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          You are currently on the <strong>{active.plan.name}</strong> plan.
        </p>
      ) : null}

      {plans.length === 0 ? (
        <Empty>No plans are available right now.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">{plan.name}</h2>
                {active?.planId === plan.id ? <Badge tone="green">Current</Badge> : null}
              </div>
              <p className="mt-2 text-3xl font-bold text-sky-700">
                {inr(plan.priceInr)}
                <span className="text-sm font-normal text-slate-500">/{plan.intervalDays} days</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>

              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                <li>✓ {plan.consultations} included consultations</li>
                {plan.features
                  .split("\n")
                  .map((feature) => feature.trim())
                  .filter(Boolean)
                  .map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
              </ul>

              <form action={subscribe} className="mt-6">
                <input type="hidden" name="planId" value={plan.id} />
                <SubmitButton className="w-full" variant={active?.planId === plan.id ? "ghost" : "primary"}>
                  {active?.planId === plan.id ? "Renew plan" : "Subscribe"}
                </SubmitButton>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
