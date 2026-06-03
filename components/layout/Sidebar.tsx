"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
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

const navContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 28 },
  },
};

/**
 * Desktop sidebar: collapsible, with nav items, user avatar, and logo.
 * Active state uses a shared layoutId background pill for smooth transitions.
 */
export function Sidebar({ user, isCollapsed, onToggle }: SidebarProps) {
  const firstName = user.name.split(" ")[0];
  const initials  = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 60 : 212 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={cn(
        "hidden md:flex flex-col shrink-0",
        "border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]",
        "relative h-screen sticky top-0 overflow-hidden"
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <header className="flex h-14 items-center border-b border-[var(--border-subtle)] px-3.5 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <motion.div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-fill)] border border-[var(--accent-ring)]"
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Zap size={14} className="text-[var(--accent-light)]" />
          </motion.div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="text-[13px] font-bold tracking-tight text-[var(--text-1)] whitespace-nowrap"
              >
                NexLearn
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden px-2 py-4" aria-label="Primary">
        <motion.ul
          className="flex flex-col gap-0.5"
          role="list"
          variants={navContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {NAV_ITEMS.map(({ label, icon: Icon, href, active }) => (
            <motion.li key={label} variants={navItemVariants}>
              <a
                href={href}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium",
                  "transition-colors duration-150",
                  active
                    ? "text-[var(--accent-light)]"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                )}
                aria-current={active ? "page" : undefined}
                title={isCollapsed ? label : undefined}
              >
                {/* Active background */}
                {active && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl bg-[var(--accent-fill)] shadow-[inset_0_0_0_1px_var(--border-accent)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}

                {/* Hover bg for inactive items */}
                {!active && (
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-white/[0.04] transition-opacity duration-150"
                    aria-hidden="true"
                  />
                )}

                <div className="relative shrink-0">
                  <Icon
                    size={16}
                    className={cn(
                      "transition-colors",
                      active
                        ? "text-[var(--accent-light)]"
                        : "text-[var(--text-3)] group-hover:text-[var(--text-2)]"
                    )}
                    aria-hidden="true"
                  />
                </div>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      key={`label-${label}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      className="relative whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      {/* User footer */}
      <footer className="border-t border-[var(--border-subtle)] p-2.5 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Avatar */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-overlay)] text-[11px] font-semibold text-[var(--accent-light)] border border-[var(--border)]">
            {initials}
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="flex-1 min-w-0"
              >
                <p className="truncate text-[12px] font-semibold text-[var(--text-1)]">
                  {firstName}
                </p>
                <p className="truncate text-[10px] text-[var(--text-3)]">
                  Student
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <motion.button
              type="button"
              className="text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
              aria-label="Sign out"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <LogOut size={13} />
            </motion.button>
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
          "rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]",
          "text-[var(--text-3)] hover:text-[var(--accent-light)] hover:border-[var(--border-accent)] transition-colors"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <ChevronRight size={11} />
        </motion.div>
      </button>
    </motion.aside>
  );
}
