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
  FiUsers,
  FiX,
} from "react-icons/fi";

import RoleGuard from "@/components/auth/RoleGuard";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";

import ChangeRoleModal from "@/components/users/ChangeRoleModal";
import CreateUserModal from "@/components/users/CreateUserModal";
import EditUserModal from "@/components/users/EditUserModal";
import UserEmptyState from "@/components/users/UserEmptyState";
import UserTable from "@/components/users/UserTable";

import { useAuth } from "@/context/AuthContext";

import {
  deleteUser,
  getRoles,
  getUsers,
  updateUserStatus,
} from "@/services/userService";

import { getApiErrorMessage } from "@/utils/apiError";

import type {
  PaginationData,
  SystemRole,
  SystemUser,
} from "@/types/user";

import type {
  UserRole,
  UserStatus,
} from "@/types/auth";

const EMPTY_PAGINATION: PaginationData = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<SystemUser[]>(
    []
  );

  const [roles, setRoles] = useState<SystemRole[]>(
    []
  );

  const [pagination, setPagination] =
    useState<PaginationData>(
      EMPTY_PAGINATION
    );

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState<UserRole | "">("");

  const [statusFilter, setStatusFilter] =
    useState<UserStatus | "">("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<SystemUser | null>(null);

  const [roleUser, setRoleUser] =
    useState<SystemUser | null>(null);

  const [statusUser, setStatusUser] =
    useState<SystemUser | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<SystemUser | null>(null);

  const [isStatusUpdating, setIsStatusUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const hasFilters = Boolean(
    search || roleFilter || statusFilter
  );

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit,
      });

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load users."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    limit,
    page,
    roleFilter,
    search,
    statusFilter,
  ]);

 useEffect(() => {
  let isCancelled = false;

  const initializeRoles = async () => {
    try {
      const response = await getRoles();

      if (!isCancelled) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      if (!isCancelled) {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to load roles."
          )
        );
      }
    }
  };

  void initializeRoles();

  return () => {
    isCancelled = true;
  };
}, []);

  useEffect(() => {
  let isCancelled = false;

  const initializeUsers = async () => {
    try {
      const response = await getUsers({
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit,
      });

      if (!isCancelled) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        setErrorMessage("");
      }
    } catch (error) {
      if (!isCancelled) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load users."
          )
        );
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  };

  void initializeUsers();

  return () => {
    isCancelled = true;
  };
}, [
  limit,
  page,
  roleFilter,
  search,
  statusFilter,
]);

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const handleRefresh = async () => {
    await loadUsers();

    toast.success("User list refreshed.");
  };

  const handleStatusConfirm = async () => {
    if (!statusUser) {
      return;
    }

    try {
      setIsStatusUpdating(true);

      const nextStatus: UserStatus =
        statusUser.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      await updateUserStatus(statusUser.id, {
        status: nextStatus,
      });

      toast.success(
        nextStatus === "ACTIVE"
          ? "User activated successfully."
          : "User deactivated successfully."
      );

      setStatusUser(null);

      await loadUsers();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update user status."
        )
      );
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteUser(deleteTarget.id);

      toast.success("User deleted successfully.");

      setDeleteTarget(null);

      if (
        users.length === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      } else {
        await loadUsers();
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete user."
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              User Management
            </h1>

            <p className="mt-2 text-slate-600">
              Create users, assign roles, and control
              account access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiPlus className="text-lg" />
            Create user
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total filtered users
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {pagination.totalItems}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Active on this page
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {
                users.filter(
                  (user) =>
                    user.status === "ACTIVE"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Available roles
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-600">
              {roles.length}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <form
                onSubmit={handleSearchSubmit}
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
                <div className="relative">
                  <FiFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <select
                    value={roleFilter}
                    onChange={(event) => {
                      setRoleFilter(
                        event.target
                          .value as UserRole | ""
                      );

                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
                  >
                    <option value="">
                      All roles
                    </option>

                    <option value="ADMIN">
                      Administrator
                    </option>

                    <option value="PROJECT_MANAGER">
                      Project Manager
                    </option>

                    <option value="TEAM_MEMBER">
                      Team Member
                    </option>
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(
                      event.target
                        .value as UserStatus | ""
                    );

                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    All statuses
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
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
                  <option value={10}>
                    10 per page
                  </option>

                  <option value={20}>
                    20 per page
                  </option>

                  <option value={50}>
                    50 per page
                  </option>
                </select>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <FiRefreshCw />
                  Refresh
                </button>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <FiX />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4 p-6">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                  />
                )
              )}
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="px-6 py-16 text-center">
              <FiUsers className="mx-auto text-5xl text-slate-300" />

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Unable to load users
              </h2>

              <p className="mt-2 text-sm text-red-600">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={loadUsers}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading &&
            !errorMessage &&
            users.length === 0 && (
              <UserEmptyState
                hasFilters={hasFilters}
                onCreateUser={() =>
                  setIsCreateOpen(true)
                }
                onClearFilters={
                  handleClearFilters
                }
              />
            )}

          {!isLoading &&
            !errorMessage &&
            users.length > 0 && (
              <>
                <UserTable
                  users={users}
                  currentUserId={currentUser?.id}
                  onEdit={setEditingUser}
                  onChangeRole={setRoleUser}
                  onToggleStatus={setStatusUser}
                  onDelete={setDeleteTarget}
                />

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
              </>
            )}
        </section>
      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        roles={roles}
        onClose={() =>
          setIsCreateOpen(false)
        }
        onCreated={loadUsers}
      />

      <EditUserModal
        isOpen={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdated={loadUsers}
      />

      <ChangeRoleModal
        isOpen={Boolean(roleUser)}
        user={roleUser}
        roles={roles}
        onClose={() => setRoleUser(null)}
        onUpdated={loadUsers}
      />

      <ConfirmModal
        isOpen={Boolean(statusUser)}
        title={
          statusUser?.status === "ACTIVE"
            ? "Deactivate user"
            : "Activate user"
        }
        message={
          statusUser?.status === "ACTIVE"
            ? `Are you sure you want to deactivate ${statusUser?.name}? They will no longer be able to log in.`
            : `Are you sure you want to activate ${statusUser?.name}? They will regain access to the platform.`
        }
        confirmLabel={
          statusUser?.status === "ACTIVE"
            ? "Deactivate"
            : "Activate"
        }
        tone={
          statusUser?.status === "ACTIVE"
            ? "warning"
            : "warning"
        }
        isSubmitting={isStatusUpdating}
        onClose={() => setStatusUser(null)}
        onConfirm={handleStatusConfirm}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete user"
        message={`Are you sure you want to permanently delete ${deleteTarget?.name}? This action cannot be undone. Users who own projects or tasks may need to be deactivated instead.`}
        confirmLabel="Delete user"
        isSubmitting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </RoleGuard>
  );
}