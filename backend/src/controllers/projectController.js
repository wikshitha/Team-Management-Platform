import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getPaginationValues,
  isValidPriority,
  isValidProjectStatus,
  parseOptionalDate,
} from "../utils/validators.js";
import {
  findAccessibleProject,
  findManageableProject,
} from "../utils/projectAccess.js";

const projectListSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  priority: true,
  startDate: true,
  dueDate: true,
  createdById: true,

  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  _count: {
    select: {
      members: true,
      tasks: true,
    },
  },

  createdAt: true,
  updatedAt: true,
};

const validateDateRange = (startDate, dueDate) => {
  if (startDate && dueDate && startDate > dueDate) {
    return false;
  }

  return true;
};

export const createProject = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    status = "PLANNING",
    priority = "MEDIUM",
    startDate,
    dueDate,
  } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      success: false,
      message: "Project name is required.",
    });
  }

  const normalizedName = name.trim().replace(/\s+/g, " ");

  if (normalizedName.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Project name must contain at least 3 characters.",
    });
  }

  if (normalizedName.length > 150) {
    return res.status(400).json({
      success: false,
      message: "Project name cannot exceed 150 characters.",
    });
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Project description must be a string.",
    });
  }

  const normalizedStatus = String(status).trim().toUpperCase();
  const normalizedPriority = String(priority).trim().toUpperCase();

  if (!isValidProjectStatus(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message:
        "Status must be PLANNING, ACTIVE, ON_HOLD or COMPLETED",
    });
  }

  if (!isValidPriority(normalizedPriority)) {
    return res.status(400).json({
      success: false,
      message:
        "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
    });
  }

  const parsedStartDate = parseOptionalDate(startDate);
  const parsedDueDate = parseOptionalDate(dueDate);

  if (!parsedStartDate.valid) {
    return res.status(400).json({
      success: false,
      message: "Start date is invalid.",
    });
  }

  if (!parsedDueDate.valid) {
    return res.status(400).json({
      success: false,
      message: "Due date is invalid.",
    });
  }

  if (
    !validateDateRange(
      parsedStartDate.value,
      parsedDueDate.value
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Due date must be on or after the start date.",
    });
  }

  const project = await prisma.project.create({
    data: {
      name: normalizedName,
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      status: normalizedStatus,
      priority: normalizedPriority,
      startDate: parsedStartDate.value,
      dueDate: parsedDueDate.value,
      createdById: req.user.id,
    },
    select: projectListSelect,
  });

  return res.status(201).json({
    success: true,
    message: "Project created successfully.",
    data: {
      project,
    },
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const {
    search = "",
    status = "",
    priority = "",
    page: pageValue = "1",
    limit: limitValue = "10",
  } = req.query;

  const { page, limit, skip } = getPaginationValues(
    pageValue,
    limitValue
  );

  const where = {};

  if (req.user.role.name === "PROJECT_MANAGER") {
    where.createdById = req.user.id;
  }

  if (req.user.role.name === "TEAM_MEMBER") {
    where.members = {
      some: {
        userId: req.user.id,
      },
    };
  }

  if (typeof search === "string" && search.trim()) {
    where.OR = [
      {
        name: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  if (typeof status === "string" && status.trim()) {
    const normalizedStatus = status.trim().toUpperCase();

    if (!isValidProjectStatus(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status filter.",
      });
    }

    where.status = normalizedStatus;
  }

  if (typeof priority === "string" && priority.trim()) {
    const normalizedPriority = priority.trim().toUpperCase();

    if (!isValidPriority(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project priority filter.",
      });
    }

    where.priority = normalizedPriority;
  }

  const [projects, totalProjects] = await Promise.all([
    prisma.project.findMany({
      where,
      select: projectListSelect,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.project.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalProjects / limit);

  return res.status(200).json({
    success: true,
    data: {
      projects,
      pagination: {
        page,
        limit,
        totalItems: totalProjects,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const accessibleProject = await findAccessibleProject(
    id,
    req.user
  );

  if (!accessibleProject) {
    return res.status(404).json({
      success: false,
      message:
        "Project not found or you do not have access to it.",
    });
  }

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      priority: true,
      startDate: true,
      dueDate: true,
      createdById: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      members: {
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
              status: true,
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },

      tasks: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          completedAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },

      _count: {
        select: {
          members: true,
          tasks: true,
        },
      },

      createdAt: true,
      updatedAt: true,
    },
  });

  const totalTasks = project.tasks.length;

  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return res.status(200).json({
    success: true,
    data: {
      project: {
        ...project,
        progress: {
          totalTasks,
          completedTasks,
          percentage: progress,
        },
      },
    },
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    status,
    priority,
    startDate,
    dueDate,
  } = req.body;

  const project = await findManageableProject(id, req.user);

  if (!project) {
    return res.status(404).json({
      success: false,
      message:
        "Project not found or you do not have permission to update it.",
    });
  }

  const updateData = {};

  if (name !== undefined) {
    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Project name must be a string.",
      });
    }

    const normalizedName = name.trim().replace(/\s+/g, " ");

    if (
      normalizedName.length < 3 ||
      normalizedName.length > 150
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project name must contain between 3 and 150 characters.",
      });
    }

    updateData.name = normalizedName;
  }

  if (description !== undefined) {
    if (
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project description must be a string or null.",
      });
    }

    updateData.description =
      typeof description === "string" && description.trim()
        ? description.trim()
        : null;
  }

  if (status !== undefined) {
    const normalizedStatus = String(status)
      .trim()
      .toUpperCase();

    if (!isValidProjectStatus(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

    updateData.status = normalizedStatus;
  }

  if (priority !== undefined) {
    const normalizedPriority = String(priority)
      .trim()
      .toUpperCase();

    if (!isValidPriority(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project priority.",
      });
    }

    updateData.priority = normalizedPriority;
  }

  const parsedStartDate = parseOptionalDate(startDate);
  const parsedDueDate = parseOptionalDate(dueDate);

  if (!parsedStartDate.valid) {
    return res.status(400).json({
      success: false,
      message: "Start date is invalid.",
    });
  }

  if (!parsedDueDate.valid) {
    return res.status(400).json({
      success: false,
      message: "Due date is invalid.",
    });
  }

  if (parsedStartDate.provided) {
    updateData.startDate = parsedStartDate.value;
  }

  if (parsedDueDate.provided) {
    updateData.dueDate = parsedDueDate.value;
  }

  const finalStartDate = parsedStartDate.provided
    ? parsedStartDate.value
    : project.startDate;

  const finalDueDate = parsedDueDate.provided
    ? parsedDueDate.value
    : project.dueDate;

  if (!validateDateRange(finalStartDate, finalDueDate)) {
    return res.status(400).json({
      success: false,
      message: "Due date must be on or after the start date.",
    });
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update.",
    });
  }

  const updatedProject = await prisma.project.update({
    where: {
      id,
    },
    data: updateData,
    select: projectListSelect,
  });

  return res.status(200).json({
    success: true,
    message: "Project updated successfully.",
    data: {
      project: updatedProject,
    },
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      status: true,
      _count: {
        select: {
          members: true,
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found.",
    });
  }

  await prisma.project.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Project deleted successfully.",
  });
});