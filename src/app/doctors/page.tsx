import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/DoctorCard";
import { DoctorSearchForm } from "@/components/forms/DoctorSearchForm";
import { Empty, SectionTitle } from "@/components/ui";

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
      <SectionTitle title="Find doctors" subtitle={`${doctors.length} doctor(s) available`} />
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
