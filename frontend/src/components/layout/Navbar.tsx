"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  FiBell,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { getUnreadNotificationCount } from "@/services/notificationService";
import { getUserInitials } from "@/utils/userInitials";

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

const formatRole = (role: string): string => {
  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

export default function Navbar({
  onOpenMobileSidebar,
}: NavbarProps) {
  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();

  const [unreadCount, setUnreadCount] =
    useState(0);

  const loadUnreadCount =
    useCallback(async () => {
      if (!user) {
        return;
      }

      try {
        const response =
          await getUnreadNotificationCount();

        setUnreadCount(
          response.data.unreadCount
        );
      } catch {
        setUnreadCount(0);
      }
    }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    const initializeUnreadCount =
      async () => {
        try {
          const response =
            await getUnreadNotificationCount();

          if (!isCancelled) {
            setUnreadCount(
              response.data.unreadCount
            );
          }
        } catch {
          if (!isCancelled) {
            setUnreadCount(0);
          }
        }
      };

    const handleNotificationsUpdated = () => {
      void loadUnreadCount();
    };

    void initializeUnreadCount();

    window.addEventListener(
      "notifications-updated",
      handleNotificationsUpdated
    );

    return () => {
      isCancelled = true;

      window.removeEventListener(
        "notifications-updated",
        handleNotificationsUpdated
      );
    };
  }, [loadUnreadCount, user]);

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu className="text-2xl" />
        </button>

        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            Welcome back,
          </p>

          <h1 className="truncate font-semibold text-slate-900">
            {user.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <Link
          href="/notifications"
          className="relative rounded-xl p-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
          title="Notifications"
        >
          <FiBell className="text-xl" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </Link>

        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
            {user.name}
          </p>

          <p className="text-xs text-slate-500">
            {formatRole(user.role.name)}
          </p>
        </div>

        <Link
          href="/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 transition hover:bg-blue-200"
          aria-label="Open profile"
          title="Profile"
        >
          {getUserInitials(user.name)}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl p-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Log out"
          title="Log out"
        >
          <FiLogOut className="text-xl" />
        </button>
      </div>
    </header>
  );
}