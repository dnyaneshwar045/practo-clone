import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { cancelAppointment } from "@/lib/actions/appointments";
import { PayNowForm } from "@/components/payments/PayNowForm";
import { PaymentBadge } from "@/components/payments/PaymentBadge";
import { cancelSubscription } from "@/lib/actions/plans";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty, SectionTitle, statusTone } from "@/components/ui";
import { dateOnly, dateTime, inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PatientDashboard({
  searchParams,
}: {
  searchParams: { booked?: string; subscribed?: string; paid?: string };
}) {
  const user = await requireRole("PATIENT", "ADMIN");

  const [appointments, subscription, demos] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId: user.id },
      include: { doctor: { include: { user: { select: { name: true } } } } },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE" },
      include: { plan: true },
    }),
    prisma.demoRequest.findMany({ where: { userId: user.id }, orderBy: { preferredAt: "desc" } }),
  ]);

  const upcoming = appointments.filter(
    (a) => a.scheduledAt >= new Date() && a.status !== "CANCELLED"
  );

  return (
    <div className="space-y-10">
      <SectionTitle
        title={`Welcome, ${user.name}`}
        subtitle={`${upcoming.length} upcoming appointment(s)`}
        action={
          <Link href="/doctors" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Book a new appointment
          </Link>
        }
      />

      {searchParams.booked ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Appointment requested. The doctor will confirm it shortly.
        </p>
      ) : null}
      {searchParams.subscribed ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Your premium plan is now active.</p>
      ) : null}
      {searchParams.paid ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Payment received. Thank you!</p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-900">My appointments</h2>
          {appointments.length === 0 ? (
            <Empty>
              You have no appointments yet. <Link href="/doctors" className="text-sky-700">Find a doctor →</Link>
            </Empty>
          ) : (
            <ul className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      Dr. {appointment.doctor.user.name}{" "}
                      <span className="text-sm font-normal text-slate-500">· {appointment.doctor.specialty}</span>
                    </p>
                    <p className="text-sm text-slate-500">
                      {dateTime(appointment.scheduledAt)} ·{" "}
                      {appointment.mode === "VIDEO" ? "Video consultation" : appointment.doctor.clinicName}
                    </p>
                    {appointment.notes ? (
                      <p className="mt-1 text-sm text-slate-500">Doctor&apos;s note: {appointment.notes}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-slate-500">
                      {inr(appointment.doctor.consultationFee)} ·{" "}
                      {appointment.paymentMethod === "ONLINE" ? "Online payment" : "Pay at clinic"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone={statusTone(appointment.status)}>{appointment.status}</Badge>
                    <PaymentBadge status={appointment.paymentStatus} method={appointment.paymentMethod} />
                    {appointment.paymentStatus === "PENDING" && appointment.status !== "CANCELLED" ? (
                      <PayNowForm appointmentId={appointment.id} fee={appointment.doctor.consultationFee} />
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

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-semibold text-slate-900">Premium plan</h2>
            {subscription ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p className="text-lg font-semibold text-sky-700">{subscription.plan.name}</p>
                <p>{inr(subscription.plan.priceInr)} every {subscription.plan.intervalDays} days</p>
                <p>Renews on {dateOnly(subscription.expiresAt)}</p>
                <form action={cancelSubscription} className="pt-2">
                  <input type="hidden" name="id" value={subscription.id} />
                  <SubmitButton variant="danger">Cancel plan</SubmitButton>
                </form>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No active plan.{" "}
                <Link href="/plans" className="font-medium text-sky-700 hover:underline">
                  See premium plans →
                </Link>
              </p>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold text-slate-900">Demo consultations</h2>
            {demos.length === 0 ? (
              <p className="text-sm text-slate-500">
                <Link href="/demo" className="font-medium text-sky-700 hover:underline">
                  Schedule a free demo →
                </Link>
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {demos.map((demo) => (
                  <li key={demo.id} className="flex items-center justify-between gap-2">
                    <span className="text-slate-600">{dateTime(demo.preferredAt)}</span>
                    <Badge tone={statusTone(demo.status)}>{demo.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
