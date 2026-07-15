"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";

import TaskCard from "@/components/tasks/TaskCard";
import TaskEmptyState from "@/components/tasks/TaskEmptyState";
import TaskFormModal from "@/components/tasks/TaskFormModal";

import {
  deleteTask,
  getMyTasks,
  getProjectTasks,
  getTasks,
} from "@/services/taskService";

import { getProjects } from "@/services/projectService";

import { getApiErrorMessage } from "@/utils/apiError";

import type {
  Priority,
  Project,
} from "@/types/project";

import type {
  Task,
  TaskStatus,
} from "@/types/task";

import type { PaginationData } from "@/types/user";

interface TaskManagementPageProps {
  mode: "ADMIN" | "MANAGER" | "MEMBER";
  basePath:
    | "/admin/tasks"
    | "/manager/tasks"
    | "/member/tasks";
}

const EMPTY_PAGINATION: PaginationData = {
  page: 1,
  limit: 9,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function TaskManagementPage({
  mode,
  basePath,
}: TaskManagementPageProps) {
  const canManage = mode !== "MEMBER";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>(
    []
  );

  const [pagination, setPagination] =
    useState<PaginationData>(
      EMPTY_PAGINATION
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<TaskStatus | "">("");

  const [priority, setPriority] =
    useState<Priority | "">("");

  const [projectId, setProjectId] =
    useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Task | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const hasFilters = Boolean(
    search || status || priority || projectId
  );

  useEffect(() => {
    if (!canManage) {
      return;
    }

    let isCancelled = false;

    const loadProjects = async () => {
      try {
        const response = await getProjects({
          page: 1,
          limit: 100,
        });

        if (!isCancelled) {
          setProjects(response.data.projects);
        }
      } catch {
        if (!isCancelled) {
          setProjects([]);
        }
      }
    };

    void loadProjects();

    return () => {
      isCancelled = true;
    };
  }, [canManage]);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const filters = {
        search,
        status,
        priority,
        page,
        limit,
      };

      let response;

      if (mode === "MEMBER") {
        response = await getMyTasks(filters);
      } else if (projectId) {
        response = await getProjectTasks(
          projectId,
          filters
        );
      } else {
        response = await getTasks(filters);
      }

      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load tasks."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    limit,
    mode,
    page,
    priority,
    projectId,
    search,
    status,
  ]);

  useEffect(() => {
    let isCancelled = false;

    const initializeTasks = async () => {
      try {
        const filters = {
          search,
          status,
          priority,
          page,
          limit,
        };

        const response =
          mode === "MEMBER"
            ? await getMyTasks(filters)
            : projectId
              ? await getProjectTasks(
                  projectId,
                  filters
                )
              : await getTasks(filters);

        if (!isCancelled) {
          setTasks(response.data.tasks);
          setPagination(
            response.data.pagination
          );
          setErrorMessage("");
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              "Unable to load tasks."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void initializeTasks();

    return () => {
      isCancelled = true;
    };
  }, [
    limit,
    mode,
    page,
    priority,
    projectId,
    search,
    status,
  ]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPriority("");
    setProjectId("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteTask(deleteTarget.id);

      toast.success("Task deleted successfully.");

      setDeleteTarget(null);

      if (
        tasks.length === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      } else {
        await loadTasks();
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete task."
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {mode === "ADMIN"
              ? "Administration"
              : mode === "MANAGER"
                ? "Project Manager"
                : "Team Member"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {mode === "MEMBER"
              ? "My Tasks"
              : "Tasks"}
          </h1>

          <p className="mt-2 text-slate-600">
            {mode === "MEMBER"
              ? "View and update the progress of tasks assigned to you."
              : "Create, assign, and manage project tasks."}
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <FiPlus />
            Create task
          </button>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex w-full gap-2 xl:max-w-md"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search tasks"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="relative">
              <FiFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <select
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target
                      .value as TaskStatus | ""
                  );
                  setPage(1);
                }}
                className="rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm"
              >
                <option value="">
                  All statuses
                </option>
                <option value="TODO">
                  To Do
                </option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="IN_REVIEW">
                  In Review
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>

            <select
              value={priority}
              onChange={(event) => {
                setPriority(
                  event.target
                    .value as Priority | ""
                );
                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
            >
              <option value="">
                All priorities
              </option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">
                Medium
              </option>
              <option value="HIGH">High</option>
              <option value="URGENT">
                Urgent
              </option>
            </select>

            {canManage && (
              <select
                value={projectId}
                onChange={(event) => {
                  setProjectId(
                    event.target.value
                  );
                  setPage(1);
                }}
                className="max-w-52 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
              >
                <option value="">
                  All projects
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={limit}
              onChange={(event) => {
                setLimit(
                  Number(event.target.value)
                );
                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
            >
              <option value={9}>
                9 per page
              </option>
              <option value={18}>
                18 per page
              </option>
              <option value={36}>
                36 per page
              </option>
            </select>

            <button
              type="button"
              onClick={loadTasks}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"
            >
              <FiRefreshCw />
              Refresh
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <FiX />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {isLoading && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-slate-200"
              />
            )
          )}
        </section>
      )}

      {!isLoading && errorMessage && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-red-900">
            Unable to load tasks
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={loadTasks}
            className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading &&
        !errorMessage &&
        tasks.length === 0 && (
          <TaskEmptyState
            hasFilters={hasFilters}
            canCreate={canManage}
            onCreate={() =>
              setIsCreateOpen(true)
            }
            onClearFilters={clearFilters}
          />
        )}

      {!isLoading &&
        !errorMessage &&
        tasks.length > 0 && (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  detailsHref={`${basePath}/${task.id}`}
                  canManage={canManage}
                  onEdit={setEditingTask}
                  onDelete={setDeleteTarget}
                />
              ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Pagination
                page={pagination.page}
                totalPages={
                  pagination.totalPages
                }
                totalItems={
                  pagination.totalItems
                }
                hasPreviousPage={
                  pagination.hasPreviousPage
                }
                hasNextPage={
                  pagination.hasNextPage
                }
                onPageChange={setPage}
              />
            </section>
          </>
        )}

      {canManage && (
        <>
          <TaskFormModal
            isOpen={isCreateOpen}
            onClose={() =>
              setIsCreateOpen(false)
            }
            onSaved={loadTasks}
          />

          <TaskFormModal
            isOpen={Boolean(editingTask)}
            task={editingTask}
            onClose={() =>
              setEditingTask(null)
            }
            onSaved={loadTasks}
          />

          <ConfirmModal
            isOpen={Boolean(deleteTarget)}
            title="Delete task"
            message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? Its comments will also be removed.`}
            confirmLabel="Delete task"
            isSubmitting={isDeleting}
            onClose={() =>
              setDeleteTarget(null)
            }
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
}