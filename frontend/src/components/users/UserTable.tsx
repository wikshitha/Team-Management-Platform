"use client";

import {
  FiEdit2,
  FiPower,
  FiRefreshCw,
  FiShield,
  FiTrash2,
} from "react-icons/fi";

import RoleBadge from "@/components/users/RoleBadge";
import UserStatusBadge from "@/components/users/UserStatusBadge";

import { getUserInitials } from "@/utils/userInitials";

import type { SystemUser } from "@/types/user";

interface UserTableProps {
  users: SystemUser[];
  currentUserId?: string;
  onEdit: (user: SystemUser) => void;
  onChangeRole: (user: SystemUser) => void;
  onToggleStatus: (user: SystemUser) => void;
  onDelete: (user: SystemUser) => void;
}

const formatDate = (
  dateValue: string
): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
};

export default function UserTable({
  users,
  currentUserId,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                User
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Joined
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {users.map((user) => {
              const isCurrentUser =
                user.id === currentUserId;

              return (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                        {getUserInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-slate-900">
                            {user.name}
                          </p>

                          {isCurrentUser && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                              You
                            </span>
                          )}
                        </div>

                        <p className="truncate text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <RoleBadge
                      role={user.role.name}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <UserStatusBadge
                      status={user.status}
                    />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Edit user"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onChangeRole(user)
                        }
                        disabled={isCurrentUser}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Change role"
                      >
                        <FiShield />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleStatus(user)
                        }
                        disabled={isCurrentUser}
                        className={[
                          "rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-30",
                          user.status === "ACTIVE"
                            ? "text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                            : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600",
                        ].join(" ")}
                        title={
                          user.status === "ACTIVE"
                            ? "Deactivate user"
                            : "Activate user"
                        }
                      >
                        {user.status === "ACTIVE" ? (
                          <FiPower />
                        ) : (
                          <FiRefreshCw />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(user)
                        }
                        disabled={isCurrentUser}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Delete user"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 lg:hidden">
        {users.map((user) => {
          const isCurrentUser =
            user.id === currentUserId;

          return (
            <article
              key={user.id}
              className="p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {getUserInitials(user.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-slate-900">
                      {user.name}
                    </p>

                    {isCurrentUser && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        You
                      </span>
                    )}
                  </div>

                  <p className="truncate text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <RoleBadge role={user.role.name} />

                <UserStatusBadge
                  status={user.status}
                />
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Joined {formatDate(user.createdAt)}
              </p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-600"
                  aria-label="Edit user"
                >
                  <FiEdit2 />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onChangeRole(user)
                  }
                  disabled={isCurrentUser}
                  className="flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-600 disabled:opacity-30"
                  aria-label="Change user role"
                >
                  <FiShield />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onToggleStatus(user)
                  }
                  disabled={isCurrentUser}
                  className="flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-600 disabled:opacity-30"
                  aria-label="Update user status"
                >
                  <FiPower />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(user)
                  }
                  disabled={isCurrentUser}
                  className="flex items-center justify-center rounded-lg border border-red-200 p-2.5 text-red-600 disabled:opacity-30"
                  aria-label="Delete user"
                >
                  <FiTrash2 />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}