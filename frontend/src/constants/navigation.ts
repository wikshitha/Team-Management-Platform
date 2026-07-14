import {
  FiBell,
  FiFolder,
  FiHome,
  FiList,
  FiUsers,
  FiUser,
} from "react-icons/fi";

import type { IconType } from "react-icons";
import type { UserRole } from "@/types/auth";

export interface NavigationItem {
  label: string;
  href: string;
  icon: IconType;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: FiHome,
    roles: ["ADMIN"],
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: FiUsers,
    roles: ["ADMIN"],
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FiFolder,
    roles: ["ADMIN"],
  },
  {
    label: "Tasks",
    href: "/admin/tasks",
    icon: FiList,
    roles: ["ADMIN"],
  },

  {
    label: "Dashboard",
    href: "/manager/dashboard",
    icon: FiHome,
    roles: ["PROJECT_MANAGER"],
  },
  {
    label: "Projects",
    href: "/manager/projects",
    icon: FiFolder,
    roles: ["PROJECT_MANAGER"],
  },
  {
    label: "Team Members",
    href: "/manager/team-members",
    icon: FiUsers,
    roles: ["PROJECT_MANAGER"],
  },
  {
    label: "Tasks",
    href: "/manager/tasks",
    icon: FiList,
    roles: ["PROJECT_MANAGER"],
  },

  {
    label: "Dashboard",
    href: "/member/dashboard",
    icon: FiHome,
    roles: ["TEAM_MEMBER"],
  },
  {
    label: "My Projects",
    href: "/member/projects",
    icon: FiFolder,
    roles: ["TEAM_MEMBER"],
  },
  {
    label: "My Tasks",
    href: "/member/tasks",
    icon: FiList,
    roles: ["TEAM_MEMBER"],
  },

  {
    label: "Notifications",
    href: "/notifications",
    icon: FiBell,
    roles: [
      "ADMIN",
      "PROJECT_MANAGER",
      "TEAM_MEMBER",
    ],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: FiUser,
    roles: [
      "ADMIN",
      "PROJECT_MANAGER",
      "TEAM_MEMBER",
    ],
  },
];