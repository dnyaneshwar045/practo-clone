import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { inr } from "@/lib/format";

export type DoctorCardData = {
  id: string;
  specialty: string;
  city: string;
  clinicName: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  user: { name: string };
};

export function DoctorCard({ doctor }: { doctor: DoctorCardData }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Dr. {doctor.user.name}</h3>
          <p className="text-sm text-sky-700">{doctor.specialty}</p>
          <p className="mt-1 text-sm text-slate-500">
            {doctor.clinicName}, {doctor.city}
          </p>
        </div>
        <Badge tone="green">{doctor.rating.toFixed(1)} ★</Badge>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2 py-1">{doctor.experienceYears} yrs experience</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">{inr(doctor.consultationFee)} consultation</span>
      </div>

      <Link
        href={`/doctors/${doctor.id}`}
        className="mt-auto inline-flex justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
      >
        View profile &amp; book
      </Link>
    </Card>
  );
}
