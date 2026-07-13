import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-10 text-center shadow-lg">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Full-Stack Application
        </p>

        <h1 className="text-4xl font-bold text-gray-900">
          Project and Team Task Management Platform
        </h1>

        <p className="mt-4 text-gray-600">
          Manage users, projects, project teams, tasks, progress, comments,
          notifications, and system activities from one platform.
        </p>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900">Administrator</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage users, roles, access, projects, and system activity.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900">Project Manager</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create projects, manage teams, and assign project tasks.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900">Team Member</h2>
            <p className="mt-2 text-sm text-gray-600">
              View assigned work, update progress, and collaborate.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
