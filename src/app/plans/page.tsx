import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { PlanSubscribeForm } from "@/components/forms/PlanSubscribeForm";
import { Badge, Empty } from "@/components/ui";
import { inr } from "@/lib/format";
import { IMAGES, photo } from "@/lib/images";

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
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-5 py-9 text-white shadow-xl sm:px-8 sm:py-12">
        <Image
          src={photo(IMAGES.abstractBlue, 1400, 500)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-sky-700/40" />
        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">Premium care plans</h1>
          <p className="mt-2 max-w-xl text-sm text-sky-50/90">
            Save on consultations, get unlimited follow-up chats and priority slots. Pay securely with
            UPI, cards, netbanking or wallets via Razorpay.
          </p>
        </div>
      </section>

      {active ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          You are currently on the <strong>{active.plan.name}</strong> plan.
        </p>
      ) : null}

      {plans.length === 0 ? (
        <Empty>No plans are available right now.</Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, index) => {
            const featured = index === 1;
            return (
              <div
                key={plan.id}
                className={`card-3d flex flex-col rounded-2xl border p-6 shadow-sm ${
                  featured
                    ? "border-sky-400 bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-xl shadow-sky-600/25"
                    : "border-slate-200/80 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className={`font-semibold ${featured ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h2>
                  {active?.planId === plan.id ? (
                    <Badge tone="green">Current</Badge>
                  ) : featured ? (
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                      Popular
                    </span>
                  ) : null}
                </div>

                <p className={`mt-3 text-3xl font-bold ${featured ? "text-white" : "text-sky-700"}`}>
                  {inr(plan.priceInr)}
                  <span className={`text-sm font-normal ${featured ? "text-sky-50" : "text-slate-500"}`}>
                    /{plan.intervalDays} days
                  </span>
                </p>
                <p className={`mt-2 text-sm ${featured ? "text-sky-50" : "text-slate-500"}`}>
                  {plan.description}
                </p>

                <ul className={`mt-5 flex-1 space-y-2 text-sm ${featured ? "text-sky-50" : "text-slate-600"}`}>
                  <li>✓ {plan.consultations} included consultations</li>
                  {plan.features
                    .split("\n")
                    .map((feature) => feature.trim())
                    .filter(Boolean)
                    .map((feature) => (
                      <li key={feature}>✓ {feature}</li>
                    ))}
                </ul>

                <PlanSubscribeForm
                  planId={plan.id}
                  priceInr={plan.priceInr}
                  current={active?.planId === plan.id}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
