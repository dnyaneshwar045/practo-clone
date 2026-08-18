import Link from "next/link";
import { requireRole } from "@/lib/auth";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/doctors", label: "Doctors" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/demos", label: "Demo requests" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Admin panel</h1>
      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-sm">
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
