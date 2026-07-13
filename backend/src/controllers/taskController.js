import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getPaginationValues,
  isValidPriority,
  isValidTaskStatus,
  normalizeText,
  parseOptionalDate,
} from "../utils/validators.js";
import {
  findAccessibleTask,
  findManageableTask,
  validateTaskAssignee,
} from "../utils/taskAccess.js";
import {
  findAccessibleProject,
  findManageableProject,
} from "../utils/projectAccess.js";

const taskListSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  completedAt: true,
  projectId: true,
  assignedToId: true,
  createdById: true,

  project: {
    select: {
      id: true,
      name: true,
      status: true,
      priority: true,
      dueDate: true,
    },
  },

  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
    },
  },

  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
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
      comments: true,
    },
  },

  createdAt: true,
  updatedAt: true,
};

const buildTaskFilters = ({
  search,
  status,
  priority,
  assignedTo,
}) => {
  const where = {};

  if (typeof search === "string" && search.trim()) {
    where.OR = [
      {
        title: {
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

    if (!isValidTaskStatus(normalizedStatus)) {
      return {
        error:
          "Status must be TODO, IN_PROGRESS, IN_REVIEW, or COMPLETED.",
      };
    }

    where.status = normalizedStatus;
  }

  if (typeof priority === "string" && priority.trim()) {
    const normalizedPriority = priority.trim().toUpperCase();

    if (!isValidPriority(normalizedPriority)) {
      return {
        error:
          "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
      };
    }

    where.priority = normalizedPriority;
  }

  if (
    typeof assignedTo === "string" &&
    assignedTo.trim()
  ) {
    if (assignedTo.trim().toLowerCase() === "unassigned") {
      where.assignedToId = null;
    } else {
      where.assignedToId = assignedTo.trim();
    }
  }

  return {
    where,
    error: null,
  };
};

export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority = "MEDIUM",
    dueDate,
    projectId,
    assignedToId,
  } = req.body;

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({
      success: false,
      message: "Project ID is required.",
    });
  }

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "Task title is required.",
    });
  }

  const normalizedTitle = normalizeText(title);

  if (
    normalizedTitle.length < 3 ||
    normalizedTitle.length > 200
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Task title must contain between 3 and 200 characters.",
    });
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Task description must be a string or null.",
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
        "Project not found or you do not have permission to create tasks in it.",
    });
  }

  if (project.status === "ARCHIVED") {
    return res.status(400).json({
      success: false,
      message: "Tasks cannot be created in an archived project.",
    });
  }

  const normalizedPriority = String(priority)
    .trim()
    .toUpperCase();

  if (!isValidPriority(normalizedPriority)) {
    return res.status(400).json({
      success: false,
      message:
        "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
    });
  }

  const parsedDueDate = parseOptionalDate(dueDate);

  if (!parsedDueDate.valid) {
    return res.status(400).json({
      success: false,
      message: "Task due date is invalid.",
    });
  }

  if (
    parsedDueDate.value &&
    project.dueDate &&
    parsedDueDate.value > project.dueDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Task due date cannot be later than the project due date.",
    });
  }

  const assigneeResult = await validateTaskAssignee(
    projectId,
    assignedToId
  );

  if (!assigneeResult.valid) {
    return res.status(400).json({
      success: false,
      message: assigneeResult.message,
    });
  }

  const task = await prisma.$transaction(async (transaction) => {
    const createdTask = await transaction.task.create({
      data: {
        title: normalizedTitle,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        priority: normalizedPriority,
        dueDate: parsedDueDate.value,
        projectId,
        assignedToId: assignedToId || null,
        createdById: req.user.id,
      },
      select: taskListSelect,
    });

    if (assignedToId) {
      await transaction.notification.create({
        data: {
          userId: assignedToId,
          type: "TASK_ASSIGNED",
          message: `You have been assigned the task "${createdTask.title}" in project "${createdTask.project.name}".`,
        },
      });
    }

    return createdTask;
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: {
      task,
    },
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const {
    search = "",
    status = "",
    priority = "",
    assignedTo = "",
    page: pageValue = "1",
    limit: limitValue = "10",
  } = req.query;

  const { page, limit, skip } = getPaginationValues(
    pageValue,
    limitValue
  );

  const filterResult = buildTaskFilters({
    search,
    status,
    priority,
    assignedTo,
  });

  if (filterResult.error) {
    return res.status(400).json({
      success: false,
      message: filterResult.error,
    });
  }

  const where = filterResult.where;

  if (req.user.role.name === "PROJECT_MANAGER") {
    where.project = {
      createdById: req.user.id,
    };
  }

  if (req.user.role.name === "TEAM_MEMBER") {
    where.assignedToId = req.user.id;
  }

  const [tasks, totalTasks] = await Promise.all([
    prisma.task.findMany({
      where,
      select: taskListSelect,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.task.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalTasks / limit);

  return res.status(200).json({
    success: true,
    data: {
      tasks,
      pagination: {
        page,
        limit,
        totalItems: totalTasks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

export const getMyTasks = asyncHandler(async (req, res) => {
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

  const filterResult = buildTaskFilters({
    search,
    status,
    priority,
    assignedTo: "",
  });

  if (filterResult.error) {
    return res.status(400).json({
      success: false,
      message: filterResult.error,
    });
  }

  const where = {
    ...filterResult.where,
    assignedToId: req.user.id,
  };

  const [tasks, totalTasks] = await Promise.all([
    prisma.task.findMany({
      where,
      select: taskListSelect,
      orderBy: [
        {
          dueDate: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip,
      take: limit,
    }),

    prisma.task.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalTasks / limit);

  return res.status(200).json({
    success: true,
    data: {
      tasks,
      pagination: {
        page,
        limit,
        totalItems: totalTasks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
});

export const getProjectTasks = asyncHandler(
  async (req, res) => {
    const { projectId } = req.params;

    const {
      search = "",
      status = "",
      priority = "",
      assignedTo = "",
      page: pageValue = "1",
      limit: limitValue = "10",
    } = req.query;

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

    const { page, limit, skip } = getPaginationValues(
      pageValue,
      limitValue
    );

    const filterResult = buildTaskFilters({
      search,
      status,
      priority,
      assignedTo,
    });

    if (filterResult.error) {
      return res.status(400).json({
        success: false,
        message: filterResult.error,
      });
    }

    const where = {
      ...filterResult.where,
      projectId,
    };

    if (req.user.role.name === "TEAM_MEMBER") {
      where.assignedToId = req.user.id;
    }

    const [tasks, totalTasks] = await Promise.all([
      prisma.task.findMany({
        where,
        select: taskListSelect,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.task.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          totalItems: totalTasks,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  }
);

export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const accessibleTask = await findAccessibleTask(
    id,
    req.user
  );

  if (!accessibleTask) {
    return res.status(404).json({
      success: false,
      message:
        "Task not found or you do not have access to it.",
    });
  }

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    select: {
      ...taskListSelect,

      comments: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,

          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
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
    },
  });

  return res.status(200).json({
    success: true,
    data: {
      task,
    },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    priority,
    dueDate,
    assignedToId,
  } = req.body;

  const task = await findManageableTask(id, req.user);

  if (!task) {
    return res.status(404).json({
      success: false,
      message:
        "Task not found or you do not have permission to update it.",
    });
  }

  if (task.project.status === "ARCHIVED") {
    return res.status(400).json({
      success: false,
      message: "Tasks in archived projects cannot be updated.",
    });
  }

  const updateData = {};

  if (title !== undefined) {
    if (typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task title must be a string.",
      });
    }

    const normalizedTitle = normalizeText(title);

    if (
      normalizedTitle.length < 3 ||
      normalizedTitle.length > 200
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Task title must contain between 3 and 200 characters.",
      });
    }

    updateData.title = normalizedTitle;
  }

  if (description !== undefined) {
    if (
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null.",
      });
    }

    updateData.description =
      typeof description === "string" && description.trim()
        ? description.trim()
        : null;
  }

  if (priority !== undefined) {
    const normalizedPriority = String(priority)
      .trim()
      .toUpperCase();

    if (!isValidPriority(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message:
          "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
      });
    }

    updateData.priority = normalizedPriority;
  }

  const parsedDueDate = parseOptionalDate(dueDate);

  if (!parsedDueDate.valid) {
    return res.status(400).json({
      success: false,
      message: "Task due date is invalid.",
    });
  }

  if (parsedDueDate.provided) {
    if (
      parsedDueDate.value &&
      task.project.dueDate &&
      parsedDueDate.value > task.project.dueDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Task due date cannot be later than the project due date.",
      });
    }

    updateData.dueDate = parsedDueDate.value;
  }

  let assigneeUser = null;

  if (assignedToId !== undefined) {
    if (
      assignedToId !== null &&
      typeof assignedToId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Assigned Team Member ID must be a string or null.",
      });
    }

    const assigneeResult = await validateTaskAssignee(
      task.projectId,
      assignedToId
    );

    if (!assigneeResult.valid) {
      return res.status(400).json({
        success: false,
        message: assigneeResult.message,
      });
    }

    updateData.assignedToId = assignedToId || null;
    assigneeUser = assigneeResult.user;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update.",
    });
  }

  const assigneeChanged =
    assignedToId !== undefined &&
    assignedToId !== task.assignedToId;

  const updatedTask = await prisma.$transaction(
    async (transaction) => {
      const result = await transaction.task.update({
        where: {
          id,
        },
        data: updateData,
        select: taskListSelect,
      });

      if (assigneeChanged && assignedToId && assigneeUser) {
        await transaction.notification.create({
          data: {
            userId: assignedToId,
            type: "TASK_ASSIGNED",
            message: `You have been assigned the task "${result.title}" in project "${result.project.name}".`,
          },
        });
      } else if (
        !assigneeChanged &&
        result.assignedToId &&
        result.assignedToId !== req.user.id
      ) {
        await transaction.notification.create({
          data: {
            userId: result.assignedToId,
            type: "TASK_UPDATED",
            message: `The task "${result.title}" has been updated.`,
          },
        });
      }

      return result;
    }
  );

  return res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: {
      task: updatedTask,
    },
  });
});

export const updateTaskStatus = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Task status is required.",
      });
    }

    const normalizedStatus = String(status)
      .trim()
      .toUpperCase();

    if (!isValidTaskStatus(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be TODO, IN_PROGRESS, IN_REVIEW, or COMPLETED.",
      });
    }

    let task;

    if (req.user.role.name === "TEAM_MEMBER") {
      task = await findAccessibleTask(id, req.user);
    } else {
      task = await findManageableTask(id, req.user);
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found or you do not have permission to update its status.",
      });
    }

    if (task.project.status === "ARCHIVED") {
      return res.status(400).json({
        success: false,
        message:
          "Task status cannot be changed in an archived project.",
      });
    }

    if (task.status === normalizedStatus) {
      return res.status(400).json({
        success: false,
        message: `Task status is already ${normalizedStatus}.`,
      });
    }

    const updatedTask = await prisma.$transaction(
      async (transaction) => {
        const result = await transaction.task.update({
          where: {
            id,
          },
          data: {
            status: normalizedStatus,
            completedAt:
              normalizedStatus === "COMPLETED"
                ? new Date()
                : null,
          },
          select: taskListSelect,
        });

        const notificationUserId =
          req.user.role.name === "TEAM_MEMBER"
            ? result.createdById
            : result.assignedToId;

        if (
          notificationUserId &&
          notificationUserId !== req.user.id
        ) {
          await transaction.notification.create({
            data: {
              userId: notificationUserId,
              type: "TASK_UPDATED",
              message: `The task "${result.title}" status changed to ${normalizedStatus.replaceAll(
                "_",
                " "
              )}.`,
            },
          });
        }

        return result;
      }
    );

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully.",
      data: {
        task: updatedTask,
      },
    });
  }
);

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await findManageableTask(id, req.user);

  if (!task) {
    return res.status(404).json({
      success: false,
      message:
        "Task not found or you do not have permission to delete it.",
    });
  }

  if (task.project.status === "ARCHIVED") {
    return res.status(400).json({
      success: false,
      message:
        "Tasks cannot be deleted from an archived project.",
    });
  }

  await prisma.task.delete({
    where: {
      id,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
  });
});