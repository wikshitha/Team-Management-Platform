"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import LoadingScreen from "@/components/ui/LoadingScreen";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const loginUrl = `${ROUTES.LOGIN}?next=${encodeURIComponent(
        pathname
      )}`;

      router.replace(loginUrl);
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    router,
  ]);

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}