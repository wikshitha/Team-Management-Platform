import type { ProjectStatus } from "@/types/project";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusClasses: Record<ProjectStatus, string> = {
  PLANNING:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  ACTIVE:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

  ON_HOLD:
    "bg-amber-50 text-amber-700 ring-amber-600/20",

  COMPLETED:
    "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};

export default function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusClasses[status],
      ].join(" ")}
    >
      {statusLabels[status]}
    </span>
  );
}