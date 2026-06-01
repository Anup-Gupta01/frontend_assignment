"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakRingProps {
  days: number;
  size?: number;
}

/**
 * Animated SVG ring with a flame icon and streak count.
 * Uses a circular progress arc to visualise the streak.
 */
export function StreakRing({ days, size = 88 }: StreakRingProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  // Cap ring fill at 30 days
  const progress = Math.min(days / 30, 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
    >
      {/* Background ring */}
      <svg
        width={size}
        height={size}
        className="absolute rotate-[-90deg]"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={4}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#streakGradient)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-0.5">
        <Flame
          size={18}
          className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          aria-hidden="true"
        />
        <span
          className="font-mono text-lg font-bold leading-none text-white"
          aria-label={`${days} day streak`}
        >
          {days}
        </span>
      </div>
    </motion.div>
  );
}
