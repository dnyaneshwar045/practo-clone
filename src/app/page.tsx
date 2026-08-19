import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/DoctorCard";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionTitle } from "@/components/ui";
import { inr } from "@/lib/format";
import { IMAGES, photo } from "@/lib/images";

const specialties = [
  { name: "General Physician", icon: "🩺" },
  { name: "Dermatologist", icon: "✨" },
  { name: "Pediatrician", icon: "🧸" },
  { name: "Gynecologist", icon: "🌸" },
  { name: "Cardiologist", icon: "❤️" },
  { name: "Dentist", icon: "🦷" },
  { name: "Orthopedist", icon: "🦴" },
  { name: "Psychiatrist", icon: "🧠" },
];

const promises = [
  { title: "Verified doctors", body: "Every profile is reviewed by our medical team before it goes live.", icon: "✅" },
  { title: "Instant online payment", body: "Pay the consultation fee by UPI, card or wallet — or pay at the clinic.", icon: "💳" },
  { title: "Video or in clinic", body: "Consult from home over video or book an in-person visit nearby.", icon: "📹" },
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
    <div className="space-y-14 sm:space-y-20">
      <section className="fade-up relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl shadow-sky-900/20">
        <Image
          src={photo(IMAGES.heroConsultation, 1600, 900)}
          alt="Doctor consulting a patient"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/90 via-sky-800/70 to-cyan-700/50" />

        <div className="relative px-5 py-12 sm:px-10 sm:py-16">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-50 ring-1 ring-white/30">
            Your home for health
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-balance sm:text-5xl">
            Find the right doctor and book in seconds
          </h1>
          <p className="mt-3 max-w-xl text-sky-50/90">
            Verified specialists, instant appointment booking, secure online payments, video consultations
            and premium care plans.
          </p>

          <form action="/doctors" className="mt-8 grid gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:grid-cols-[1fr_1.4fr_auto]">
            <input
              name="city"
              placeholder="📍 City (e.g. Pune)"
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none focus:border-sky-500"
            />
            <input
              name="q"
              placeholder="🔍 Doctors, clinics or specialities"
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none focus:border-sky-500"
            />
            <button className="rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:brightness-105">
              Search
            </button>
          </form>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm">
            {[
              { value: doctorCount, label: "verified doctors" },
              { value: appointmentCount, label: "appointments" },
              { value: articleCount, label: "health articles" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl px-4 py-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-sky-50/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {promises.map((item) => (
          <div key={item.title} className="card-3d rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-xl">{item.icon}</span>
            <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.body}</p>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle title="Consult top specialities" subtitle="Book an appointment in a couple of clicks" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {specialties.map((specialty) => (
            <Link
              key={specialty.name}
              href={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
              className="lift rounded-2xl border border-slate-200/80 bg-white px-4 py-5 text-center shadow-sm transition hover:border-sky-400"
            >
              <span className="text-2xl" aria-hidden>
                {specialty.icon}
              </span>
              <span className="mt-2 block text-sm font-medium text-slate-700">{specialty.name}</span>
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

      <section className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <Image
          src={photo(IMAGES.abstractBlue, 1200, 600)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
        <div className="relative">
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
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`card-3d rounded-2xl border p-5 shadow-sm ${
                  index === 1
                    ? "border-sky-400 bg-gradient-to-br from-sky-600 to-cyan-500 text-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                {index === 1 ? (
                  <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                    Most popular
                  </span>
                ) : null}
                <h3 className={`mt-2 font-semibold ${index === 1 ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-2xl font-bold ${index === 1 ? "text-white" : "text-sky-700"}`}>
                  {inr(plan.priceInr)}
                  <span className={`text-sm font-normal ${index === 1 ? "text-sky-50" : "text-slate-500"}`}>
                    /{plan.intervalDays}d
                  </span>
                </p>
                <p className={`mt-2 text-sm ${index === 1 ? "text-sky-50" : "text-slate-500"}`}>
                  {plan.description}
                </p>
              </div>
            ))}
          </div>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="relative grid overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl md:grid-cols-2">
        <div className="relative z-10 px-6 py-10 sm:px-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Not sure which doctor you need?</h2>
          <p className="mt-3 max-w-md text-sm text-slate-200">
            Schedule a free 15-minute demo consultation with our care team and we will guide you to the
            right specialist — no payment needed.
          </p>
          <Link
            href="/demo"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 shadow-lg transition hover:bg-sky-50"
          >
            Schedule free consultation
          </Link>
        </div>
        <div className="relative min-h-[220px]">
          <Image
            src={photo(IMAGES.videoConsultation, 900, 700)}
            alt="Patient on a video consultation"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
        </div>
      </section>
    </div>
  );
}
