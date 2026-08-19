import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Card, statusTone } from "@/components/ui";
import { dateTime, inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [patients, doctors, pendingDoctors, appointments, pendingAppointments, articles, activeSubs, demos, recent, revenueRows] =
    await Promise.all([
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.doctor.count(),
      prisma.doctor.count({ where: { status: "PENDING" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.article.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.demoRequest.count({ where: { status: "REQUESTED" } }),
      prisma.appointment.findMany({
        include: {
          patient: { select: { name: true } },
          doctor: { include: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.subscription.findMany({ where: { status: "ACTIVE" }, include: { plan: true } }),
    ]);

  const payments = await prisma.payment.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const collected = await prisma.payment.aggregate({
    where: { status: "PAID" },
    _sum: { amountInr: true },
  });

  const mrr = revenueRows.reduce((total, sub) => total + sub.plan.priceInr, 0);

  const cards = [
    { label: "Patients", value: patients, href: "/admin/users" },
    { label: "Doctors", value: doctors, href: "/admin/doctors" },
    { label: "Pending verifications", value: pendingDoctors, href: "/admin/doctors" },
    { label: "Appointments", value: appointments, href: "/admin/appointments" },
    { label: "Pending appointments", value: pendingAppointments, href: "/admin/appointments" },
    { label: "Articles", value: articles, href: "/admin/articles" },
    { label: "Active subscriptions", value: activeSubs, href: "/admin/plans" },
    { label: "New demo requests", value: demos, href: "/admin/demos" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition hover:border-sky-400">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Subscription revenue (active plans)</p>
          <p className="text-3xl font-bold text-sky-700">{inr(mrr)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Online payments collected</p>
          <p className="text-3xl font-bold text-emerald-700">{inr(collected._sum.amountInr ?? 0)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold text-slate-900">Recent payments</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-500">No payment orders yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {payments.map((payment) => (
              <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="text-slate-700">
                  {payment.user.name} · {payment.purpose.toLowerCase()}
                </span>
                <span className="font-mono text-xs text-slate-400">{payment.orderId}</span>
                <span className="text-slate-600">{inr(payment.amountInr)}</span>
                <Badge tone={statusTone(payment.status)}>{payment.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-slate-900">Latest bookings</h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {recent.map((appointment) => (
            <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span className="text-slate-700">
                {appointment.patient.name} → Dr. {appointment.doctor.user.name}
              </span>
              <span className="text-slate-500">{dateTime(appointment.scheduledAt)}</span>
              <Badge tone={statusTone(appointment.status)}>{appointment.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
