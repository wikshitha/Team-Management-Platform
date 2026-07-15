"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiCalendar,
  FiCheckSquare,
  FiUsers,
} from "react-icons/fi";

import PriorityBadge from "@/components/dashboard/PriorityBadge";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import TaskCard from "@/components/tasks/TaskCard";

import {
  getProjectById,
  getProjectMembers,
} from "@/services/projectService";

import { getProjectTasks } from "@/services/taskService";

import { formatDate } from "@/utils/dateFormat";
import { getApiErrorMessage } from "@/utils/apiError";
import { getUserInitials } from "@/utils/userInitials";

import type {
  Project,
  ProjectMember,
} from "@/types/project";

import type { Task } from "@/types/task";

export default function MemberProjectDetailsView() {
  const params = useParams<{
    id: string;
  }>();

  const projectId = params.id;

  const [project, setProject] =
    useState<Project | null>(null);

  const [members, setMembers] = useState<
    ProjectMember[]
  >([]);

  const [tasks, setTasks] = useState<Task[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDetails =
    useCallback(async () => {
      try {
        const [
          projectResponse,
          memberResponse,
          taskResponse,
        ] = await Promise.all([
          getProjectById(projectId),

          getProjectMembers(projectId),

          getProjectTasks(projectId, {
            page: 1,
            limit: 50,
          }),
        ]);

        setProject(
          projectResponse.data.project
        );

        setMembers(
          memberResponse.data.members
        );

        setTasks(
          taskResponse.data.tasks
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to refresh project."
          )
        );
      }
    }, [projectId]);

  useEffect(() => {
    let isCancelled = false;

    const initializeDetails = async () => {
      try {
        const [
          projectResponse,
          memberResponse,
          taskResponse,
        ] = await Promise.all([
          getProjectById(projectId),

          getProjectMembers(projectId),

          getProjectTasks(projectId, {
            page: 1,
            limit: 50,
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
            taskResponse.data.tasks
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

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-72 rounded bg-slate-200" />

        <div className="h-52 rounded-2xl bg-slate-200" />

        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (errorMessage || !project) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
        <h1 className="text-xl font-semibold text-red-900">
          Unable to load project
        </h1>

        <p className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>

        <Link
          href="/member/projects"
          className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Return to My Projects
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/member/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to My Projects
        </Link>

        <div className="mt-5">
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

          <p className="mt-3 text-sm text-slate-500">
            Managed by{" "}
            <span className="font-semibold text-slate-700">
              {project.createdBy.name}
            </span>
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FiUsers className="text-2xl text-blue-600" />

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {members.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Project members
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FiCheckSquare className="text-2xl text-violet-600" />

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {tasks.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Visible project tasks
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
        <div className="border-b border-slate-200 px-5 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Project Team
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            People collaborating on this project.
          </p>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No Team Members are listed.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((membership) => (
              <div
                key={membership.id}
                className="flex items-center gap-3 px-5 py-4"
              >
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
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Project Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tasks available to you within this
              project.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDetails}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No tasks are currently visible for this
            project.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                detailsHref={`/member/tasks/${task.id}`}
                canManage={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}