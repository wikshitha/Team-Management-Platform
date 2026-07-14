export type UserRole =
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "TEAM_MEMBER";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface Role {
  id: string;
  name: UserRole;
  description: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface CurrentUserResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}