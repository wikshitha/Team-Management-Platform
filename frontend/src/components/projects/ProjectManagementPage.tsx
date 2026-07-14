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

import ProjectCard from "@/components/projects/ProjectCard";
import ProjectEmptyState from "@/components/projects/ProjectEmptyState";
import ProjectFormModal from "@/components/projects/ProjectFormModal";

import {
  deleteProject,
  getProjects,
} from "@/services/projectService";

import { getApiErrorMessage } from "@/utils/apiError";

import type {
  Priority,
  Project,
  ProjectStatus,
} from "@/types/project";

import type { PaginationData } from "@/types/user";

interface ProjectManagementPageProps {
  basePath: "/admin/projects" | "/manager/projects";
  canDelete: boolean;
  headingRole: string;
}

const EMPTY_PAGINATION: PaginationData = {
  page: 1,
  limit: 9,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function ProjectManagementPage({
  basePath,
  canDelete,
  headingRole,
}: ProjectManagementPageProps) {
  const [projects, setProjects] = useState<
    Project[]
  >([]);

  const [pagination, setPagination] =
    useState<PaginationData>(
      EMPTY_PAGINATION
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<ProjectStatus | "">("");

  const [priority, setPriority] =
    useState<Priority | "">("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(9);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Project | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const hasFilters = Boolean(
    search || status || priority
  );

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getProjects({
        search,
        status,
        priority,
        page,
        limit,
      });

      setProjects(response.data.projects);
      setPagination(response.data.pagination);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load projects."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    limit,
    page,
    priority,
    search,
    status,
  ]);

  useEffect(() => {
    let isCancelled = false;

    const initializeProjects = async () => {
      try {
        const response = await getProjects({
          search,
          status,
          priority,
          page,
          limit,
        });

        if (!isCancelled) {
          setProjects(response.data.projects);
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
              "Unable to load projects."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void initializeProjects();

    return () => {
      isCancelled = true;
    };
  }, [
    limit,
    page,
    priority,
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
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteProject(deleteTarget.id);

      toast.success(
        "Project deleted successfully."
      );

      setDeleteTarget(null);

      if (
        projects.length === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      } else {
        await loadProjects();
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete project."
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
            {headingRole}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Projects
          </h1>

          <p className="mt-2 text-slate-600">
            Create, manage, and monitor project
            progress and team membership.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiPlus />
          Create project
        </button>
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
                placeholder="Search projects"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
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
                      .value as ProjectStatus | ""
                  );

                  setPage(1);
                }}
                className="rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  All statuses
                </option>

                <option value="PLANNING">
                  Planning
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="ON_HOLD">
                  On Hold
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
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

            <select
              value={limit}
              onChange={(event) => {
                setLimit(
                  Number(event.target.value)
                );

                setPage(1);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              onClick={loadProjects}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <FiRefreshCw />
              Refresh
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
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
            Unable to load projects
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={loadProjects}
            className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading &&
        !errorMessage &&
        projects.length === 0 && (
          <ProjectEmptyState
            hasFilters={hasFilters}
            onCreate={() =>
              setIsCreateOpen(true)
            }
            onClearFilters={clearFilters}
          />
        )}

      {!isLoading &&
        !errorMessage &&
        projects.length > 0 && (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  detailsHref={`${basePath}/${project.id}`}
                  canDelete={canDelete}
                  onEdit={setEditingProject}
                  onDelete={setDeleteTarget}
                />
              ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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

      <ProjectFormModal
        isOpen={isCreateOpen}
        onClose={() =>
          setIsCreateOpen(false)
        }
        onSaved={loadProjects}
      />

      <ProjectFormModal
        isOpen={Boolean(editingProject)}
        project={editingProject}
        onClose={() =>
          setEditingProject(null)
        }
        onSaved={loadProjects}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? Its project members, tasks, and task comments may also be removed. This action cannot be undone.`}
        confirmLabel="Delete project"
        isSubmitting={isDeleting}
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}