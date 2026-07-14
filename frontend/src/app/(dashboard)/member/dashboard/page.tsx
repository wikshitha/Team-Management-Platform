"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  FiActivity,
  FiBell,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardError from "@/components/dashboard/DashboardError";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import PriorityBadge from "@/components/dashboard/PriorityBadge";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import TaskPriorityChart from "@/components/dashboard/TaskPriorityChart";
import TaskStatusChart from "@/components/dashboard/TaskStatusChart";

import { getMemberDashboard } from "@/services/dashboardService";
import { getApiErrorMessage } from "@/utils/apiError";

import type { MemberDashboardResponse } from "@/types/dashboard";

const formatDate = (dateValue: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
};

const formatDateTime = (dateValue: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

export default function MemberDashboardPage() {
  const [dashboard, setDashboard] =
    useState<MemberDashboardResponse["data"] | null>(
      null
    );

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getMemberDashboard();

      setDashboard(response.data);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load your dashboard."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <RoleGuard allowedRoles={["TEAM_MEMBER"]}>
      {isLoading && <DashboardSkeleton />}

      {!isLoading && errorMessage && (
        <DashboardError
          message={errorMessage}
          onRetry={loadDashboard}
        />
      )}

      {!isLoading && dashboard && (
        <div className="space-y-8">
          <header>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Team Member
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              View your assigned tasks, upcoming deadlines,
              and notifications.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Active Tasks"
              value={dashboard.summary.activeTasks}
              description="Tasks still requiring action"
              icon={FiActivity}
              tone="blue"
            />

            <StatCard
              title="Completed Today"
              value={dashboard.summary.completedToday}
              description="Tasks you finished today"
              icon={FiCheckCircle}
              tone="green"
            />

            <StatCard
              title="Overdue Tasks"
              value={dashboard.summary.overdueTasks}
              description="Tasks past their due dates"
              icon={FiClock}
              tone="red"
            />

            <StatCard
              title="Unread Notifications"
              value={
                dashboard.summary.unreadNotifications
              }
              description="New project and task updates"
              icon={FiBell}
              tone="purple"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Task Status Distribution"
              description="Status breakdown of your assigned tasks"
            >
              <TaskStatusChart
                data={dashboard.charts.tasksByStatus}
              />
            </DashboardCard>

            <DashboardCard
              title="Priority Breakdown"
              description="Your tasks grouped by priority"
            >
              <TaskPriorityChart
                data={dashboard.charts.tasksByPriority}
              />
            </DashboardCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Upcoming Tasks"
              description="Your nearest incomplete task deadlines"
              action={
                <Link
                  href="/member/tasks"
                  className="text-sm font-semibold text-blue-600"
                >
                  View all
                </Link>
              }
            >
              <div className="space-y-3">
                {dashboard.upcomingTasks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No upcoming task deadlines.
                  </p>
                ) : (
                  dashboard.upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {task.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {task.project.name}
                          </p>
                        </div>

                        <PriorityBadge
                          value={task.priority}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <StatusBadge
                          value={task.status}
                        />

                        <p className="text-xs font-medium text-slate-500">
                          Due{" "}
                          {task.dueDate
                            ? formatDate(task.dueDate)
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Notifications"
              description="Your latest project and task updates"
              action={
                <Link
                  href="/notifications"
                  className="text-sm font-semibold text-blue-600"
                >
                  View all
                </Link>
              }
            >
              <div className="space-y-3">
                {dashboard.recentNotifications.length ===
                0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    You have no notifications.
                  </p>
                ) : (
                  dashboard.recentNotifications.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        className={[
                          "flex gap-3 rounded-xl border p-4",
                          notification.isRead
                            ? "border-slate-100 bg-white"
                            : "border-blue-100 bg-blue-50/50",
                        ].join(" ")}
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <FiBell />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm text-slate-700">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatDateTime(
                              notification.createdAt
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </DashboardCard>
          </section>
        </div>
      )}
    </RoleGuard>
  );
}