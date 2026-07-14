import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

const PROJECT_STATUSES = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
];

const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
];

const TASK_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const formatGroupedCounts = (
  groupedData,
  allowedValues,
  groupField
) => {
  const result = {};

  for (const value of allowedValues) {
    result[value] = 0;
  }

  for (const item of groupedData) {
    const key = item[groupField];

    if (key && Object.hasOwn(result, key)) {
      result[key] = item._count._all;
    }
  }

  return result;
};

const formatStatusCounts = (groupedData, allowedValues) => {
  return formatGroupedCounts(
    groupedData,
    allowedValues,
    "status"
  );
};

const formatPriorityCounts = (groupedData) => {
  return formatGroupedCounts(
    groupedData,
    TASK_PRIORITIES,
    "priority"
  );
};

const getTodayRange = () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(
    startOfTomorrow.getDate() + 1
  );

  return {
    startOfToday,
    startOfTomorrow,
  };
};

const calculateCompletionPercentage = (
  completedTasks,
  totalTasks
) => {
  if (totalTasks === 0) {
    return 0;
  }

  return Math.round(
    (completedTasks / totalTasks) * 100
  );
};

/**
 * GET /api/dashboard/admin
 *
 * Returns system-wide dashboard statistics for Administrators.
 */
export const getAdminDashboard = asyncHandler(
  async (req, res) => {
    const now = new Date();

    const {
      startOfToday,
      startOfTomorrow,
    } = getTodayRange();

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      completedToday,
      overdueTasks,
      usersByRole,
      projectsByStatusData,
      tasksByStatusData,
      tasksByPriorityData,
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

      prisma.task.count(),

      prisma.task.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.task.count({
        where: {
          status: "COMPLETED",
          completedAt: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
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

      prisma.task.groupBy({
        by: ["priority"],
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

    const activeTasks =
      totalTasks - completedTasks;

    const pendingTasks = activeTasks;

    const taskCompletionPercentage =
      calculateCompletionPercentage(
        completedTasks,
        totalTasks
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

          totalTasks,
          activeTasks,
          completedTasks,
          completedToday,
          pendingTasks,
          overdueTasks,
          taskCompletionPercentage,
        },

        charts: {
          usersByRole: usersByRole.map(
            (role) => ({
              role: role.name,
              count: role._count.users,
            })
          ),

          projectsByStatus:
            formatStatusCounts(
              projectsByStatusData,
              PROJECT_STATUSES
            ),

          tasksByStatus:
            formatStatusCounts(
              tasksByStatusData,
              TASK_STATUSES
            ),

          tasksByPriority:
            formatPriorityCounts(
              tasksByPriorityData
            ),
        },

        recentProjects,
        recentUsers,
      },
    });
  }
);

/**
 * GET /api/dashboard/manager
 *
 * Returns statistics only for projects created by
 * the logged-in Project Manager.
 */
export const getManagerDashboard = asyncHandler(
  async (req, res) => {
    const managerId = req.user.id;
    const now = new Date();

    const {
      startOfToday,
      startOfTomorrow,
    } = getTodayRange();

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
      totalTasks,
      completedTasks,
      completedToday,
      inProgressTasks,
      overdueTasks,
      uniqueMembers,
      projectsByStatusData,
      tasksByStatusData,
      tasksByPriorityData,
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
          status: "COMPLETED",
          completedAt: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
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

      prisma.task.groupBy({
        by: ["priority"],
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

    const activeTasks =
      totalTasks - completedTasks;

    const taskCompletionPercentage =
      calculateCompletionPercentage(
        completedTasks,
        totalTasks
      );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProjects,
          activeProjects,
          completedProjects,

          totalTeamMembers:
            uniqueMembers.length,

          totalTasks,
          activeTasks,
          completedTasks,
          completedToday,
          inProgressTasks,
          overdueTasks,
          taskCompletionPercentage,
        },

        charts: {
          projectsByStatus:
            formatStatusCounts(
              projectsByStatusData,
              PROJECT_STATUSES
            ),

          tasksByStatus:
            formatStatusCounts(
              tasksByStatusData,
              TASK_STATUSES
            ),

          tasksByPriority:
            formatPriorityCounts(
              tasksByPriorityData
            ),
        },

        recentProjects,
        recentTasks,
      },
    });
  }
);

/**
 * GET /api/dashboard/member
 *
 * Returns statistics only for tasks assigned to
 * the logged-in Team Member.
 */
export const getMemberDashboard = asyncHandler(
  async (req, res) => {
    const memberId = req.user.id;
    const now = new Date();

    const {
      startOfToday,
      startOfTomorrow,
    } = getTodayRange();

    const [
      assignedProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      completedTasks,
      completedToday,
      overdueTasks,
      unreadNotifications,
      tasksByStatusData,
      tasksByPriorityData,
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
          status: "COMPLETED",
          completedAt: {
            gte: startOfToday,
            lt: startOfTomorrow,
          },
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

      prisma.task.groupBy({
        by: ["priority"],
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
            gte: now,
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

    const activeTasks =
      totalTasks - completedTasks;

    const taskCompletionPercentage =
      calculateCompletionPercentage(
        completedTasks,
        totalTasks
      );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          assignedProjects,

          totalTasks,
          activeTasks,
          todoTasks,
          inProgressTasks,
          inReviewTasks,
          completedTasks,
          completedToday,
          overdueTasks,

          unreadNotifications,
          taskCompletionPercentage,
        },

        charts: {
          tasksByStatus:
            formatStatusCounts(
              tasksByStatusData,
              TASK_STATUSES
            ),

          tasksByPriority:
            formatPriorityCounts(
              tasksByPriorityData
            ),
        },

        upcomingTasks,
        recentNotifications,
      },
    });
  }
);