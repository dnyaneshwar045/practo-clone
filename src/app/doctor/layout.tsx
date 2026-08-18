import Link from "next/link";
import { requireDoctor } from "@/lib/auth";
import { Badge } from "@/components/ui";

const tabs = [
  { href: "/doctor", label: "Appointments" },
  { href: "/doctor/availability", label: "Availability" },
  { href: "/doctor/profile", label: "My profile" },
];

export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { user, doctor } = await requireDoctor();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dr. {user.name}</h1>
          <p className="text-sm text-slate-500">
            {doctor.specialty} · {doctor.clinicName}, {doctor.city}
          </p>
        </div>
        <Badge tone={doctor.status === "APPROVED" ? "green" : doctor.status === "PENDING" ? "amber" : "red"}>
          {doctor.status === "APPROVED" ? "Verified & listed" : `Verification ${doctor.status.toLowerCase()}`}
        </Badge>
      </div>

      <nav className="flex gap-2 border-b border-slate-200 pb-2 text-sm">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
