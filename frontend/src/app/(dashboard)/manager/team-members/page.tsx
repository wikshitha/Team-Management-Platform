"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

import RoleGuard from "@/components/auth/RoleGuard";
import TeamMemberCard from "@/components/team-members/TeamMemberCard";
import Pagination from "@/components/ui/Pagination";

import { getTeamMembers } from "@/services/userService";

import { getApiErrorMessage } from "@/utils/apiError";

import type {
  PaginationData,
  TeamMemberListItem,
} from "@/types/user";

const EMPTY_PAGINATION: PaginationData = {
  page: 1,
  limit: 9,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function TeamMembersContent() {
  const [members, setMembers] = useState<
    TeamMemberListItem[]
  >([]);

  const [pagination, setPagination] =
    useState<PaginationData>(
      EMPTY_PAGINATION
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(9);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const hasFilters = Boolean(search);

  const loadMembers =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response =
          await getTeamMembers({
            search,
            page,
            limit,
          });

        setMembers(
          response.data.members
        );

        setPagination(
          response.data.pagination
        );
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load Team Members."
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      limit,
      page,
      search,
    ]);

  useEffect(() => {
    let isCancelled = false;

    const initializeMembers = async () => {
      try {
        const response =
          await getTeamMembers({
            search,
            page,
            limit,
          });

        if (!isCancelled) {
          setMembers(
            response.data.members
          );

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
              "Unable to load Team Members."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void initializeMembers();

    return () => {
      isCancelled = true;
    };
  }, [
    limit,
    page,
    search,
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
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Project Manager
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Team Members
        </h1>

        <p className="mt-2 max-w-3xl text-slate-600">
          Find active Team Members by name or email
          before assigning them to your projects.
          Project assignments are managed from each
          project&apos;s details page.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex w-full gap-2 xl:max-w-lg"
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
                placeholder="Search by name or email"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
           
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
              onClick={loadMembers}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <FiRefreshCw />
              Refresh
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
                className="h-72 animate-pulse rounded-2xl bg-slate-200"
              />
            )
          )}
        </section>
      )}

      {!isLoading && errorMessage && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-red-900">
            Unable to load Team Members
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={loadMembers}
            className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading &&
        !errorMessage &&
        members.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FiUsers className="text-3xl" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              {hasFilters
                ? "No matching Team Members"
                : "No Team Members found"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {hasFilters
                ? "No Team Members match your current search and status filter."
                : "The Administrator has not created any Team Member accounts yet."}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Clear filters
              </button>
            )}
          </section>
        )}

      {!isLoading &&
        !errorMessage &&
        members.length > 0 && (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
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
    </div>
  );
}

export default function ManagerTeamMembersPage() {
  return (
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
      <TeamMembersContent />
    </RoleGuard>
  );
}