import type { UserRole } from "@/types/auth";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  UNAUTHORIZED: "/unauthorized",

  ADMIN_DASHBOARD: "/admin/dashboard",
  MANAGER_DASHBOARD: "/manager/dashboard",
  MEMBER_DASHBOARD: "/member/dashboard",
} as const;

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return ROUTES.ADMIN_DASHBOARD;

    case "PROJECT_MANAGER":
      return ROUTES.MANAGER_DASHBOARD;

    case "TEAM_MEMBER":
      return ROUTES.MEMBER_DASHBOARD;

    default:
      return ROUTES.LOGIN;
  }
};