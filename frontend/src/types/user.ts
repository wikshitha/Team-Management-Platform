import type {
  UserRole,
  UserStatus,
} from "@/types/auth";

export interface SystemRole {
  id: string;
  name: UserRole;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;

  _count?: {
    users: number;
  };
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  roleId: string;

  role: {
    id: string;
    name: UserRole;
    description: string | null;
  };

  createdAt: string;
  updatedAt: string;

  _count?: {
    createdProjects: number;
    projectMembers: number;
    assignedTasks: number;
    createdTasks: number;
    comments: number;
    notifications: number;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetUsersParams {
  search?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  success: boolean;

  data: {
    users: SystemUser[];
    pagination: PaginationData;
  };
}

export interface GetUserResponse {
  success: boolean;

  data: {
    user: SystemUser;
  };
}

export interface GetRolesResponse {
  success: boolean;
  count: number;

  data: {
    roles: SystemRole[];
  };
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
  status: UserStatus;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface UpdateUserStatusInput {
  status: UserStatus;
}

export interface UpdateUserRoleInput {
  roleId: string;
}

export interface UserMutationResponse {
  success: boolean;
  message: string;

  data?: {
    user: SystemUser;
  };
}

export interface TeamMemberListItem {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;

  role: {
    id: string;
    name: "TEAM_MEMBER";
    description?: string | null;
  };

  _count?: {
    projectMembers?: number;
    assignedTasks?: number;
  };
}

export interface TeamMemberFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetTeamMembersResponse {
  success: boolean;

  data: {
    members: TeamMemberListItem[];
    pagination: PaginationData;
  };
}