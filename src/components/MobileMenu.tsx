"use client";

import { useState } from "react";
import Link from "next/link";

/** Hamburger navigation for viewports below the desktop breakpoint. */
export function MobileMenu({
  links,
  dashboardHref,
}: {
  links: { href: string; label: string }[];
  dashboardHref: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 text-slate-700"
      >
        <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white p-3 shadow-xl">
          <div className="mx-auto grid max-w-6xl gap-1 text-sm">
            {(dashboardHref ? [{ href: dashboardHref, label: "My dashboard" }, ...links] : links).map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
