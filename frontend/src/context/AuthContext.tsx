"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUserRequest,
  loginRequest,
} from "@/services/authService";

import { AUTH_TOKEN_KEY } from "@/services/api";

import type {
  AuthContextValue,
  AuthUser,
  LoginCredentials,
} from "@/types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);

    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!storedToken) {
      setToken(null);
      setUser(null);
      return;
    }

    try {
      setToken(storedToken);

      const response = await getCurrentUserRequest();

      setUser(response.data.user);
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<AuthUser> => {
      const response = await loginRequest(credentials);

      localStorage.setItem(
        AUTH_TOKEN_KEY,
        response.data.token
      );

      setToken(response.data.token);
      setUser(response.data.user);

      return response.data.user;
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      isLoading,
      login,
      logout,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}