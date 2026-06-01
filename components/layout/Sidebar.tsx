"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  Calendar,
  Settings,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#", active: true },
  { label: "Courses",   icon: GraduationCap,  href: "#" },
  { label: "Progress",  icon: BarChart3,       href: "#" },
  { label: "Calendar",  icon: Calendar,        href: "#" },
  { label: "Settings",  icon: Settings,        href: "#" },
];

interface SidebarProps {
  user: UserProfile;
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Desktop sidebar: collapsible, with nav items, user avatar, and logo.
 */
export function Sidebar({ user, isCollapsed, onToggle }: SidebarProps) {
  const firstName = user.name.split(" ")[0];
  const initials  = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "hidden md:flex flex-col shrink-0",
        "border-r border-white/6 bg-[var(--bg-surface)]",
        "relative h-screen sticky top-0 overflow-hidden"
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <header className="flex h-16 items-center border-b border-white/6 px-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30">
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-bold tracking-tight text-white whitespace-nowrap"
              >
                NexLearn
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden px-2 py-4" aria-label="Primary">
        <ul className="flex flex-col gap-1" role="list">
          {NAV_ITEMS.map(({ label, icon: Icon, href, active }) => (
            <li key={label}>
              <a
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-emerald-500/15 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                )}
                aria-current={active ? "page" : undefined}
                title={isCollapsed ? label : undefined}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                  aria-hidden="true"
                />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      key={`label-${label}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <footer className="border-t border-white/6 p-3 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 text-[12px] font-bold text-emerald-300 border border-emerald-500/30">
            {initials}
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="truncate text-[13px] font-medium text-white">
                  {firstName}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  Student
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <button
              type="button"
              className="text-slate-600 hover:text-slate-300 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </footer>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-3 z-10",
          "flex h-6 w-6 items-center justify-center",
          "rounded-full border border-white/10 bg-[var(--bg-elevated)]",
          "text-slate-400 hover:text-white hover:border-emerald-500/40 transition-all"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight size={12} />
        </motion.div>
      </button>
    </motion.aside>
  );
}
