import prisma from "../config/prisma.js";

/**
 * Checks whether the logged-in user can view a task.
 */
export const findAccessibleTask = async (taskId, user) => {
  if (user.role.name === "ADMIN") {
    return prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });
  }

  if (user.role.name === "PROJECT_MANAGER") {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          createdById: user.id,
        },
      },
      include: {
        project: true,
      },
    });
  }

  if (user.role.name === "TEAM_MEMBER") {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        assignedToId: user.id,
      },
      include: {
        project: true,
      },
    });
  }

  return null;
};

/**
 * Checks whether a user can manage a task.
 *
 * Admin can manage all tasks.
 * Project Manager can manage tasks in projects they created.
 */
export const findManageableTask = async (taskId, user) => {
  if (user.role.name === "ADMIN") {
    return prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: true,
      },
    });
  }

  if (user.role.name === "PROJECT_MANAGER") {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          createdById: user.id,
        },
      },
      include: {
        project: true,
      },
    });
  }

  return null;
};

/**
 * Checks whether a Team Member is valid for task assignment.
 */
export const validateTaskAssignee = async (
  projectId,
  assignedToId
) => {
  if (!assignedToId) {
    return {
      valid: true,
      user: null,
      message: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: assignedToId,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    return {
      valid: false,
      user: null,
      message: "The selected Team Member does not exist.",
    };
  }

  if (user.status !== "ACTIVE") {
    return {
      valid: false,
      user: null,
      message: "The selected Team Member is inactive.",
    };
  }

  if (user.role.name !== "TEAM_MEMBER") {
    return {
      valid: false,
      user: null,
      message:
        "Tasks can only be assigned to users with the TEAM_MEMBER role.",
    };
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: assignedToId,
      },
    },
  });

  if (!membership) {
    return {
      valid: false,
      user: null,
      message:
        "The selected Team Member must belong to the project before receiving tasks.",
    };
  }

  return {
    valid: true,
    user,
    message: null,
  };
};