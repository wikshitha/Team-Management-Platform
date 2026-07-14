import Link from "next/link";

import {
  FiCalendar,
  FiEdit2,
  FiList,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import PriorityBadge from "@/components/dashboard/PriorityBadge";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";

import { formatDate } from "@/utils/dateFormat";

import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  detailsHref: string;
  canDelete: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({
  project,
  detailsHref,
  canDelete,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={detailsHref}
            className="line-clamp-2 text-lg font-bold text-slate-900 transition hover:text-blue-600"
          >
            {project.name}
          </Link>

          <p className="mt-1 text-xs text-slate-500">
            Created by {project.createdBy.name}
          </p>
        </div>

        <PriorityBadge value={project.priority} />
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {project.description ||
          "No project description has been provided."}
      </p>

      <div className="mt-5">
        <ProjectStatusBadge
          status={project.status}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiUsers className="text-blue-600" />

          <span>
            {project._count.members} member
            {project._count.members === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiList className="text-violet-600" />

          <span>
            {project._count.tasks} task
            {project._count.tasks === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <FiCalendar />

        <span>
          Due: {formatDate(project.dueDate)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <Link
          href={detailsHref}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View details
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            title="Edit project"
          >
            <FiEdit2 />
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              title="Delete project"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}