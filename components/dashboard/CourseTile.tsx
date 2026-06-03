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

// ── Icon registry ─────────────────────────────────────────────

type IconComponent = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

const ICON_MAP: Record<string, IconComponent> = {
  Brain, Atom, Cpu, Network, Calculator, Code, BookOpen,
  FlaskConical, Globe, Layers, Lightbulb, Music, Palette, Sigma, Terminal,
};

function resolveIcon(name: string): IconComponent {
  return ICON_MAP[name] ?? BookOpen;
}

// ── Animation variants ────────────────────────────────────────

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 26 },
  },
};

// ── Progress bar ──────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  delay: number;
}

function ProgressBar({ value, delay }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="h-[3px] w-full overflow-hidden rounded-full"
      style={{ background: "rgba(255,255,255,0.06)" }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% complete`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, var(--accent-dim), var(--accent-light))",
        }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 18, delay }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

interface CourseTileProps {
  course: Course;
  index: number;
}

export function CourseTile({ course, index }: CourseTileProps) {
  const Icon = resolveIcon(course.icon);
  const pct = Math.round(course.progress);
  const done = course.completed_lessons;
  const total = course.total_lessons;
  const remaining = total - done;
  const progressDelay = index * 0.05 + 0.15;

  return (
    <motion.article
      className="glass-card relative flex flex-col p-5 cursor-pointer"
      style={{ overflow: "visible" }}
      variants={tileVariants}
      whileHover={{
        y: -3,
        boxShadow:
          "0 12px 40px rgba(20,184,166,0.13), 0 0 0 1px rgba(20,184,166,0.22)",
        borderColor: "rgba(20,184,166,0.22)",
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      aria-label={`${course.title} — ${pct}% complete`}
    >
      {/* Subtle teal orb behind the card — won't clip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl"
        style={{
          background: "var(--accent-glow)",
          opacity: 0.5,
          zIndex: -1,
        }}
      />

      {/* ── Header: icon + category badge ── */}
      <header className="flex items-center justify-between gap-2 mb-4">
        {/* Icon */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "var(--accent-fill)",
            border: "1px solid var(--accent-ring)",
          }}
        >
          <Icon
            size={16}
            style={{ color: "var(--accent-light)" }}
            aria-hidden="true"
          />
        </div>

        {/* Category — truncates if too long */}
        <span
          className="min-w-0 truncate rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "var(--text-3)",
            maxWidth: "calc(100% - 48px)",
          }}
          title={course.category}
        >
          {course.category}
        </span>
      </header>

      {/* ── Title + instructor ── */}
      <div className="flex flex-col gap-1 flex-1 mb-4">
        <h3
          className="text-[13px] font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--text-1)" }}
        >
          {course.title}
        </h3>
        <p className="text-[11px] truncate" style={{ color: "var(--text-3)" }}>
          {course.instructor}
        </p>
      </div>

      {/* ── Progress section ── */}
      <footer className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px]" style={{ color: "var(--text-3)" }}>
            {done}/{total} lessons
          </span>
          <span
            className="font-mono text-[12px] font-bold shrink-0"
            style={{ color: "var(--accent-light)" }}
          >
            {pct}%
          </span>
        </div>

        <ProgressBar value={pct} delay={progressDelay} />

        {remaining > 0 && (
          <p className="text-[10px]" style={{ color: "var(--text-4)" }}>
            {remaining} lesson{remaining !== 1 ? "s" : ""} remaining
          </p>
        )}
      </footer>
    </motion.article>
  );
}
