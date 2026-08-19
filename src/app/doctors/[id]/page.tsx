import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/forms/BookingForm";
import { Avatar } from "@/components/Avatar";
import { Badge, Card } from "@/components/ui";
import { buildSlots } from "@/lib/slots";
import { DAYS, inr } from "@/lib/format";
import { IMAGES, photo } from "@/lib/images";

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
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="relative h-28 sm:h-36">
            <Image
              src={photo(IMAGES.abstractBlue, 1200, 400)}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-700/85 to-cyan-500/60" />
          </div>

          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 px-5 pb-5 sm:px-7">
            <div className="flex items-end gap-4">
              <Avatar
                doctorId={doctor.id}
                photoUrl={doctor.photoUrl}
                name={doctor.user.name}
                size={104}
                className="shadow-xl ring-4"
              />
              <div className="pb-1">
                <h1 className="text-2xl font-semibold text-slate-900">Dr. {doctor.user.name}</h1>
                <p className="font-medium text-sky-700">{doctor.specialty}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {doctor.clinicName}, {doctor.city}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <Badge tone="green">{doctor.rating.toFixed(1)} ★</Badge>
              <Badge tone="blue">{doctor.experienceYears} yrs experience</Badge>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                {inr(doctor.consultationFee)}
              </span>
            </div>
          </div>

          <p className="border-t border-slate-100 px-5 py-5 text-sm leading-relaxed text-slate-600 sm:px-7">
            {doctor.about || "This doctor has not added a bio yet."}
          </p>
        </div>

        <Card>
          <h2 className="font-semibold text-slate-900">Weekly availability</h2>
          {doctor.availabilities.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No availability published yet.</p>
          ) : (
            <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              {doctor.availabilities.map((slot) => (
                <li key={slot.id} className="rounded-xl bg-slate-50 px-3 py-2">
                  <span className="font-medium text-slate-800">{DAYS[slot.dayOfWeek]}</span> · {slot.startTime}–
                  {slot.endTime} ({slot.slotMinutes} min slots)
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <h2 className="font-semibold text-slate-900">Book an appointment</h2>
        <p className="mb-4 text-sm text-slate-500">Pick a date and time that works for you</p>
        <BookingForm doctorId={doctor.id} slots={slots} fee={doctor.consultationFee} />
      </Card>
    </div>
  );
}
