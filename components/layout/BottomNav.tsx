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
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 24 },
  },
};

/**
 * Mobile bottom navigation bar — shows only on small screens.
 * Uses a shared layoutId background pill for the active item so tapping
 * between routes animates the highlight with spring physics.
 */
export function BottomNav() {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/8 bg-[var(--bg-surface)]/95 backdrop-blur-md px-2 py-2 md:hidden"
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
            "relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg",
            active ? "text-emerald-400" : "text-slate-600"
          )}
          aria-current={active ? "page" : undefined}
          aria-label={label}
          variants={itemVariants}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {/* Shared animated background pill */}
          {active && (
            <motion.span
              layoutId="bottom-nav-pill"
              className="absolute inset-0 rounded-lg bg-emerald-500/12"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              aria-hidden="true"
            />
          )}

          <motion.div
            animate={active ? { y: [0, -2, 0] } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <Icon size={20} aria-hidden="true" />
          </motion.div>
          <span className="relative text-[9px] font-medium">{label}</span>
        </motion.a>
      ))}
    </motion.nav>
  );
}
