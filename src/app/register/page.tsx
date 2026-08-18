import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: { role?: string } }) {
  const user = await getSessionUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : user.role === "DOCTOR" ? "/doctor" : "/dashboard");

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Book appointments as a patient or list your practice as a doctor.</p>
        <RegisterForm defaultRole={searchParams.role === "DOCTOR" ? "DOCTOR" : "PATIENT"} />
        <p className="mt-4 text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-sky-700 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
