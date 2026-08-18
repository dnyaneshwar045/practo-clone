import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";

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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-sky-700">
          practo<span className="text-slate-900">clone</span>
        </Link>

        <div className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-sky-700">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link href={home} className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">
                {user.name.split(" ")[0]}&apos;s {user.role === "ADMIN" ? "admin" : "dashboard"}
              </Link>
              <form action={logout}>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-700">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
