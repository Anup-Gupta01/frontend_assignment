"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import type { UserProfile } from "@/types";

interface DashboardShellProps {
  user: UserProfile;
  children: React.ReactNode;
}

/**
 * Root layout shell: sidebar + main content area.
 * Sidebar is hidden on mobile and replaced by the BottomNav.
 */
export function DashboardShell({ user, children }: DashboardShellProps) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar user={user} isCollapsed={isCollapsed} onToggle={toggle} />

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto pb-20 md:pb-6"
        id="main-content"
        aria-label="Dashboard content"
      >
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
