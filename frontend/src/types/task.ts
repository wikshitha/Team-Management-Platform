import type { PaginationData } from "@/types/user";
import type { Priority } from "@/types/project";
import type { UserRole } from "@/types/auth";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED";

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  status?: "ACTIVE" | "INACTIVE";

  role?: {
    id: string;
    name: UserRole;
  };
}

export interface TaskProject {
  id: string;
  name: string;
  status?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  completedAt: string | null;

  projectId: string;
  project: TaskProject;

  assignedToId: string | null;
  assignedTo: TaskUser | null;

  createdById: string;
  createdBy: TaskUser;

  _count?: {
    comments: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  user: TaskUser;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | "";
  priority?: Priority | "";
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export interface GetTasksResponse {
  success: boolean;

  data: {
    tasks: Task[];
    pagination: PaginationData;
  };
}

export interface GetTaskResponse {
  success: boolean;

  data: {
    task: Task;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string | null;
  projectId: string;
  assignedToId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  dueDate?: string | null;
  assignedToId?: string | null;
}

export interface TaskMutationResponse {
  success: boolean;
  message: string;

  data?: {
    task: Task;
  };
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface GetCommentsResponse {
  success: boolean;
  count: number;

  data: {
    comments: TaskComment[];
  };
}

export interface CommentMutationResponse {
  success: boolean;
  message: string;

  data?: {
    comment: TaskComment;
  };
}