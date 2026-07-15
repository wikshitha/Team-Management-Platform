import api from "@/services/api";

import type {
  ChangePasswordInput,
  ChangePasswordResponse,
} from "@/types/profile";

export const changePassword = async (
  input: ChangePasswordInput
): Promise<ChangePasswordResponse> => {
  const response =
    await api.patch<ChangePasswordResponse>(
      "/auth/change-password",
      input
    );

  return response.data;
};