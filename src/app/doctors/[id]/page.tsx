import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/forms/BookingForm";
import { Badge, Card } from "@/components/ui";
import { buildSlots } from "@/lib/slots";
import { DAYS, inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage({ params }: { params: { id: string } }) {
  const doctor = await prisma.doctor.findFirst({
    where: { id: params.id, status: "APPROVED" },
    include: {
      user: { select: { name: true } },
      availabilities: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
      appointments: {
        where: { status: { not: "CANCELLED" }, scheduledAt: { gte: new Date() } },
        select: { scheduledAt: true },
      },
    },
  });

  if (!doctor) notFound();

  const slots = buildSlots(
    doctor.availabilities,
    doctor.appointments.map((a) => a.scheduledAt)
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Dr. {doctor.user.name}</h1>
              <p className="text-sky-700">{doctor.specialty}</p>
              <p className="mt-1 text-sm text-slate-500">
                {doctor.clinicName}, {doctor.city}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone="green">{doctor.rating.toFixed(1)} ★</Badge>
              <Badge tone="blue">{doctor.experienceYears} yrs experience</Badge>
              <p className="text-sm font-semibold text-slate-900">{inr(doctor.consultationFee)}</p>
            </div>
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {doctor.about || "This doctor has not added a bio yet."}
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-900">Weekly availability</h2>
          {doctor.availabilities.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No availability published yet.</p>
          ) : (
            <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              {doctor.availabilities.map((slot) => (
                <li key={slot.id} className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="font-medium text-slate-800">{DAYS[slot.dayOfWeek]}</span> · {slot.startTime}–
                  {slot.endTime} ({slot.slotMinutes} min slots)
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <h2 className="mb-4 font-semibold text-slate-900">Book an appointment</h2>
        <BookingForm doctorId={doctor.id} slots={slots} />
      </Card>
    </div>
  );
}
