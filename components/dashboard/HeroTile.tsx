"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import type { UserProfile } from "@/types";
import { StreakRing } from "@/components/ui/StreakRing";
import { Badge } from "@/components/ui/Badge";

interface HeroTileProps {
  user: UserProfile;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

/**
 * Large hero tile: personalised greeting, streak ring, motivational context.
 */
export function HeroTile({ user }: HeroTileProps) {
  return (
    <article className="mesh-bg glass-card relative overflow-hidden p-6 md:p-8 flex flex-col gap-6 min-h-[200px]">
      {/* Decorative background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-cyan-500/6 blur-3xl"
      />

      {/* Top row: greeting + streak */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="emerald" size="sm">
              <Sparkles size={10} />
              {greeting()}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold leading-tight text-white sm:text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Welcome back,{" "}
            <span className="gradient-text">{user.name.split(" ")[0]}</span> 👋
          </motion.h1>

          <motion.p
            className="text-sm text-slate-400 max-w-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            You&apos;re on a{" "}
            <strong className="text-emerald-400">{user.streak_days}-day</strong>{" "}
            learning streak. Keep it going — you&apos;re in the top{" "}
            <strong className="text-cyan-400">5%</strong> this week!
          </motion.p>
        </div>

        {/* Streak ring */}
        <aside className="flex flex-col items-center gap-1 shrink-0">
          <StreakRing days={user.streak_days} size={88} />
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
            Day streak
          </span>
        </aside>
      </header>

      {/* CTA row */}
      <motion.footer
        className="flex items-center gap-3 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:scale-105 active:scale-100"
        >
          Continue Learning
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
        >
          View Schedule
        </button>
      </motion.footer>
    </article>
  );
}
