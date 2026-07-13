import prisma from "../config/prisma.js";

/**
 * Finds a project and checks whether the logged-in user
 * is allowed to view it.
 */
export const findAccessibleProject = async (projectId, user) => {
  if (user.role.name === "ADMIN") {
    return prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
  }

  if (user.role.name === "PROJECT_MANAGER") {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        createdById: user.id,
      },
    });
  }

  if (user.role.name === "TEAM_MEMBER") {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  }

  return null;
};

/**
 * Checks whether the user is allowed to manage a project.
 *
 * ADMIN can manage every project.
 * PROJECT_MANAGER can manage only projects they created.
 */
export const findManageableProject = async (projectId, user) => {
  if (user.role.name === "ADMIN") {
    return prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
  }

  if (user.role.name === "PROJECT_MANAGER") {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        createdById: user.id,
      },
    });
  }

  return null;
};