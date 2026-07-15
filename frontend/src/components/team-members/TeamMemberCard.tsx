import {
  FiCheckSquare,
  FiFolder,
  FiMail,
} from "react-icons/fi";

import UserStatusBadge from "@/components/users/UserStatusBadge";

import { formatDate } from "@/utils/dateFormat";
import { getUserInitials } from "@/utils/userInitials";

import type { TeamMemberListItem } from "@/types/user";

interface TeamMemberCardProps {
  member: TeamMemberListItem;
}

export default function TeamMemberCard({
  member,
}: TeamMemberCardProps) {
  const projectCount =
    member._count?.projectMembers ?? 0;

  const taskCount =
    member._count?.assignedTasks ?? 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
          {getUserInitials(member.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {member.name}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <FiMail className="shrink-0" />

                <span className="truncate">
                  {member.email}
                </span>
              </div>
            </div>

            <UserStatusBadge
              status={member.status}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
            <FiFolder />
            Projects
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {projectCount}
          </p>
        </div>

        <div className="rounded-xl bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
            <FiCheckSquare />
            Tasks
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {taskCount}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">
          Account created {formatDate(member.createdAt)}
        </p>
      </div>
    </article>
  );
}