import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

const formatGroupedCounts = (
  groupedData,
  allowedValues
) => {
  const result = {};

  for (const value of allowedValues) {
    result[value] = 0;
  }

  for (const item of groupedData) {
    result[item.status] = item._count._all;
  }

  return result;
};

export const getAdminDashboard = asyncHandler(
  async (req, res) => {
    const now = new Date();

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalProjects,
      activeProjects,
      completedProjects,
      archivedProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      usersByRole,
      projectsByStatusData,
      tasksByStatusData,
      recentProjects,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          status: "INACTIVE",
        },
      }),

      prisma.project.count(),

      prisma.project.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.project.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.project.count({
        where: {
          status: "ARCHIVED",
        },
      }),

      prisma.task.count(),

      prisma.task.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.task.count({
        where: {
          dueDate: {
            lt: now,
          },
          status: {
            not: "COMPLETED",
          },
        },
      }),

      prisma.role.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),

      prisma.project.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),

      prisma.task.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),

      prisma.project.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          createdAt: true,

          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,

          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const pendingTasks = totalTasks - completedTasks;

    const taskCompletionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          totalProjects,
          activeProjects,
          completedProjects,
          archivedProjects,
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          taskCompletionPercentage,
        },

        charts: {
          usersByRole: usersByRole.map((role) => ({
            role: role.name,
            count: role._count.users,
          })),

          projectsByStatus: formatGroupedCounts(
            projectsByStatusData,
            [
              "PLANNING",
              "ACTIVE",
              "ON_HOLD",
              "COMPLETED",
              "ARCHIVED",
            ]
          ),

          tasksByStatus: formatGroupedCounts(
            tasksByStatusData,
            [
              "TODO",
              "IN_PROGRESS",
              "IN_REVIEW",
              "COMPLETED",
            ]
          ),
        },

        recentProjects,
        recentUsers,
      },
    });
  }
);

export const getManagerDashboard = asyncHandler(
  async (req, res) => {
    const managerId = req.user.id;
    const now = new Date();

    const projectWhere = {
      createdById: managerId,
    };

    const taskWhere = {
      project: {
        createdById: managerId,
      },
    };

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      archivedProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      uniqueMembers,
      projectsByStatusData,
      tasksByStatusData,
      recentProjects,
      recentTasks,
    ] = await Promise.all([
      prisma.project.count({
        where: projectWhere,
      }),

      prisma.project.count({
        where: {
          ...projectWhere,
          status: "ACTIVE",
        },
      }),

      prisma.project.count({
        where: {
          ...projectWhere,
          status: "COMPLETED",
        },
      }),

      prisma.project.count({
        where: {
          ...projectWhere,
          status: "ARCHIVED",
        },
      }),

      prisma.task.count({
        where: taskWhere,
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          status: "COMPLETED",
        },
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          status: "IN_PROGRESS",
        },
      }),

      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: {
            lt: now,
          },
          status: {
            not: "COMPLETED",
          },
        },
      }),

      prisma.projectMember.findMany({
        where: {
          project: {
            createdById: managerId,
          },
        },
        distinct: ["userId"],
        select: {
          userId: true,
        },
      }),

      prisma.project.groupBy({
        by: ["status"],
        where: projectWhere,
        _count: {
          _all: true,
        },
      }),

      prisma.task.groupBy({
        by: ["status"],
        where: taskWhere,
        _count: {
          _all: true,
        },
      }),

      prisma.project.findMany({
        where: projectWhere,
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          dueDate: true,

          _count: {
            select: {
              members: true,
              tasks: true,
            },
          },
        },
      }),

      prisma.task.findMany({
        where: taskWhere,
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,

          project: {
            select: {
              id: true,
              name: true,
            },
          },

          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const taskCompletionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProjects,
          activeProjects,
          completedProjects,
          archivedProjects,
          totalTeamMembers: uniqueMembers.length,
          totalTasks,
          completedTasks,
          inProgressTasks,
          overdueTasks,
          taskCompletionPercentage,
        },

        charts: {
          projectsByStatus: formatGroupedCounts(
            projectsByStatusData,
            [
              "PLANNING",
              "ACTIVE",
              "ON_HOLD",
              "COMPLETED",
              "ARCHIVED",
            ]
          ),

          tasksByStatus: formatGroupedCounts(
            tasksByStatusData,
            [
              "TODO",
              "IN_PROGRESS",
              "IN_REVIEW",
              "COMPLETED",
            ]
          ),
        },

        recentProjects,
        recentTasks,
      },
    });
  }
);

export const getMemberDashboard = asyncHandler(
  async (req, res) => {
    const memberId = req.user.id;
    const now = new Date();

    const [
      assignedProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      completedTasks,
      overdueTasks,
      unreadNotifications,
      tasksByStatusData,
      upcomingTasks,
      recentNotifications,
    ] = await Promise.all([
      prisma.projectMember.count({
        where: {
          userId: memberId,
        },
      }),

      prisma.task.count({
        where: {
          assignedToId: memberId,
        },
      }),

      prisma.task.count({
        where: {
          assignedToId: memberId,
          status: "TODO",
        },
      }),

      prisma.task.count({
        where: {
          assignedToId: memberId,
          status: "IN_PROGRESS",
        },
      }),

      prisma.task.count({
        where: {
          assignedToId: memberId,
          status: "IN_REVIEW",
        },
      }),

      prisma.task.count({
        where: {
          assignedToId: memberId,
          status: "COMPLETED",
        },
      }),

      prisma.task.count({
        where: {
          assignedToId: memberId,
          dueDate: {
            lt: now,
          },
          status: {
            not: "COMPLETED",
          },
        },
      }),

      prisma.notification.count({
        where: {
          userId: memberId,
          isRead: false,
        },
      }),

      prisma.task.groupBy({
        by: ["status"],
        where: {
          assignedToId: memberId,
        },
        _count: {
          _all: true,
        },
      }),

      prisma.task.findMany({
        where: {
          assignedToId: memberId,
          status: {
            not: "COMPLETED",
          },
          dueDate: {
            not: null,
          },
        },
        take: 5,
        orderBy: {
          dueDate: "asc",
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,

          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.notification.findMany({
        where: {
          userId: memberId,
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          message: true,
          type: true,
          isRead: true,
          createdAt: true,
        },
      }),
    ]);

    const taskCompletionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          assignedProjects,
          totalTasks,
          todoTasks,
          inProgressTasks,
          inReviewTasks,
          completedTasks,
          overdueTasks,
          unreadNotifications,
          taskCompletionPercentage,
        },

        charts: {
          tasksByStatus: formatGroupedCounts(
            tasksByStatusData,
            [
              "TODO",
              "IN_PROGRESS",
              "IN_REVIEW",
              "COMPLETED",
            ]
          ),
        },

        upcomingTasks,
        recentNotifications,
      },
    });
  }
);