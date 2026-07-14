import api from "@/services/api";

import type {
  AdminDashboardResponse,
  ManagerDashboardResponse,
  MemberDashboardResponse,
} from "@/types/dashboard";

export const getAdminDashboard =
  async (): Promise<AdminDashboardResponse> => {
    const response =
      await api.get<AdminDashboardResponse>(
        "/dashboard/admin"
      );

    return response.data;
  };

export const getManagerDashboard =
  async (): Promise<ManagerDashboardResponse> => {
    const response =
      await api.get<ManagerDashboardResponse>(
        "/dashboard/manager"
      );

    return response.data;
  };

export const getMemberDashboard =
  async (): Promise<MemberDashboardResponse> => {
    const response =
      await api.get<MemberDashboardResponse>(
        "/dashboard/member"
      );

    return response.data;
  };