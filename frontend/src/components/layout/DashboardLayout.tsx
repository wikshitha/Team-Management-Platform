"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] =
    useState(false);

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(
      "team_management_sidebar_collapsed"
    );

    setIsCollapsed(storedValue === "true");
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((currentValue) => {
      const nextValue = !currentValue;

      localStorage.setItem(
        "team_management_sidebar_collapsed",
        String(nextValue)
      );

      return nextValue;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64",
        ].join(" ")}
      >
        <Navbar
          onOpenMobileSidebar={() =>
            setIsMobileOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}