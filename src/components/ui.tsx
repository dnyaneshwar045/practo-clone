import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-sky-100 text-sky-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-rose-100 text-rose-700",
};

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: keyof typeof badgeTones }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(status: string): keyof typeof badgeTones {
  if (["CONFIRMED", "APPROVED", "ACTIVE", "SCHEDULED", "PAID"].includes(status)) return "green";
  if (["PENDING", "REQUESTED"].includes(status)) return "amber";
  if (["CANCELLED", "REJECTED", "EXPIRED", "FAILED"].includes(status)) return "red";
  if (status === "REFUNDED") return "slate";
  return "blue";
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function Alert({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p
      className={`rounded-lg px-3 py-2 text-sm ${
        error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {error ?? success}
    </p>
  );
}
