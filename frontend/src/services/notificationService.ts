import api from "@/services/api";

import type {
  GetNotificationsResponse,
  NotificationFilters,
  NotificationMutationResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const getNotifications = async (
  params: NotificationFilters
): Promise<GetNotificationsResponse> => {
  const response =
    await api.get<GetNotificationsResponse>(
      "/notifications",
      {
        params,
      }
    );

  return response.data;
};

export const getUnreadNotificationCount =
  async (): Promise<UnreadCountResponse> => {
    const response =
      await api.get<UnreadCountResponse>(
        "/notifications/unread-count"
      );

    return response.data;
  };

export const markNotificationAsRead = async (
  notificationId: string
): Promise<NotificationMutationResponse> => {
  const response =
    await api.patch<NotificationMutationResponse>(
      `/notifications/${notificationId}/read`
    );

  return response.data;
};

export const markAllNotificationsAsRead =
  async (): Promise<NotificationMutationResponse> => {
    const response =
      await api.patch<NotificationMutationResponse>(
        "/notifications/read-all"
      );

    return response.data;
  };