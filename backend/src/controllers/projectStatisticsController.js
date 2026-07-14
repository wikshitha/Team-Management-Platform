import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import { findAccessibleProject } from "../utils/projectAccess.js";

const createTaskStatusMap = (groupedData) => {
  const result = {
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    COMPLETED: 0,
  };

  for (const item of groupedData) {
    result[item.status] = item._count._all;
  }

  return result;
};

const createPriorityMap = (groupedData) => {
  const result = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0,
  };

  for (const item of groupedData) {
    result[item.priority] = item._count._all;
  }

  return result;
};

export const getProjectStatistics = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const project = await findAccessibleProject(
      id,
      req.user
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have access to it.",
      });
    }

    const now = new Date();

    const [
      totalMembers,
      totalTasks,
      completedTasks,
      overdueTasks,
      unassignedTasks,
      tasksByStatusData,
      tasksByPriorityData,
      memberWorkload,
    ] = await Promise.all([
      prisma.projectMember.count({
        where: {
          projectId: id,
        },
      }),

      prisma.task.count({
        where: {
          projectId: id,
        },
      }),

      prisma.task.count({
        where: {
          projectId: id,
          status: "COMPLETED",
        },
      }),

      prisma.task.count({
        where: {
          projectId: id,
          dueDate: {
            lt: now,
          },
          status: {
            not: "COMPLETED",
          },
        },
      }),

      prisma.task.count({
        where: {
          projectId: id,
          assignedToId: null,
        },
      }),

      prisma.task.groupBy({
        by: ["status"],
        where: {
          projectId: id,
        },
        _count: {
          _all: true,
        },
      }),

      prisma.task.groupBy({
        by: ["priority"],
        where: {
          projectId: id,
        },
        _count: {
          _all: true,
        },
      }),

      prisma.projectMember.findMany({
        where: {
          projectId: id,
        },
        orderBy: {
          assignedAt: "asc",
        },
        select: {
          id: true,
          assignedAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,

              assignedTasks: {
                where: {
                  projectId: id,
                },
                select: {
                  id: true,
                  status: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    const workload = memberWorkload.map((membership) => {
      const tasks = membership.user.assignedTasks;

      const completed = tasks.filter(
        (task) => task.status === "COMPLETED"
      ).length;

      return {
        member: {
          id: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
        },
        assignedAt: membership.assignedAt,
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: tasks.length - completed,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        project: {
          id: project.id,
          name: project.name,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          dueDate: project.dueDate,
        },

        summary: {
          totalMembers,
          totalTasks,
          completedTasks,
          pendingTasks: totalTasks - completedTasks,
          overdueTasks,
          unassignedTasks,
          completionPercentage,
        },

        charts: {
          tasksByStatus:
            createTaskStatusMap(tasksByStatusData),

          tasksByPriority:
            createPriorityMap(tasksByPriorityData),
        },

        memberWorkload: workload,
      },
    });
  }
);