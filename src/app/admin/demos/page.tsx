import { prisma } from "@/lib/prisma";
import { setDemoStatus } from "@/lib/actions/demo";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty, statusTone } from "@/components/ui";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const nextActions = [
  { status: "SCHEDULED", label: "Mark scheduled" },
  { status: "DONE", label: "Mark done" },
];

export default async function AdminDemosPage() {
  const demos = await prisma.demoRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">Demo consultation requests</h2>
      {demos.length === 0 ? (
        <Empty>No demo requests yet.</Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {demos.map((demo) => (
            <li key={demo.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">{demo.name}</p>
                <p className="text-slate-500">
                  {demo.email} · {demo.phone} · prefers {dateTime(demo.preferredAt)}
                </p>
                <p className="mt-1 text-slate-600">{demo.topic}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(demo.status)}>{demo.status}</Badge>
                {nextActions
                  .filter((action) => action.status !== demo.status)
                  .map((action) => (
                    <form key={action.status} action={setDemoStatus}>
                      <input type="hidden" name="id" value={demo.id} />
                      <input type="hidden" name="status" value={action.status} />
                      <SubmitButton variant="ghost">{action.label}</SubmitButton>
                    </form>
                  ))}
                {demo.status !== "CANCELLED" ? (
                  <form action={setDemoStatus}>
                    <input type="hidden" name="id" value={demo.id} />
                    <input type="hidden" name="status" value="CANCELLED" />
                    <SubmitButton variant="danger">Cancel</SubmitButton>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
