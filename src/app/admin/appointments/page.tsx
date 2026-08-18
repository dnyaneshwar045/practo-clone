import { prisma } from "@/lib/prisma";
import { cancelAppointment, setAppointmentStatus } from "@/lib/actions/appointments";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty, statusTone } from "@/components/ui";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: { select: { name: true, email: true } },
      doctor: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "desc" },
  });

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">All appointments</h2>
      {appointments.length === 0 ? (
        <Empty>No appointments yet.</Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-800">
                  {appointment.patient.name} → Dr. {appointment.doctor.user.name}
                </p>
                <p className="text-slate-500">
                  {dateTime(appointment.scheduledAt)} · {appointment.mode === "VIDEO" ? "Video" : "In clinic"} ·{" "}
                  {appointment.patient.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={statusTone(appointment.status)}>{appointment.status}</Badge>
                {appointment.status === "PENDING" ? (
                  <form action={setAppointmentStatus}>
                    <input type="hidden" name="id" value={appointment.id} />
                    <input type="hidden" name="status" value="CONFIRMED" />
                    <SubmitButton>Confirm</SubmitButton>
                  </form>
                ) : null}
                {["PENDING", "CONFIRMED"].includes(appointment.status) ? (
                  <form action={cancelAppointment}>
                    <input type="hidden" name="id" value={appointment.id} />
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
