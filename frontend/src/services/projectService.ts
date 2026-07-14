import api from "@/services/api";

import type {
  CreateProjectInput,
  GetAvailableMembersResponse,
  GetProjectMembersResponse,
  GetProjectResponse,
  GetProjectsResponse,
  MemberMutationResponse,
  ProjectFilters,
  ProjectMutationResponse,
  UpdateProjectInput,
} from "@/types/project";

export const getProjects = async (
  params: ProjectFilters
): Promise<GetProjectsResponse> => {
  const response = await api.get<GetProjectsResponse>(
    "/projects",
    {
      params,
    }
  );

  return response.data;
};

export const getProjectById = async (
  projectId: string
): Promise<GetProjectResponse> => {
  const response = await api.get<GetProjectResponse>(
    `/projects/${projectId}`
  );

  return response.data;
};

export const createProject = async (
  input: CreateProjectInput
): Promise<ProjectMutationResponse> => {
  const response =
    await api.post<ProjectMutationResponse>(
      "/projects",
      input
    );

  return response.data;
};

export const updateProject = async (
  projectId: string,
  input: UpdateProjectInput
): Promise<ProjectMutationResponse> => {
  const response =
    await api.patch<ProjectMutationResponse>(
      `/projects/${projectId}`,
      input
    );

  return response.data;
};

export const deleteProject = async (
  projectId: string
): Promise<ProjectMutationResponse> => {
  const response =
    await api.delete<ProjectMutationResponse>(
      `/projects/${projectId}`
    );

  return response.data;
};

export const getProjectMembers = async (
  projectId: string
): Promise<GetProjectMembersResponse> => {
  const response =
    await api.get<GetProjectMembersResponse>(
      `/projects/${projectId}/members`
    );

  return response.data;
};

export const getAvailableProjectMembers = async (
  projectId: string,
  params: {
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<GetAvailableMembersResponse> => {
  const response =
    await api.get<GetAvailableMembersResponse>(
      `/projects/${projectId}/available-members`,
      {
        params,
      }
    );

  return response.data;
};

export const addProjectMember = async (
  projectId: string,
  userId: string
): Promise<MemberMutationResponse> => {
  const response =
    await api.post<MemberMutationResponse>(
      `/projects/${projectId}/members`,
      {
        userId,
      }
    );

  return response.data;
};

export const removeProjectMember = async (
  projectId: string,
  userId: string
): Promise<MemberMutationResponse> => {
  const response =
    await api.delete<MemberMutationResponse>(
      `/projects/${projectId}/members/${userId}`
    );

  return response.data;
};