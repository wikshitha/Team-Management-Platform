"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import LoadingScreen from "@/components/ui/LoadingScreen";
import {ROUTES} from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const router = useRouter();

  const {
    user,
    isLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    if (!allowedRoles.includes(user.role.name)) {
      router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [
    allowedRoles,
    isAuthenticated,
    isLoading,
    router,
    user,
  ]);

  if (
    isLoading ||
    !user ||
    !allowedRoles.includes(user.role.name)
  ) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}