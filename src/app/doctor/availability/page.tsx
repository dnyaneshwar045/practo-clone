import { prisma } from "@/lib/prisma";
import { requireDoctor } from "@/lib/auth";
import { deleteAvailability } from "@/lib/actions/doctor";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { SubmitButton } from "@/components/SubmitButton";
import { Card, Empty } from "@/components/ui";
import { DAYS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DoctorAvailabilityPage() {
  const { doctor } = await requireDoctor();
  const availabilities = await prisma.availability.findMany({
    where: { doctorId: doctor.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 font-semibold text-slate-900">Add a weekly time window</h2>
        <AvailabilityForm />
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-slate-900">Current availability</h2>
        {availabilities.length === 0 ? (
          <Empty>Add time windows so patients can book slots.</Empty>
        ) : (
          <ul className="divide-y divide-slate-100">
            {availabilities.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-700">
                  <strong>{DAYS[slot.dayOfWeek]}</strong> · {slot.startTime}–{slot.endTime} ({slot.slotMinutes} min slots)
                </span>
                <form action={deleteAvailability}>
                  <input type="hidden" name="id" value={slot.id} />
                  <SubmitButton variant="danger">Remove</SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
