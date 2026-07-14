import api from "@/services/api";
import type {
  CurrentUserResponse,
  LoginCredentials,
  LoginResponse,
} from "@/types/auth";

export const loginRequest = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const getCurrentUserRequest =
  async (): Promise<CurrentUserResponse> => {
    const response =
      await api.get<CurrentUserResponse>("/auth/me");

    return response.data;
  };