"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "danger";
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    ghost: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "border border-rose-200 text-rose-600 hover:bg-rose-50",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}
