import { PlanForm } from "@/components/forms/PlanForm";
import { Card } from "@/components/ui";

export default function NewPlanPage() {
  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">New plan</h2>
      <PlanForm />
    </Card>
  );
}
