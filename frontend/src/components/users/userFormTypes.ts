import type {
  UserRole,
  UserStatus,
} from "@/types/auth";

export interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  status: UserStatus;
}

export interface EditUserFormValues {
  name: string;
  email: string;
}

export interface RoleFormValues {
  roleId: string;
}

export interface UserFilters {
  search: string;
  role: UserRole | "";
  status: UserStatus | "";
}