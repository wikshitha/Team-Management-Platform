import type { TaskStatus } from "@/types/task";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusClasses: Record<TaskStatus, string> = {
  TODO:
    "bg-slate-100 text-slate-700 ring-slate-600/20",

  IN_PROGRESS:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  IN_REVIEW:
    "bg-amber-50 text-amber-700 ring-amber-600/20",

  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  COMPLETED: "Completed",
};

export default function TaskStatusBadge({
  status,
}: TaskStatusBadgeProps) {
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