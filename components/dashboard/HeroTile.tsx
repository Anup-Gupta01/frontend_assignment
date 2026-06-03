"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Zap, TrendingUp } from "lucide-react";
import type { UserProfile } from "@/types";
import { StreakRing } from "@/components/ui/StreakRing";

interface HeroTileProps {
  user: UserProfile;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const spring = (delay = 0) => ({
  type: "spring" as const,
  stiffness: 300,
  damping: 26,
  delay,
});

export function HeroTile({ user }: HeroTileProps) {
  const firstName = user.name.split(" ")[0];

  return (
    <motion.article
      className="glass-card relative flex h-full min-h-[220px] flex-col justify-between gap-6 p-6 md:p-8"
      style={{
        /* mesh gradient background */
        background: `
          radial-gradient(ellipse 65% 55% at 10% 35%, rgba(20,184,166,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 45% at 90% 70%, rgba(20,184,166,0.04) 0%, transparent 55%),
          var(--bg-surface)
        `,
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring(0)}
      whileHover={{ y: -2 }}
      aria-labelledby="hero-greeting"
    >
      {/* Decorative orbs — contained within the card */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -60,
          top: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(20,184,166,0.12)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -20,
          left: "30%",
          width: 180,
          height: 120,
          borderRadius: "50%",
          background: "rgba(20,184,166,0.06)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Top row: text + streak ring ── */}
      <header className="relative flex items-start gap-4">
        {/* Left: all the text */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.06)}
            style={{ width: "fit-content" }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: "var(--accent-fill)",
                border: "1px solid var(--accent-ring)",
                color: "var(--accent-light)",
              }}
            >
              <Sparkles size={9} aria-hidden="true" />
              {getGreeting()}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-greeting"
            className="font-bold leading-tight tracking-tight"
            style={{
              fontSize: "clamp(22px, 3vw, 34px)",
              color: "var(--text-1)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.1)}
          >
            Welcome back,{" "}
            <span className="gradient-text">{firstName}</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--text-2)", maxWidth: 340 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.16)}
          >
            You&apos;re on a{" "}
            <strong style={{ color: "var(--accent-light)", fontWeight: 600 }}>
              {user.streak_days}-day streak
            </strong>
            . Keep it up — you&apos;re in the{" "}
            <strong style={{ color: "var(--accent-light)", fontWeight: 600 }}>
              top 5%
            </strong>{" "}
            this week.
          </motion.p>

          {/* Quick stats strip */}
          <motion.div
            className="flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.22)}
          >
            <span
              className="flex items-center gap-1.5 text-[11px]"
              style={{ color: "var(--text-3)" }}
            >
              <TrendingUp size={11} style={{ color: "var(--accent)" }} />
              <span className="font-mono" style={{ color: "var(--text-2)" }}>
                {user.total_xp.toLocaleString()}
              </span>
              &nbsp;XP total
            </span>
            <span
              style={{
                height: 12,
                width: 1,
                background: "var(--border)",
                display: "inline-block",
              }}
            />
            <span
              className="flex items-center gap-1.5 text-[11px]"
              style={{ color: "var(--text-3)" }}
            >
              <Zap size={10} style={{ color: "var(--accent)" }} />
              <span className="font-mono" style={{ color: "var(--text-2)" }}>
                #{user.rank}
              </span>
              &nbsp;global rank
            </span>
          </motion.div>
        </div>

        {/* Right: streak ring — fixed size, won't squish */}
        <motion.aside
          className="shrink-0 flex flex-col items-center gap-2"
          aria-label="Streak ring"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring(0.14)}
        >
          <StreakRing days={user.streak_days} size={88} />
          <span
            className="text-[9px] font-semibold uppercase"
            style={{
              color: "var(--text-3)",
              letterSpacing: "0.12em",
            }}
          >
            day streak
          </span>
        </motion.aside>
      </header>

      {/* ── CTA row ── */}
      <motion.footer
        className="relative flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring(0.28)}
      >
        <motion.button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
          style={{
            background: "var(--accent)",
            boxShadow: "0 4px 20px rgba(20,184,166,0.30)",
          }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 6px 28px rgba(20,184,166,0.45)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <Zap size={13} aria-hidden="true" />
          Continue Learning
          <ChevronRight size={13} aria-hidden="true" />
        </motion.button>

        <motion.button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[13px] font-medium"
          style={{
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-2)",
          }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255,255,255,0.08)",
            color: "var(--text-1)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          View Schedule
        </motion.button>
      </motion.footer>
    </motion.article>
  );
}
