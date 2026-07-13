import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  findAccessibleProject,
  findManageableProject,
} from "../utils/projectAccess.js";

const projectMemberSelect = {
  id: true,
  assignedAt: true,

  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,

      role: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },

      _count: {
        select: {
          assignedTasks: true,
        },
      },

      createdAt: true,
    },
  },
};

export const getProjectMembers = asyncHandler(
  async (req, res) => {
    const { id: projectId } = req.params;

    const project = await findAccessibleProject(
      projectId,
      req.user
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have access to it.",
      });
    }

    const members = await prisma.projectMember.findMany({
      where: {
        projectId,
      },
      select: projectMemberSelect,
      orderBy: {
        assignedAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: members.length,
      data: {
        members,
      },
    });
  }
);

export const addProjectMember = asyncHandler(
  async (req, res) => {
    const { id: projectId } = req.params;
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const project = await findManageableProject(
      projectId,
      req.user
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have permission to manage its members.",
      });
    }

    if (project.status === "ARCHIVED") {
      return res.status(400).json({
        success: false,
        message:
          "Members cannot be added to an archived project.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message:
          "Only active users can be assigned to a project.",
      });
    }

    if (user.role.name !== "TEAM_MEMBER") {
      return res.status(400).json({
        success: false,
        message:
          "Only users with the TEAM_MEMBER role can be added as project members.",
      });
    }

    const existingMembership =
      await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message:
          "This user is already a member of the project.",
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
      select: projectMemberSelect,
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "PROJECT_ASSIGNED",
        message: `You have been assigned to the project "${project.name}".`,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Team Member added to the project successfully.",
      data: {
        member,
      },
    });
  }
);

export const removeProjectMember = asyncHandler(
  async (req, res) => {
    const { id: projectId, userId } = req.params;

    const project = await findManageableProject(
      projectId,
      req.user
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have permission to manage its members.",
      });
    }

    const membership =
      await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "This user is not a member of the project.",
      });
    }

    const assignedTaskCount = await prisma.task.count({
      where: {
        projectId,
        assignedToId: userId,
      },
    });

    await prisma.$transaction([
      prisma.task.updateMany({
        where: {
          projectId,
          assignedToId: userId,
        },
        data: {
          assignedToId: null,
        },
      }),

      prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message:
        assignedTaskCount > 0
          ? `Team Member removed successfully. ${assignedTaskCount} assigned task(s) were unassigned.`
          : "Team Member removed successfully.",
    });
  }
);