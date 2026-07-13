import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import { findAccessibleTask } from "../utils/taskAccess.js";

const commentSelect = {
  id: true,
  content: true,
  taskId: true,
  userId: true,
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
};

export const getTaskComments = asyncHandler(
  async (req, res) => {
    const { taskId } = req.params;

    const task = await findAccessibleTask(
      taskId,
      req.user
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found or you do not have access to its comments.",
      });
    }

    const comments = await prisma.taskComment.findMany({
      where: {
        taskId,
      },
      select: commentSelect,
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: {
        comments,
      },
    });
  }
);

export const createTaskComment = asyncHandler(
  async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    const normalizedContent = content.trim();

    if (
      normalizedContent.length < 1 ||
      normalizedContent.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Comment must contain between 1 and 2000 characters.",
      });
    }

    const task = await findAccessibleTask(
      taskId,
      req.user
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message:
          "Task not found or you do not have permission to comment on it.",
      });
    }

    if (task.project.status === "ARCHIVED") {
      return res.status(400).json({
        success: false,
        message:
          "Comments cannot be added to tasks in archived projects.",
      });
    }

    const comment = await prisma.$transaction(
      async (transaction) => {
        const createdComment =
          await transaction.taskComment.create({
            data: {
              content: normalizedContent,
              taskId,
              userId: req.user.id,
            },
            select: commentSelect,
          });

        const notificationRecipients = new Set();

        if (
          task.assignedToId &&
          task.assignedToId !== req.user.id
        ) {
          notificationRecipients.add(task.assignedToId);
        }

        if (
          task.createdById &&
          task.createdById !== req.user.id
        ) {
          notificationRecipients.add(task.createdById);
        }

        if (notificationRecipients.size > 0) {
          await transaction.notification.createMany({
            data: [...notificationRecipients].map((userId) => ({
              userId,
              type: "TASK_COMMENT",
              message: `${req.user.name} commented on task "${task.title}".`,
            })),
          });
        }

        return createdComment;
      }
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: {
        comment,
      },
    });
  }
);

export const updateComment = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    const normalizedContent = content.trim();

    if (
      normalizedContent.length < 1 ||
      normalizedContent.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Comment must contain between 1 and 2000 characters.",
      });
    }

    const comment = await prisma.taskComment.findUnique({
      where: {
        id,
      },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can edit only your own comments.",
      });
    }

    if (comment.task.project.status === "ARCHIVED") {
      return res.status(400).json({
        success: false,
        message:
          "Comments in archived projects cannot be updated.",
      });
    }

    const updatedComment =
      await prisma.taskComment.update({
        where: {
          id,
        },
        data: {
          content: normalizedContent,
        },
        select: commentSelect,
      });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      data: {
        comment: updatedComment,
      },
    });
  }
);

export const deleteComment = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const comment = await prisma.taskComment.findUnique({
      where: {
        id,
      },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    const isCommentOwner =
      comment.userId === req.user.id;

    const isAdministrator =
      req.user.role.name === "ADMIN";

    const isProjectManager =
      req.user.role.name === "PROJECT_MANAGER" &&
      comment.task.project.createdById === req.user.id;

    if (
      !isCommentOwner &&
      !isAdministrator &&
      !isProjectManager
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to delete this comment.",
      });
    }

    await prisma.taskComment.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  }
);