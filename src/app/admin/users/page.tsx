import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";
import { dateOnly } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { appointments: true, subscriptions: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-slate-900">All users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Role</th>
              <th className="py-2">Appointments</th>
              <th className="py-2">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 font-medium text-slate-800">{user.name}</td>
                <td className="py-2 text-slate-600">{user.email}</td>
                <td className="py-2 text-slate-600">{user.phone ?? "—"}</td>
                <td className="py-2">
                  <Badge tone={user.role === "ADMIN" ? "blue" : user.role === "DOCTOR" ? "green" : "slate"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="py-2 text-slate-600">{user._count.appointments}</td>
                <td className="py-2 text-slate-600">{dateOnly(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
