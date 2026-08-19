import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import { MobileMenu } from "@/components/MobileMenu";

const links = [
  { href: "/doctors", label: "Find Doctors" },
  { href: "/articles", label: "Health Articles" },
  { href: "/plans", label: "Premium Plans" },
  { href: "/demo", label: "Free Demo" },
];

export async function Navbar() {
  const user = await getSessionUser();
  const home = user?.role === "ADMIN" ? "/admin" : user?.role === "DOCTOR" ? "/doctor" : "/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-sky-700">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30">
            +
          </span>
          practo<span className="-ml-2 text-slate-900">clone</span>
        </Link>

        <div className="hidden items-center gap-1 text-sm text-slate-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 transition hover:bg-sky-50 hover:text-sky-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                href={home}
                className="hidden rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
              >
                {user.name.split(" ")[0]}&apos;s {user.role === "ADMIN" ? "admin" : "dashboard"}
              </Link>
              <form action={logout}>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition hover:bg-slate-50">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-sky-600 to-cyan-500 px-3 py-2 font-medium text-white shadow-lg shadow-sky-600/25 transition hover:brightness-105"
              >
                Sign up
              </Link>
            </>
          )}
          <MobileMenu links={links} dashboardHref={user ? home : null} />
        </div>
      </nav>
    </header>
  );
}
