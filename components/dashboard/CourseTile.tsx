"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Brain,
  Atom,
  Cpu,
  Network,
  Calculator,
  Code,
  BookOpen,
  FlaskConical,
  Globe,
  Layers,
  Lightbulb,
  Music,
  Palette,
  Sigma,
  Terminal,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { Course } from "@/types";
import { Badge } from "@/components/ui/Badge";

// ── Icon registry ─────────────────────────────────────────────
//
// Keys match the `icon_name` values stored in Supabase.
// Unknown names fall back to BookOpen — nothing crashes.

type IconComponent = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

const ICON_MAP: Record<string, IconComponent> = {
  Brain,
  Atom,
  Cpu,
  Network,
  Calculator,
  Code,
  BookOpen,
  FlaskConical,
  Globe,
  Layers,
  Lightbulb,
  Music,
  Palette,
  Sigma,
  Terminal,
};

function resolveIcon(name: string): IconComponent {
  return ICON_MAP[name] ?? BookOpen;
}

// ── Animation variants ────────────────────────────────────────

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

// ── Sub-components ────────────────────────────────────────────

interface ProgressBarProps {
  value: number;   // 0–100
  color: string;
  delay: number;
}

/**
 * Animated progress bar — springs from 0 to `value` the first time
 * the element enters the viewport (useful when the grid is scrolled into view).
 */
function ProgressBar({ value, color, delay }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/8"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% complete`}
    >
      <motion.div
        className="h-full rounded-full will-change-transform"
        style={{
          background: `linear-gradient(90deg, ${color}80, ${color})`,
        }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 18,
          delay,
        }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface CourseTileProps {
  course: Course;
  index: number;
}

/**
 * Individual course card with:
 * - Dynamic icon resolved from `course.icon` (falls back to BookOpen)
 * - Abstract grain texture pseudo-element for depth
 * - Animated progress bar driven by viewport entry
 * - Per-card accent glow on hover derived from `course.color`
 */
export function CourseTile({ course, index }: CourseTileProps) {
  const Icon = resolveIcon(course.icon);
  const pct  = Math.round(course.progress);
  const done = course.completed_lessons;
  const total = course.total_lessons;
  const remaining = total - done;

  // Stagger delay: each card is slightly later than the previous
  const progressDelay = index * 0.06 + 0.2;

  return (
    <motion.article
      className="card-grain glass-card relative flex flex-col gap-4 p-5 cursor-pointer overflow-hidden"
      variants={tileVariants}
      whileHover={{
        y: -4,
        boxShadow: `0 16px 48px ${course.color}25, 0 0 0 1px ${course.color}30`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      aria-label={`${course.title} — ${pct}% complete`}
    >
      {/*
       * Abstract radial mesh — a soft orb in the top-right corner using the
       * card's accent colour. Pure CSS, no external assets.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
        style={{ background: `${course.color}14` }}
      />

      {/* ── Header: icon + category ── */}
      <header className="relative flex items-start justify-between gap-3">
        <motion.div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `${course.color}18`,
            border: `1px solid ${course.color}35`,
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          <Icon size={18} style={{ color: course.color }} aria-hidden="true" />
        </motion.div>

        <Badge variant="muted" size="sm">
          {course.category}
        </Badge>
      </header>

      {/* ── Title + instructor ── */}
      <div className="relative flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
          {course.title}
        </h3>
        <p className="text-[12px] text-slate-500">{course.instructor}</p>
      </div>

      {/* ── Progress section ── */}
      <footer className="relative mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {done}/{total} lessons
          </span>
          <span
            className="font-mono text-[13px] font-bold"
            style={{ color: course.color }}
          >
            {pct}%
          </span>
        </div>

        <ProgressBar value={pct} color={course.color} delay={progressDelay} />

        {remaining > 0 && (
          <p className="text-[10px] text-slate-600">
            {remaining} lesson{remaining !== 1 ? "s" : ""} remaining
          </p>
        )}
      </footer>
    </motion.article>
  );
}
