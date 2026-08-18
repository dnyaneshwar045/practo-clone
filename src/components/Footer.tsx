import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-slate-600 md:grid-cols-4">
        <div>
          <p className="text-base font-bold text-sky-700">practoclone</p>
          <p className="mt-2 text-slate-500">
            Book appointments, read trusted health articles and consult specialists online.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Patients</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/doctors" className="hover:text-sky-700">Search doctors</Link></li>
            <li><Link href="/plans" className="hover:text-sky-700">Premium plans</Link></li>
            <li><Link href="/demo" className="hover:text-sky-700">Free demo consultation</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Doctors</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/register?role=DOCTOR" className="hover:text-sky-700">List your practice</Link></li>
            <li><Link href="/doctor" className="hover:text-sky-700">Doctor dashboard</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900">More</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/articles" className="hover:text-sky-700">Health library</Link></li>
            <li><Link href="/admin" className="hover:text-sky-700">Admin panel</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        Demo project for educational purposes. Not affiliated with Practo.
      </p>
    </footer>
  );
}
