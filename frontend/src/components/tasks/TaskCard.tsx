import Link from "next/link";

import {
  FiCalendar,
  FiEdit2,
  FiMessageSquare,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import PriorityBadge from "@/components/dashboard/PriorityBadge";
import TaskStatusBadge from "@/components/tasks/TaskStatusBadge";

import { formatDate } from "@/utils/dateFormat";

import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  detailsHref: string;
  canManage: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskCard({
  task,
  detailsHref,
  canManage,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isOverdue =
    Boolean(task.dueDate) &&
    task.status !== "COMPLETED" &&
    new Date(task.dueDate as string) < new Date();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={detailsHref}
            className="line-clamp-2 text-lg font-bold text-slate-900 transition hover:text-blue-600"
          >
            {task.title}
          </Link>

          <p className="mt-1 truncate text-xs font-medium text-blue-600">
            {task.project.name}
          </p>
        </div>

        <PriorityBadge value={task.priority} />
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {task.description ||
          "No task description has been provided."}
      </p>

      <div className="mt-5">
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiUser className="text-blue-600" />

          <span className="truncate">
            {task.assignedTo?.name || "Unassigned"}
          </span>
        </div>

        <div
          className={[
            "flex items-center gap-2 text-sm",
            isOverdue
              ? "font-semibold text-red-600"
              : "text-slate-600",
          ].join(" ")}
        >
          <FiCalendar />

          <span>
            Due: {formatDate(task.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiMessageSquare className="text-violet-600" />

          <span>
            {task._count?.comments || 0} comment
            {(task._count?.comments || 0) === 1
              ? ""
              : "s"}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
        <Link
          href={detailsHref}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View details
        </Link>

        {canManage && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit?.(task)}
              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              title="Edit task"
            >
              <FiEdit2 />
            </button>

            <button
              type="button"
              onClick={() => onDelete?.(task)}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
              title="Delete task"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}