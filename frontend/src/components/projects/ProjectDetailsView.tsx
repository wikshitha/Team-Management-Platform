"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiCalendar,
  FiEdit2,
  FiList,
  FiPlus,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

import PriorityBadge from "@/components/dashboard/PriorityBadge";

import AssignMemberModal from "@/components/projects/AssignMemberModal";
import ProjectFormModal from "@/components/projects/ProjectFormModal";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";

import TaskCard from "@/components/tasks/TaskCard";
import TaskFormModal from "@/components/tasks/TaskFormModal";

import ConfirmModal from "@/components/ui/ConfirmModal";

import {
  getProjectById,
  getProjectMembers,
  removeProjectMember,
} from "@/services/projectService";

import {
  deleteTask,
  getProjectTasks,
} from "@/services/taskService";

import { formatDate } from "@/utils/dateFormat";
import { getApiErrorMessage } from "@/utils/apiError";
import { getUserInitials } from "@/utils/userInitials";

import type {
  Project,
  ProjectMember,
} from "@/types/project";

import type { Task } from "@/types/task";

interface ProjectDetailsViewProps {
  backHref: string;
}

export default function ProjectDetailsView({
  backHref,
}: ProjectDetailsViewProps) {
  const params = useParams<{
    id: string;
  }>();

  const projectId = params.id;

  const [project, setProject] =
    useState<Project | null>(null);

  const [members, setMembers] = useState<
    ProjectMember[]
  >([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isAssignOpen, setIsAssignOpen] =
    useState(false);

  const [isCreateTaskOpen, setIsCreateTaskOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [removeTarget, setRemoveTarget] =
    useState<ProjectMember | null>(null);

  const [deleteTaskTarget, setDeleteTaskTarget] =
    useState<Task | null>(null);

  const [isRemoving, setIsRemoving] =
    useState(false);

  const [isDeletingTask, setIsDeletingTask] =
    useState(false);

  const taskBasePath = useMemo(() => {
    if (backHref.startsWith("/admin")) {
      return "/admin/tasks";
    }

    return "/manager/tasks";
  }, [backHref]);

  const loadProject = useCallback(async () => {
    const response =
      await getProjectById(projectId);

    setProject(response.data.project);
  }, [projectId]);

  const loadMembers = useCallback(async () => {
    const response =
      await getProjectMembers(projectId);

    setMembers(response.data.members);
  }, [projectId]);

  const loadTasks = useCallback(async () => {
    const response = await getProjectTasks(
      projectId,
      {
        page: 1,
        limit: 6,
      }
    );

    setTasks(response.data.tasks);
  }, [projectId]);

  const refreshDetails = useCallback(async () => {
    try {
      await Promise.all([
        loadProject(),
        loadMembers(),
        loadTasks(),
      ]);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to refresh project details."
        )
      );
    }
  }, [
    loadMembers,
    loadProject,
    loadTasks,
  ]);

  useEffect(() => {
    let isCancelled = false;

    const initializeDetails = async () => {
      try {
        const [
          projectResponse,
          memberResponse,
          tasksResponse,
        ] = await Promise.all([
          getProjectById(projectId),

          getProjectMembers(projectId),

          getProjectTasks(projectId, {
            page: 1,
            limit: 6,
          }),
        ]);

        if (!isCancelled) {
          setProject(
            projectResponse.data.project
          );

          setMembers(
            memberResponse.data.members
          );

          setTasks(
            tasksResponse.data.tasks
          );

          setErrorMessage("");
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              "Unable to load project details."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void initializeDetails();

    return () => {
      isCancelled = true;
    };
  }, [projectId]);

  const handleRemoveMember = async () => {
    if (!removeTarget) {
      return;
    }

    try {
      setIsRemoving(true);

      await removeProjectMember(
        projectId,
        removeTarget.user.id
      );

      toast.success(
        "Team Member removed successfully."
      );

      setRemoveTarget(null);

      await refreshDetails();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to remove Team Member."
        )
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskTarget) {
      return;
    }

    try {
      setIsDeletingTask(true);

      await deleteTask(deleteTaskTarget.id);

      toast.success(
        "Task deleted successfully."
      );

      setDeleteTaskTarget(null);

      await refreshDetails();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete task."
        )
      );
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleProjectSaved = async () => {
    setIsEditOpen(false);
    await refreshDetails();
  };

  const handleMemberAssigned = async () => {
    await refreshDetails();
  };

  const handleTaskSaved = async () => {
    setIsCreateTaskOpen(false);
    setEditingTask(null);

    await refreshDetails();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-72 rounded bg-slate-200" />

        <div className="h-52 rounded-2xl bg-slate-200" />

        <div className="h-80 rounded-2xl bg-slate-200" />

        <div className="h-96 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (errorMessage || !project) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
        <h1 className="text-xl font-semibold text-red-900">
          Unable to load project
        </h1>

        <p className="mt-2 text-sm text-red-700">
          {errorMessage ||
            "Project information is unavailable."}
        </p>

        <Link
          href={backHref}
          className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Return to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to projects
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {project.name}
              </h1>

              <ProjectStatusBadge
                status={project.status}
              />

              <PriorityBadge
                value={project.priority}
              />
            </div>

            <p className="mt-3 max-w-3xl whitespace-pre-wrap leading-7 text-slate-600">
              {project.description ||
                "No project description has been provided."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setIsAssignOpen(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <FiPlus />
              Add member
            </button>

            <button
              type="button"
              onClick={() =>
                setIsCreateTaskOpen(true)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FiPlus />
              Create task
            </button>

            <button
              type="button"
              onClick={() =>
                setIsEditOpen(true)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiEdit2 />
              Edit project
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FiUsers className="text-2xl text-blue-600" />

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {project._count.members}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Project members
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FiList className="text-2xl text-violet-600" />

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {project._count.tasks}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Project tasks
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FiCalendar className="text-2xl text-emerald-600" />

          <p className="mt-4 font-bold text-slate-900">
            {formatDate(project.startDate)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Start date
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FiCalendar className="text-2xl text-red-600" />

          <p className="mt-4 font-bold text-slate-900">
            {formatDate(project.dueDate)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Due date
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Project Team
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Team Members assigned to this project.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsAssignOpen(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus />
            Add member
          </button>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <FiUsers className="mx-auto text-5xl text-slate-300" />

            <p className="mt-4 font-semibold text-slate-800">
              No Team Members assigned
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add Team Members before assigning tasks.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((membership) => (
              <div
                key={membership.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {getUserInitials(
                      membership.user.name
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {membership.user.name}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                      {membership.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="hidden text-sm text-slate-500 sm:block">
                    {membership.user._count
                      ?.assignedTasks || 0}{" "}
                    assigned task
                    {(membership.user._count
                      ?.assignedTasks || 0) === 1
                      ? ""
                      : "s"}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setRemoveTarget(membership)
                    }
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    title="Remove member"
                    aria-label={`Remove ${membership.user.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Project Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The six most recent tasks created for this
              project.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsCreateTaskOpen(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus />
            Create task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="py-12 text-center">
            <FiList className="mx-auto text-5xl text-slate-300" />

            <p className="mt-4 font-semibold text-slate-800">
              No project tasks
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create the first task for this project.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                detailsHref={`${taskBasePath}/${task.id}`}
                canManage
                onEdit={setEditingTask}
                onDelete={setDeleteTaskTarget}
              />
            ))}
          </div>
        )}
      </section>

      <ProjectFormModal
        isOpen={isEditOpen}
        project={project}
        onClose={() =>
          setIsEditOpen(false)
        }
        onSaved={handleProjectSaved}
      />

      <AssignMemberModal
        isOpen={isAssignOpen}
        projectId={projectId}
        onClose={() =>
          setIsAssignOpen(false)
        }
        onAssigned={
          handleMemberAssigned
        }
      />

      <TaskFormModal
        isOpen={isCreateTaskOpen}
        fixedProjectId={projectId}
        onClose={() =>
          setIsCreateTaskOpen(false)
        }
        onSaved={handleTaskSaved}
      />

      <TaskFormModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        fixedProjectId={projectId}
        onClose={() =>
          setEditingTask(null)
        }
        onSaved={handleTaskSaved}
      />

      <ConfirmModal
        isOpen={Boolean(removeTarget)}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${removeTarget?.user.name} from this project? Their assigned project tasks will be unassigned.`}
        confirmLabel="Remove member"
        isSubmitting={isRemoving}
        onClose={() =>
          setRemoveTarget(null)
        }
        onConfirm={handleRemoveMember}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTaskTarget)}
        title="Delete task"
        message={`Are you sure you want to permanently delete "${deleteTaskTarget?.title}"? Its comments will also be removed.`}
        confirmLabel="Delete task"
        isSubmitting={isDeletingTask}
        onClose={() =>
          setDeleteTaskTarget(null)
        }
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}