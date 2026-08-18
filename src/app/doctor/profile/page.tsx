import { requireDoctor } from "@/lib/auth";
import { DoctorProfileForm } from "@/components/forms/DoctorProfileForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage() {
  const { doctor } = await requireDoctor();

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">Practice profile</h2>
      <DoctorProfileForm doctor={doctor} />
    </Card>
  );
}
