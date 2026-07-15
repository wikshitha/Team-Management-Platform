"use client";

import { FiCheck } from "react-icons/fi";

import NotificationIcon from "@/components/notifications/NotificationIcon";

import type { Notification } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  isUpdating: boolean;
  onMarkAsRead: (
    notification: Notification
  ) => void;
}

const formatDateTime = (
  dateValue: string
): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

const getNotificationLabel = (
  type: Notification["type"]
): string => {
  const labels: Record<
    Notification["type"],
    string
  > = {
    PROJECT_ASSIGNED: "Project assignment",
    TASK_ASSIGNED: "Task assignment",
    TASK_UPDATED: "Task update",
    TASK_COMMENT: "Task comment",
    SYSTEM: "System",
  };

  return labels[type];
};

export default function NotificationCard({
  notification,
  isUpdating,
  onMarkAsRead,
}: NotificationCardProps) {
  return (
    <article
      className={[
        "flex gap-4 border-b border-slate-100 p-5 transition last:border-b-0",
        notification.isRead
          ? "bg-white"
          : "bg-blue-50/50",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          notification.isRead
            ? "bg-slate-100 text-slate-500"
            : "bg-blue-100 text-blue-600",
        ].join(" ")}
      >
        <NotificationIcon
          type={notification.type}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {getNotificationLabel(
                  notification.type
                )}
              </p>

              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {notification.message}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {formatDateTime(
                notification.createdAt
              )}
            </p>
          </div>

          {!notification.isRead && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onMarkAsRead(notification)
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-60"
            >
              <FiCheck />

              {isUpdating
                ? "Updating..."
                : "Mark as read"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}