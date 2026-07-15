import {
  FiCalendar,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";

import RoleBadge from "@/components/users/RoleBadge";
import UserStatusBadge from "@/components/users/UserStatusBadge";

import { getUserInitials } from "@/utils/userInitials";

import type { AuthUser } from "@/types/auth";

interface ProfileInformationProps {
  user: AuthUser;
}

const formatDate = (
  dateValue?: string
): string => {
  if (!dateValue) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
};

export default function ProfileInformation({
  user,
}: ProfileInformationProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
          {getUserInitials(user.name)}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {user.name}
          </h2>

          <p className="mt-1 text-slate-500">
            {user.email}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <RoleBadge role={user.role.name} />

            <UserStatusBadge
              status={user.status}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiUser />
            Full name
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {user.name}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiMail />
            Email address
          </div>

          <p className="mt-2 break-all font-semibold text-slate-900">
            {user.email}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiShield />
            Account role
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {user.role.name
              .replaceAll("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
              )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiCalendar />
            Member since
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
}