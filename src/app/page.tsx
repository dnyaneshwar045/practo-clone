import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/DoctorCard";
import { Card, SectionTitle } from "@/components/ui";
import { inr, dateOnly } from "@/lib/format";

const specialties = [
  "General Physician",
  "Dermatologist",
  "Pediatrician",
  "Gynecologist",
  "Cardiologist",
  "Dentist",
  "Orthopedist",
  "Psychiatrist",
];

export default async function HomePage() {
  const [doctors, articles, plans, stats] = await Promise.all([
    prisma.doctor.findMany({
      where: { status: "APPROVED" },
      include: { user: { select: { name: true } } },
      orderBy: { rating: "desc" },
      take: 6,
    }),
    prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.plan.findMany({ where: { active: true }, orderBy: { priceInr: "asc" }, take: 3 }),
    Promise.all([
      prisma.doctor.count({ where: { status: "APPROVED" } }),
      prisma.appointment.count(),
      prisma.article.count({ where: { published: true } }),
    ]),
  ]);

  const [doctorCount, appointmentCount, articleCount] = stats;

  return (
    <div className="space-y-16">
      <section className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 px-6 py-14 text-white">
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
          Your home for health — find and book the right doctor
        </h1>
        <p className="mt-3 max-w-xl text-sky-100">
          Verified specialists, instant appointment booking, video consultations and premium care plans.
        </p>

        <form action="/doctors" className="mt-8 grid gap-3 rounded-xl bg-white p-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            name="city"
            placeholder="City (e.g. Pune)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"
          />
          <input
            name="q"
            placeholder="Search doctors, clinics, specialities"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500"
          />
          <button className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700">
            Search
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-8 text-sm">
          <div>
            <p className="text-2xl font-bold">{doctorCount}</p>
            <p className="text-sky-100">verified doctors</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{appointmentCount}</p>
            <p className="text-sky-100">appointments booked</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{articleCount}</p>
            <p className="text-sky-100">health articles</p>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Consult top specialities" subtitle="Book an appointment in a couple of clicks" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {specialties.map((specialty) => (
            <Link
              key={specialty}
              href={`/doctors?specialty=${encodeURIComponent(specialty)}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-700"
            >
              {specialty}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Top rated doctors"
          subtitle="Verified by our medical team"
          action={
            <Link href="/doctors" className="text-sm font-medium text-sky-700 hover:underline">
              View all doctors →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Premium care plans"
          subtitle="Unlimited chats, discounted consultations and priority slots"
          action={
            <Link href="/plans" className="text-sm font-medium text-sky-700 hover:underline">
              Compare plans →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <h3 className="font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold text-sky-700">
                {inr(plan.priceInr)}
                <span className="text-sm font-normal text-slate-500">/{plan.intervalDays}d</span>
              </p>
              <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Latest health articles"
          subtitle="Written and reviewed by doctors"
          action={
            <Link href="/articles" className="text-sm font-medium text-sky-700 hover:underline">
              Read the health library →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="h-full transition hover:border-sky-400">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-700">{article.category}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{article.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500">{article.excerpt}</p>
                <p className="mt-3 text-xs text-slate-400">{dateOnly(article.createdAt)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-sky-200 bg-sky-50 px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Not sure which doctor you need?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Schedule a free 15-minute demo consultation with our care team and we will guide you to the right specialist.
        </p>
        <Link
          href="/demo"
          className="mt-5 inline-flex rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Schedule free consultation
        </Link>
      </section>
    </div>
  );
}
