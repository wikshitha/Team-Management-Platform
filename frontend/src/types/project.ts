import type { PaginationData } from "@/types/user";

export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED";

export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface ProjectCreator {
  id: string;
  name: string;
  email: string;

  role?: {
    id: string;
    name: string;
  };
}

export interface ProjectCounts {
  members: number;
  tasks: number;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  startDate: string | null;
  dueDate: string | null;
  createdById: string;
  createdBy: ProjectCreator;
  _count: ProjectCounts;
  createdAt: string;
  updatedAt: string;

  progress?: {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
  };
}

export interface ProjectMember {
  id: string;
  assignedAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    status: "ACTIVE" | "INACTIVE";

    role: {
      id: string;
      name: string;
      description?: string | null;
    };

    _count?: {
      assignedTasks: number;
    };

    createdAt?: string;
  };
}

export interface AvailableTeamMember {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE";
  createdAt: string;

  role: {
    id: string;
    name: "TEAM_MEMBER";
  };
}

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus | "";
  priority?: Priority | "";
  page?: number;
  limit?: number;
}

export interface GetProjectsResponse {
  success: boolean;

  data: {
    projects: Project[];
    pagination: PaginationData;
  };
}

export interface GetProjectResponse {
  success: boolean;

  data: {
    project: Project;
  };
}

export interface ProjectMutationResponse {
  success: boolean;
  message: string;

  data?: {
    project: Project;
  };
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string | null;
  dueDate?: string | null;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: Priority;
  startDate?: string | null;
  dueDate?: string | null;
}

export interface GetProjectMembersResponse {
  success: boolean;
  count: number;

  data: {
    members: ProjectMember[];
  };
}

export interface GetAvailableMembersResponse {
  success: boolean;

  data: {
    members: AvailableTeamMember[];
    pagination: PaginationData;
  };
}

export interface MemberMutationResponse {
  success: boolean;
  message: string;

  data?: {
    member: ProjectMember;
  };
}