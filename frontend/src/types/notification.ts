import type { PaginationData } from "@/types/user";

export type NotificationType =
  | "PROJECT_ASSIGNED"
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_COMMENT"
  | "SYSTEM";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

export interface NotificationFilters {
  isRead?: boolean | "";
  page?: number;
  limit?: number;
}

export interface GetNotificationsResponse {
  success: boolean;

  data: {
    notifications: Notification[];
    pagination: PaginationData;
  };
}

export interface UnreadCountResponse {
  success: boolean;

  data: {
    unreadCount: number;
  };
}

export interface NotificationMutationResponse {
  success: boolean;
  message: string;

  data?: {
    notification?: Notification;
    unreadCount?: number;
  };
}