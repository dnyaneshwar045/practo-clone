import { getSessionUser } from "@/lib/auth";
import { DemoForm } from "@/components/forms/DemoForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

const steps = [
  "Pick a time that suits you — evenings and weekends included.",
  "A care coordinator calls you for a free 15-minute consultation.",
  "We recommend the right specialist and help you book the appointment.",
];

export default async function DemoPage() {
  const user = await getSessionUser();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Schedule a free demo consultation</h1>
        <p className="mt-3 text-slate-600">
          Not sure which specialist you need? Our care team will understand your symptoms and guide you — at no cost.
        </p>
        <ol className="mt-6 space-y-3 text-sm text-slate-600">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Card>
        <DemoForm defaults={{ name: user?.name, email: user?.email }} />
      </Card>
    </div>
  );
}
