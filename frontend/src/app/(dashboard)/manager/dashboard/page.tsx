import RoleGuard from "@/components/auth/RoleGuard";

export default function ManagerDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Project Manager
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Manage projects, assign Team Members, and
          monitor task progress.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <p className="text-slate-600">
            Project Manager dashboard statistics will be
            connected next.
          </p>
        </div>
      </section>
    </RoleGuard>
  );
}