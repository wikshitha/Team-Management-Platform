"use client";

import { useRouter } from "next/navigation";
import {
  FiBell,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

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

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <FiMenu className="text-2xl" />
        </button>

        <div>
          <p className="text-sm text-slate-500">
            Welcome back,
          </p>

          <h1 className="font-semibold text-slate-900">
            {user.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="relative rounded-xl p-3 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <FiBell className="text-xl" />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user.name}
          </p>

          <p className="text-xs text-slate-500">
            {formatRole(user.role.name)}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl p-3 text-slate-600 hover:bg-red-50 hover:text-red-600"
          aria-label="Log out"
        >
          <FiLogOut className="text-xl" />
        </button>
      </div>
    </header>
  );
}