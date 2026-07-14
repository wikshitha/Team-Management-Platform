import api from "@/services/api";

import type {
  CreateUserInput,
  GetRolesResponse,
  GetUserResponse,
  GetUsersParams,
  GetUsersResponse,
  UpdateUserInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  UserMutationResponse,
} from "@/types/user";

export const getUsers = async (
  params: GetUsersParams
): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>(
    "/users",
    {
      params,
    }
  );

  return response.data;
};

export const getUserById = async (
  userId: string
): Promise<GetUserResponse> => {
  const response = await api.get<GetUserResponse>(
    `/users/${userId}`
  );

  return response.data;
};

export const createUser = async (
  input: CreateUserInput
): Promise<UserMutationResponse> => {
  const response =
    await api.post<UserMutationResponse>(
      "/users",
      input
    );

  return response.data;
};

export const updateUser = async (
  userId: string,
  input: UpdateUserInput
): Promise<UserMutationResponse> => {
  const response =
    await api.patch<UserMutationResponse>(
      `/users/${userId}`,
      input
    );

  return response.data;
};

export const updateUserStatus = async (
  userId: string,
  input: UpdateUserStatusInput
): Promise<UserMutationResponse> => {
  const response =
    await api.patch<UserMutationResponse>(
      `/users/${userId}/status`,
      input
    );

  return response.data;
};

export const updateUserRole = async (
  userId: string,
  input: UpdateUserRoleInput
): Promise<UserMutationResponse> => {
  const response =
    await api.patch<UserMutationResponse>(
      `/users/${userId}/role`,
      input
    );

  return response.data;
};

export const deleteUser = async (
  userId: string
): Promise<UserMutationResponse> => {
  const response =
    await api.delete<UserMutationResponse>(
      `/users/${userId}`
    );

  return response.data;
};

export const getRoles =
  async (): Promise<GetRolesResponse> => {
    const response =
      await api.get<GetRolesResponse>("/roles");

    return response.data;
  };