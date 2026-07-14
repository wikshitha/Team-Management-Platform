import type { UserRole } from "@/types/auth";

interface RoleBadgeProps {
  role: UserRole;
}

const roleClasses: Record<UserRole, string> = {
  ADMIN:
    "bg-violet-50 text-violet-700 ring-violet-600/20",

  PROJECT_MANAGER:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  TEAM_MEMBER:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrator",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
};

export default function RoleBadge({
  role,
}: RoleBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        roleClasses[role],
      ].join(" ")}
    >
      {roleLabels[role]}
    </span>
  );
}