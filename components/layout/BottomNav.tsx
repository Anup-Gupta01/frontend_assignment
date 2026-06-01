"use client";

import { LayoutDashboard, GraduationCap, BarChart3, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home",     icon: LayoutDashboard, href: "#", active: true  },
  { label: "Courses",  icon: GraduationCap,   href: "#", active: false },
  { label: "Progress", icon: BarChart3,        href: "#", active: false },
  { label: "Calendar", icon: Calendar,         href: "#", active: false },
  { label: "Settings", icon: Settings,         href: "#", active: false },
];

/**
 * Mobile bottom navigation bar — shows only on small screens.
 */
export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/8 bg-[var(--bg-surface)]/95 backdrop-blur-md px-2 py-2 md:hidden"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ label, icon: Icon, href, active }) => (
        <a
          key={label}
          href={href}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all",
            active ? "text-emerald-400" : "text-slate-600 hover:text-slate-300"
          )}
          aria-current={active ? "page" : undefined}
          aria-label={label}
        >
          <Icon size={20} aria-hidden="true" />
          <span className="text-[9px] font-medium">{label}</span>
        </a>
      ))}
    </nav>
  );
}
