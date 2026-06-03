"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LayoutDashboard, GraduationCap, BarChart3, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home",     icon: LayoutDashboard, href: "#", active: true  },
  { label: "Courses",  icon: GraduationCap,   href: "#", active: false },
  { label: "Progress", icon: BarChart3,        href: "#", active: false },
  { label: "Calendar", icon: Calendar,         href: "#", active: false },
  { label: "Settings", icon: Settings,         href: "#", active: false },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 340, damping: 26 },
  },
};

/**
 * Mobile bottom navigation — shows only on small screens.
 * Single-color active state consistent with the teal accent system.
 */
export function BottomNav() {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-xl px-2 py-2 md:hidden"
      aria-label="Mobile navigation"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href, active }) => (
        <motion.a
          key={label}
          href={href}
          className={cn(
            "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl",
            active ? "text-[var(--accent-light)]" : "text-[var(--text-4)]"
          )}
          aria-current={active ? "page" : undefined}
          aria-label={label}
          variants={itemVariants}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          {/* Active background pill */}
          {active && (
            <motion.span
              layoutId="bottom-nav-pill"
              className="absolute inset-0 rounded-xl bg-[var(--accent-fill)] border border-[var(--accent-ring)]"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              aria-hidden="true"
            />
          )}

          <div className="relative">
            <Icon size={18} aria-hidden="true" />
          </div>
          <span className="relative text-[8px] font-semibold tracking-wide">{label}</span>
        </motion.a>
      ))}
    </motion.nav>
  );
}
