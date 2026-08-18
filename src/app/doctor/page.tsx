import { prisma } from "@/lib/prisma";
import { requireDoctor } from "@/lib/auth";
import { setAppointmentStatus } from "@/lib/actions/appointments";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty, statusTone } from "@/components/ui";
import { dateTime, inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DoctorAppointmentsPage() {
  const { doctor } = await requireDoctor();

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: { patient: { select: { name: true, email: true, phone: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  const stats = {
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    earnings: appointments.filter((a) => a.status === "COMPLETED").length * doctor.consultationFee,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></Card>
        <Card><p className="text-sm text-slate-500">Confirmed</p><p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p></Card>
        <Card><p className="text-sm text-slate-500">Completed</p><p className="text-2xl font-bold text-sky-600">{stats.completed}</p></Card>
        <Card><p className="text-sm text-slate-500">Earnings</p><p className="text-2xl font-bold text-slate-900">{inr(stats.earnings)}</p></Card>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold text-slate-900">Appointment requests</h2>
        {appointments.length === 0 ? (
          <Empty>No appointments booked yet.</Empty>
        ) : (
          <ul className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="space-y-2 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{appointment.patient.name}</p>
                    <p className="text-sm text-slate-500">
                      {dateTime(appointment.scheduledAt)} ·{" "}
                      {appointment.mode === "VIDEO" ? "Video" : "In clinic"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {appointment.patient.email} · {appointment.patient.phone ?? "no phone"}
                    </p>
                    {appointment.reason ? (
                      <p className="mt-1 text-sm text-slate-600">Reason: {appointment.reason}</p>
                    ) : null}
                  </div>
                  <Badge tone={statusTone(appointment.status)}>{appointment.status}</Badge>
                </div>

                {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
                  <div className="flex flex-wrap gap-2">
                    {appointment.status === "PENDING" ? (
                      <form action={setAppointmentStatus}>
                        <input type="hidden" name="id" value={appointment.id} />
                        <input type="hidden" name="status" value="CONFIRMED" />
                        <SubmitButton>Confirm</SubmitButton>
                      </form>
                    ) : null}
                    <form action={setAppointmentStatus} className="flex items-end gap-2">
                      <input type="hidden" name="id" value={appointment.id} />
                      <input type="hidden" name="status" value="COMPLETED" />
                      <input
                        name="notes"
                        placeholder="Consultation notes / prescription"
                        className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                      />
                      <SubmitButton variant="ghost">Mark completed</SubmitButton>
                    </form>
                    <form action={setAppointmentStatus}>
                      <input type="hidden" name="id" value={appointment.id} />
                      <input type="hidden" name="status" value="CANCELLED" />
                      <SubmitButton variant="danger">Cancel</SubmitButton>
                    </form>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
