"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

import Logo from "@/components/ui/Logo";
import { navigationItems } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user.role.name)
  );

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          isMobileOpen
            ? "w-72 translate-x-0"
            : "w-72 -translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <Logo collapsed={isCollapsed} />

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {visibleItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  isCollapsed
                    ? "lg:justify-center"
                    : "",
                ].join(" ")}
              >
                <Icon className="shrink-0 text-xl" />

                {!isCollapsed && (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-slate-200 p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-xl p-3 text-slate-600 hover:bg-slate-100"
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {isCollapsed ? (
              <FiChevronRight className="text-xl" />
            ) : (
              <div className="flex items-center gap-2">
                <FiChevronLeft className="text-xl" />
                <span className="text-sm font-medium">
                  Collapse sidebar
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}