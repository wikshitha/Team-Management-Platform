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

import { getManagerDashboard } from "@/services/dashboardService";
import { getApiErrorMessage } from "@/utils/apiError";

import type { ManagerDashboardResponse } from "@/types/dashboard";

export default function ManagerDashboardPage() {
  const [dashboard, setDashboard] =
    useState<ManagerDashboardResponse["data"] | null>(
      null
    );

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getManagerDashboard();

      setDashboard(response.data);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Unable to load the Project Manager dashboard."
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
      const response = await getManagerDashboard();

      if (!isCancelled) {
        setDashboard(response.data);
      }
    } catch (error) {
      if (!isCancelled) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load the Project Manager dashboard."
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
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
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
              Project Manager
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              Monitor your projects, Team Members, and
              task progress.
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
              description="Tasks completed today"
              icon={FiCheckCircle}
              tone="green"
            />

            <StatCard
              title="Overdue Tasks"
              value={dashboard.summary.overdueTasks}
              description="Tasks past their due date"
              icon={FiClock}
              tone="red"
            />

            <StatCard
              title="Team Members"
              value={dashboard.summary.totalTeamMembers}
              description={`${dashboard.summary.totalProjects} managed projects`}
              icon={FiUsers}
              tone="purple"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Task Status Distribution"
              description="Status breakdown across your projects"
            >
              <TaskStatusChart
                data={dashboard.charts.tasksByStatus}
              />
            </DashboardCard>

            <DashboardCard
              title="Priority Breakdown"
              description="Task distribution by priority"
            >
              <TaskPriorityChart
                data={dashboard.charts.tasksByPriority}
              />
            </DashboardCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Recent Projects"
              description="Your newest projects"
              action={
                <Link
                  href="/manager/projects"
                  className="text-sm font-semibold text-blue-600"
                >
                  View all
                </Link>
              }
            >
              <div className="space-y-3">
                {dashboard.recentProjects.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    You have not created any projects.
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

                            <p className="text-xs text-slate-500">
                              {project._count?.members || 0} members ·{" "}
                              {project._count?.tasks || 0} tasks
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          value={project.status}
                        />
                      </div>
                    )
                  )
                )}
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Tasks"
              description="Recently created project tasks"
              action={
                <Link
                  href="/manager/tasks"
                  className="text-sm font-semibold text-blue-600"
                >
                  View all
                </Link>
              }
            >
              <div className="space-y-3">
                {dashboard.recentTasks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No tasks have been created.
                  </p>
                ) : (
                  dashboard.recentTasks.map((task) => (
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

                      <div className="mt-3 flex items-center justify-between">
                        <StatusBadge
                          value={task.status}
                        />

                        <p className="text-xs text-slate-500">
                          {task.assignedTo?.name ||
                            "Unassigned"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DashboardCard>
          </section>
        </div>
      )}
    </RoleGuard>
  );
}