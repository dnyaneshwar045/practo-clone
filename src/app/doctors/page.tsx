import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/DoctorCard";
import { IMAGES, photo } from "@/lib/images";
import { DoctorSearchForm } from "@/components/forms/DoctorSearchForm";
import { Empty } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: { q?: string; specialty?: string; city?: string };
}) {
  const { q, specialty, city } = searchParams;

  const approved = await prisma.doctor.findMany({
    where: { status: "APPROVED" },
    include: { user: { select: { name: true } } },
    orderBy: [{ rating: "desc" }, { experienceYears: "desc" }],
  });

  const needle = q?.trim().toLowerCase();
  const doctors = approved.filter((doctor) => {
    if (specialty && doctor.specialty !== specialty) return false;
    if (city && doctor.city !== city) return false;
    if (!needle) return true;
    return [doctor.user.name, doctor.clinicName, doctor.specialty, doctor.city]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  const specialties = Array.from(new Set(approved.map((d) => d.specialty))).sort();
  const cities = Array.from(new Set(approved.map((d) => d.city))).sort();

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-5 py-8 text-white shadow-xl sm:px-8 sm:py-10">
        <Image
          src={photo(IMAGES.hospitalWard, 1400, 500)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-cyan-700/50" />
        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">Find doctors near you</h1>
          <p className="mt-2 text-sm text-sky-50/90">
            {doctors.length} verified doctor(s) available for video and in-clinic consultations
          </p>
        </div>
      </section>

      <DoctorSearchForm specialties={specialties} cities={cities} current={{ q, specialty, city }} />

      {doctors.length === 0 ? (
        <Empty>No doctors match your search. Try clearing the filters.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}
