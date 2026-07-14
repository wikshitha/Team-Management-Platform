import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPaginationValues } from "../utils/validators.js";
import { findManageableProject } from "../utils/projectAccess.js";

const teamMemberSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  status: true,

  role: {
    select: {
      id: true,
      name: true,
    },
  },

  createdAt: true,
};

/**
 * Return all active users with the TEAM_MEMBER role.
 *
 * Admin and Project Manager can use this endpoint to browse
 * Team Members without manually entering database IDs.
 */
export const getTeamMembers = asyncHandler(async (req, res) => {
  const {
    search = "",
    page: pageValue = "1",
    limit: limitValue = "10",
  } = req.query;

  const { page, limit, skip } = getPaginationValues(
    pageValue,
    limitValue
  );

  const where = {
    status: "ACTIVE",
    role: {
      name: "TEAM_MEMBER",
    },
  };

  if (typeof search === "string" && search.trim()) {
    const normalizedSearch = search.trim();

    where.OR = [
      {
        name: {
          contains: normalizedSearch,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: normalizedSearch,
          mode: "insensitive",
        },
      },
    ];
  }

  const [members, totalMembers] = await Promise.all([
    prisma.user.findMany({
      where,
      select: teamMemberSelect,
      orderBy: {
        name: "asc",
      },
      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalMembers / limit);

  return res.status(200).json({
    success: true,
    data: {
      members,
      pagination: {
        page,
        limit,
        totalItems: totalMembers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

/**
 * Return active Team Members who have not yet been assigned
 * to the selected project.
 */
export const getAvailableProjectMembers = asyncHandler(
  async (req, res) => {
    const { projectId } = req.params;

    const {
      search = "",
      page: pageValue = "1",
      limit: limitValue = "10",
    } = req.query;

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

    const { page, limit, skip } = getPaginationValues(
      pageValue,
      limitValue
    );

    const where = {
      status: "ACTIVE",

      role: {
        name: "TEAM_MEMBER",
      },

      projectMembers: {
        none: {
          projectId,
        },
      },
    };

    if (typeof search === "string" && search.trim()) {
      const normalizedSearch = search.trim();

      where.OR = [
        {
          name: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
      ];
    }

    const [members, totalMembers] = await Promise.all([
      prisma.user.findMany({
        where,
        select: teamMemberSelect,
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalMembers / limit);

    return res.status(200).json({
      success: true,
      data: {
        members,
        pagination: {
          page,
          limit,
          totalItems: totalMembers,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  }
);