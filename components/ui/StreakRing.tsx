"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakRingProps {
  days: number;
  size?: number;
}

/**
 * Animated SVG ring with a flame icon and streak count.
 * Uses the accent teal family — consistent with the single-color system.
 */
export function StreakRing({ days, size = 88 }: StreakRingProps) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Cap ring fill at 30 days
  const progress = Math.min(days / 30, 1);
  const dashOffset = circumference * (1 - progress);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ scale: 0.82, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.28 }}
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
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#streakGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.45 }}
        />
        <defs>
          <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-0.5">
        <Flame
          size={15}
          className="text-[var(--accent-light)]"
          style={{ filter: "drop-shadow(0 0 6px rgba(20,184,166,0.65))" }}
          aria-hidden="true"
        />
        <span
          className="font-mono text-[17px] font-bold leading-none text-[var(--text-1)]"
          aria-label={`${days} day streak`}
        >
          {days}
        </span>
      </div>
    </motion.div>
  );
}
