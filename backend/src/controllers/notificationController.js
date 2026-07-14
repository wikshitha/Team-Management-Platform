import prisma from "../config/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPaginationValues } from "../utils/validators.js";

const notificationSelect = {
  id: true,
  message: true,
  type: true,
  isRead: true,
  userId: true,
  createdAt: true,
};

export const getNotifications = asyncHandler(
  async (req, res) => {
    const {
      isRead = "",
      type = "",
      page: pageValue = "1",
      limit: limitValue = "10",
    } = req.query;

    const { page, limit, skip } = getPaginationValues(
      pageValue,
      limitValue
    );

    const where = {
      userId: req.user.id,
    };

    if (
      typeof isRead === "string" &&
      isRead.trim() !== ""
    ) {
      const normalizedIsRead = isRead
        .trim()
        .toLowerCase();

      if (
        normalizedIsRead !== "true" &&
        normalizedIsRead !== "false"
      ) {
        return res.status(400).json({
          success: false,
          message: "isRead must be true or false.",
        });
      }

      where.isRead = normalizedIsRead === "true";
    }

    if (typeof type === "string" && type.trim()) {
      const allowedTypes = [
        "PROJECT_ASSIGNED",
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "TASK_COMMENT",
        "DEADLINE_REMINDER",
        "PROJECT_UPDATED",
        "SYSTEM",
      ];

      const normalizedType = type
        .trim()
        .toUpperCase();

      if (!allowedTypes.includes(normalizedType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification type.",
        });
      }

      where.type = normalizedType;
    }

    const [notifications, totalNotifications, unreadCount] =
      await Promise.all([
        prisma.notification.findMany({
          where,
          select: notificationSelect,
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),

        prisma.notification.count({
          where,
        }),

        prisma.notification.count({
          where: {
            userId: req.user.id,
            isRead: false,
          },
        }),
      ]);

    const totalPages = Math.ceil(
      totalNotifications / limit
    );

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          totalItems: totalNotifications,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  }
);

export const getUnreadNotificationCount = asyncHandler(
  async (req, res) => {
    const unreadCount = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    });
  }
);

export const markNotificationAsRead = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const notification =
      await prisma.notification.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    if (notification.isRead) {
      return res.status(200).json({
        success: true,
        message: "Notification is already marked as read.",
        data: {
          notification,
        },
      });
    }

    const updatedNotification =
      await prisma.notification.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
        select: notificationSelect,
      });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: {
        notification: updatedNotification,
      },
    });
  }
);

export const markAllNotificationsAsRead = asyncHandler(
  async (req, res) => {
    const result =
      await prisma.notification.updateMany({
        where: {
          userId: req.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

    return res.status(200).json({
      success: true,
      message:
        result.count === 0
          ? "There were no unread notifications."
          : `${result.count} notification(s) marked as read.`,
      data: {
        updatedCount: result.count,
      },
    });
  }
);

export const deleteNotification = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const notification =
      await prisma.notification.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  }
);