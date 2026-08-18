import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : user.role === "DOCTOR" ? "/doctor" : "/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Patients, doctors and admins use the same login.</p>
        <LoginForm />
        <p className="mt-4 text-sm text-slate-500">
          New here?{" "}
          <Link href="/register" className="font-medium text-sky-700 hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
