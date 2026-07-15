"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  FiBell,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";

import NotificationCard from "@/components/notifications/NotificationCard";
import NotificationEmptyState from "@/components/notifications/NotificationEmptyState";
import Pagination from "@/components/ui/Pagination";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notificationService";

import { getApiErrorMessage } from "@/utils/apiError";

import type { Notification } from "@/types/notification";
import type { PaginationData } from "@/types/user";

const EMPTY_PAGINATION: PaginationData = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [pagination, setPagination] =
    useState<PaginationData>(
      EMPTY_PAGINATION
    );

  const [filter, setFilter] = useState<
    "ALL" | "UNREAD"
  >("ALL");

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    updatingNotificationId,
    setUpdatingNotificationId,
  ] = useState<string | null>(null);

  const [isMarkingAll, setIsMarkingAll] =
    useState(false);

  const loadNotifications =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getNotifications({
          isRead:
            filter === "UNREAD"
              ? false
              : "",
          page,
          limit: 10,
        });

        setNotifications(
          response.data.notifications
        );

        setPagination(
          response.data.pagination
        );
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load notifications."
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, [filter, page]);

  useEffect(() => {
    let isCancelled = false;

    const initializeNotifications =
      async () => {
        try {
          const response =
            await getNotifications({
              isRead:
                filter === "UNREAD"
                  ? false
                  : "",
              page,
              limit: 10,
            });

          if (!isCancelled) {
            setNotifications(
              response.data.notifications
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
                "Unable to load notifications."
              )
            );
          }
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      };

    void initializeNotifications();

    return () => {
      isCancelled = true;
    };
  }, [filter, page]);

  const handleMarkAsRead = async (
    notification: Notification
  ) => {
    try {
      setUpdatingNotificationId(
        notification.id
      );

      await markNotificationAsRead(
        notification.id
      );

      toast.success(
        "Notification marked as read."
      );

      if (filter === "UNREAD") {
        setNotifications((current) =>
          current.filter(
            (item) =>
              item.id !== notification.id
          )
        );
      } else {
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );
      }

      window.dispatchEvent(
        new Event("notifications-updated")
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update notification."
        )
      );
    } finally {
      setUpdatingNotificationId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAll(true);

      await markAllNotificationsAsRead();

      toast.success(
        "All notifications marked as read."
      );

      setNotifications((current) =>
        filter === "UNREAD"
          ? []
          : current.map((notification) => ({
              ...notification,
              isRead: true,
            }))
      );

      window.dispatchEvent(
        new Event("notifications-updated")
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to mark all notifications as read."
        )
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="mt-2 text-slate-600">
            Review project assignments, task
            updates, and comment activity.
          </p>
        </div>

        <button
          type="button"
          disabled={
            isMarkingAll ||
            unreadCount === 0
          }
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiCheckCircle />

          {isMarkingAll
            ? "Updating..."
            : "Mark all as read"}
        </button>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFilter("ALL");
                setPage(1);
              }}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                filter === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => {
                setFilter("UNREAD");
                setPage(1);
              }}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                filter === "UNREAD"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              Unread
            </button>
          </div>

          <button
            type="button"
            onClick={loadNotifications}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-xl bg-slate-100"
                />
              )
            )}
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="px-6 py-16 text-center">
            <FiBell className="mx-auto text-5xl text-slate-300" />

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Unable to load notifications
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadNotifications}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          notifications.length === 0 && (
            <NotificationEmptyState
              unreadOnly={
                filter === "UNREAD"
              }
            />
          )}

        {!isLoading &&
          !errorMessage &&
          notifications.length > 0 && (
            <>
              <div>
                {notifications.map(
                  (notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      isUpdating={
                        updatingNotificationId ===
                        notification.id
                      }
                      onMarkAsRead={
                        handleMarkAsRead
                      }
                    />
                  )
                )}
              </div>

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
  );
}