"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  FiSearch,
  FiUserPlus,
} from "react-icons/fi";

import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";

import {
  addProjectMember,
  getAvailableProjectMembers,
} from "@/services/projectService";

import { getApiErrorMessage } from "@/utils/apiError";
import { getUserInitials } from "@/utils/userInitials";

import type {
  AvailableTeamMember,
} from "@/types/project";

import type { PaginationData } from "@/types/user";

interface AssignMemberModalProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  onAssigned: () => void;
}

const EMPTY_PAGINATION: PaginationData = {
  page: 1,
  limit: 5,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function AssignMemberModal({
  isOpen,
  projectId,
  onClose,
  onAssigned,
}: AssignMemberModalProps) {
  const [members, setMembers] = useState<
    AvailableTeamMember[]
  >([]);

  const [pagination, setPagination] =
    useState<PaginationData>(
      EMPTY_PAGINATION
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [assigningUserId, setAssigningUserId] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !projectId) {
      return;
    }

    let isCancelled = false;

    const loadAvailableMembers = async () => {
      try {
        const response =
          await getAvailableProjectMembers(
            projectId,
            {
              search,
              page,
              limit: 5,
            }
          );

        if (!isCancelled) {
          setMembers(response.data.members);
          setPagination(
            response.data.pagination
          );
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            getApiErrorMessage(
              error,
              "Unable to load available Team Members."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAvailableMembers();

    return () => {
      isCancelled = true;
    };
  }, [
    isOpen,
    page,
    projectId,
    search,
  ]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleAssign = async (
    userId: string
  ) => {
    try {
      setAssigningUserId(userId);

      await addProjectMember(
        projectId,
        userId
      );

      toast.success(
        "Team Member assigned successfully."
      );

      setMembers((currentMembers) =>
        currentMembers.filter(
          (member) => member.id !== userId
        )
      );

      onAssigned();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to assign Team Member."
        )
      );
    } finally {
      setAssigningUserId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Assign Team Member"
      description="Search active Team Members by name or email."
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <form
        onSubmit={handleSearch}
        className="flex gap-2"
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
            placeholder="Search name or email"
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

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-lg bg-slate-100"
                />
              )
            )}
          </div>
        ) : members.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No available Team Members
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All matching members may already be
              assigned to this project.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                    {getUserInitials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {member.name}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                      {member.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleAssign(member.id)
                  }
                  disabled={
                    assigningUserId === member.id
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <FiUserPlus />

                  {assigningUserId === member.id
                    ? "Adding..."
                    : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          hasPreviousPage={
            pagination.hasPreviousPage
          }
          hasNextPage={
            pagination.hasNextPage
          }
          onPageChange={setPage}
        />
      </div>
    </Modal>
  );
}