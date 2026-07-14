"use client";

import {
  useState,
  type ReactNode,
} from "react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const SIDEBAR_STORAGE_KEY =
  "team_management_sidebar_collapsed";

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] =
    useState<boolean>(() => {
      if (typeof window === "undefined") {
        return false;
      }

      return (
        localStorage.getItem(SIDEBAR_STORAGE_KEY) ===
        "true"
      );
    });

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((currentValue) => {
      const nextValue = !currentValue;

      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(nextValue)
      );

      return nextValue;
    });
  };

  const handleOpenMobileSidebar = () => {
    setIsMobileOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={handleCloseMobileSidebar}
      />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64",
        ].join(" ")}
      >
        <Navbar
          onOpenMobileSidebar={
            handleOpenMobileSidebar
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}