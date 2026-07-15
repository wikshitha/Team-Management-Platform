import api from "@/services/api";

import type {
  CommentMutationResponse,
  CreateTaskInput,
  GetCommentsResponse,
  GetTaskResponse,
  GetTasksResponse,
  TaskFilters,
  TaskMutationResponse,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "@/types/task";

export const getTasks = async (
  params: TaskFilters
): Promise<GetTasksResponse> => {
  const response = await api.get<GetTasksResponse>(
    "/tasks",
    {
      params,
    }
  );

  return response.data;
};

export const getMyTasks = async (
  params: TaskFilters
): Promise<GetTasksResponse> => {
  const response = await api.get<GetTasksResponse>(
    "/tasks/my",
    {
      params,
    }
  );

  return response.data;
};

export const getProjectTasks = async (
  projectId: string,
  params: TaskFilters
): Promise<GetTasksResponse> => {
  const response = await api.get<GetTasksResponse>(
    `/projects/${projectId}/tasks`,
    {
      params,
    }
  );

  return response.data;
};

export const getTaskById = async (
  taskId: string
): Promise<GetTaskResponse> => {
  const response = await api.get<GetTaskResponse>(
    `/tasks/${taskId}`
  );

  return response.data;
};

export const createTask = async (
  input: CreateTaskInput
): Promise<TaskMutationResponse> => {
  const response =
    await api.post<TaskMutationResponse>(
      "/tasks",
      input
    );

  return response.data;
};

export const updateTask = async (
  taskId: string,
  input: UpdateTaskInput
): Promise<TaskMutationResponse> => {
  const response =
    await api.patch<TaskMutationResponse>(
      `/tasks/${taskId}`,
      input
    );

  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  input: UpdateTaskStatusInput
): Promise<TaskMutationResponse> => {
  const response =
    await api.patch<TaskMutationResponse>(
      `/tasks/${taskId}/status`,
      input
    );

  return response.data;
};

export const deleteTask = async (
  taskId: string
): Promise<TaskMutationResponse> => {
  const response =
    await api.delete<TaskMutationResponse>(
      `/tasks/${taskId}`
    );

  return response.data;
};

export const getTaskComments = async (
  taskId: string
): Promise<GetCommentsResponse> => {
  const response =
    await api.get<GetCommentsResponse>(
      `/tasks/${taskId}/comments`
    );

  return response.data;
};

export const createTaskComment = async (
  taskId: string,
  content: string
): Promise<CommentMutationResponse> => {
  const response =
    await api.post<CommentMutationResponse>(
      `/tasks/${taskId}/comments`,
      {
        content,
      }
    );

  return response.data;
};

export const updateTaskComment = async (
  commentId: string,
  content: string
): Promise<CommentMutationResponse> => {
  const response =
    await api.patch<CommentMutationResponse>(
      `/comments/${commentId}`,
      {
        content,
      }
    );

  return response.data;
};

export const deleteTaskComment = async (
  commentId: string
): Promise<CommentMutationResponse> => {
  const response =
    await api.delete<CommentMutationResponse>(
      `/comments/${commentId}`
    );

  return response.data;
};