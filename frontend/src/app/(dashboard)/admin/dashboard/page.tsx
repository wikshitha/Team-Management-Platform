import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Administrator
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Manage users, projects, tasks, roles, and
          overall system access.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-slate-600">
            Administrator dashboard statistics will be
            connected next.
          </p>
        </div>
      </section>
    </RoleGuard>
  );
}