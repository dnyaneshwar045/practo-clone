import { prisma } from "@/lib/prisma";
import { setDoctorStatus } from "@/lib/actions/content";
import { SubmitButton } from "@/components/SubmitButton";
import { Badge, Card, Empty, statusTone } from "@/components/ui";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      _count: { select: { appointments: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">Doctor verification &amp; listings</h2>
      {doctors.length === 0 ? (
        <Empty>No doctors have registered yet.</Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {doctors.map((doctor) => (
            <li key={doctor.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-medium text-slate-900">
                  Dr. {doctor.user.name} <span className="text-sm font-normal text-slate-500">· {doctor.specialty}</span>
                </p>
                <p className="text-sm text-slate-500">
                  {doctor.clinicName}, {doctor.city} · {doctor.experienceYears} yrs · {inr(doctor.consultationFee)}
                </p>
                <p className="text-sm text-slate-500">
                  {doctor.user.email} · {doctor.user.phone ?? "no phone"} · {doctor._count.appointments} appointment(s)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(doctor.status)}>{doctor.status}</Badge>
                {doctor.status !== "APPROVED" ? (
                  <form action={setDoctorStatus}>
                    <input type="hidden" name="id" value={doctor.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <SubmitButton>Approve</SubmitButton>
                  </form>
                ) : null}
                {doctor.status !== "REJECTED" ? (
                  <form action={setDoctorStatus}>
                    <input type="hidden" name="id" value={doctor.id} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <SubmitButton variant="danger">Reject</SubmitButton>
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
