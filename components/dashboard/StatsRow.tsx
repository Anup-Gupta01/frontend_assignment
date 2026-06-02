"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface StatsRowProps {
  user: UserProfile;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

/**
 * Row of three quick-stat cards: XP earned, hours studied, leaderboard rank.
 */
export function StatsRow({ user }: StatsRowProps) {
  const stats = [
    {
      label: "Total XP",
      value: formatNumber(user.total_xp),
      sub: "+820 this week",
      trend: "up" as const,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
      textColor: "text-emerald-400",
      glowColor: "rgba(16,185,129,0.25)",
    },
    {
      label: "Hours Studied",
      value: user.hours_studied,
      sub: "+12.5 this week",
      trend: "up" as const,
      gradient: "from-cyan-500/20 to-cyan-500/5",
      border: "border-cyan-500/20",
      textColor: "text-cyan-400",
      glowColor: "rgba(6,182,212,0.25)",
    },
    {
      label: "Rank",
      value: `#${user.rank}`,
      sub: "↑ 3 positions",
      trend: "up" as const,
      gradient: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
      textColor: "text-violet-400",
      glowColor: "rgba(139,92,246,0.25)",
    },
  ];

  return (
    <motion.section
      aria-label="Quick statistics"
      className="grid grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <motion.article
          key={stat.label}
          className={`glass-card bg-gradient-to-br ${stat.gradient} ${stat.border} p-4 flex flex-col gap-1 cursor-default`}
          variants={cardVariants}
          whileHover={{
            y: -3,
            boxShadow: `0 12px 40px ${stat.glowColor}`,
            borderColor: stat.glowColor,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          aria-label={`${stat.label}: ${stat.value}`}
        >
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {stat.label}
          </span>
          <span className={`font-mono text-2xl font-bold ${stat.textColor}`}>
            {stat.value}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            {stat.trend === "up" ? (
              <TrendingUp size={11} className="text-emerald-500" />
            ) : (
              <TrendingDown size={11} className="text-red-500" />
            )}
            {stat.sub}
          </span>
        </motion.article>
      ))}
    </motion.section>
  );
}
