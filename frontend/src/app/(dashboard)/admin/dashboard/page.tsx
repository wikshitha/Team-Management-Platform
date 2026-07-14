"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiUsers,
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

import { getAdminDashboard } from "@/services/dashboardService";
import { getApiErrorMessage } from "@/utils/apiError";

import type { AdminDashboardResponse } from "@/types/dashboard";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] =
    useState<AdminDashboardResponse["data"] | null>(
      null
    );

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getAdminDashboard();

      setDashboard(response.data);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the Administrator dashboard."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
  let isCancelled = false;

  const initializeDashboard = async () => {
    try {
      const response = await getAdminDashboard();

      if (!isCancelled) {
        setDashboard(response.data);
      }
    } catch (error) {
      if (!isCancelled) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load the Administrator dashboard."
          )
        );
      }
    } finally {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  };

  void initializeDashboard();

  return () => {
    isCancelled = true;
  };
}, []);

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
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
              Administrator
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              Monitor users, projects, tasks, and overall
              system performance.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Active Tasks"
              value={dashboard.summary.activeTasks}
              description="Tasks not yet completed"
              icon={FiActivity}
              tone="blue"
            />

            <StatCard
              title="Completed Today"
              value={dashboard.summary.completedToday}
              description="Tasks finished today"
              icon={FiCheckCircle}
              tone="green"
            />

            <StatCard
              title="Overdue Tasks"
              value={dashboard.summary.overdueTasks}
              description="Past their due date"
              icon={FiClock}
              tone="red"
            />

            <StatCard
              title="Active Users"
              value={dashboard.summary.activeUsers}
              description={`${dashboard.summary.totalUsers} total users`}
              icon={FiUsers}
              tone="purple"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Task Status Distribution"
              description="Current breakdown of tasks by workflow status"
            >
              <TaskStatusChart
                data={dashboard.charts.tasksByStatus}
              />
            </DashboardCard>

            <DashboardCard
              title="Priority Breakdown"
              description="Tasks grouped by priority level"
            >
              <TaskPriorityChart
                data={dashboard.charts.tasksByPriority}
              />
            </DashboardCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Recent Projects"
              description="Most recently created projects"
              action={
                <Link
                  href="/admin/projects"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              }
            >
              <div className="space-y-3">
                {dashboard.recentProjects.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No projects have been created.
                  </p>
                ) : (
                  dashboard.recentProjects.map(
                    (project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FiFolder />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {project.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {project.createdBy?.name ||
                                "Unknown creator"}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <PriorityBadge
                            value={project.priority}
                          />

                          <StatusBadge
                            value={project.status}
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Users"
              description="Recently added system users"
              action={
                <Link
                  href="/admin/users"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              }
            >
              <div className="space-y-3">
                {dashboard.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                        {user.name
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <StatusBadge value={user.status} />
                  </div>
                ))}
              </div>
            </DashboardCard>
          </section>
        </div>
      )}
    </RoleGuard>
  );
}