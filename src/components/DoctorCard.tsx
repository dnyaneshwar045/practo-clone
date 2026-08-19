import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui";
import { inr } from "@/lib/format";

export type DoctorCardData = {
  id: string;
  specialty: string;
  city: string;
  clinicName: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  photoUrl?: string | null;
  user: { name: string };
};

export function DoctorCard({ doctor }: { doctor: DoctorCardData }) {
  return (
    <div className="card-3d flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar doctorId={doctor.id} photoUrl={doctor.photoUrl ?? null} name={doctor.user.name} size={64} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">Dr. {doctor.user.name}</h3>
          <p className="text-sm font-medium text-sky-700">{doctor.specialty}</p>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {doctor.clinicName}, {doctor.city}
          </p>
        </div>
        <Badge tone="green">{doctor.rating.toFixed(1)} ★</Badge>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2.5 py-1">{doctor.experienceYears} yrs experience</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
          {inr(doctor.consultationFee)} consultation
        </span>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">Video &amp; in-clinic</span>
      </div>

      <Link
        href={`/doctors/${doctor.id}`}
        className="mt-auto inline-flex justify-center rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:brightness-105"
      >
        View profile &amp; book
      </Link>
    </div>
  );
}
