"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import type { ActivityDay } from "@/types";
import { activityLevel } from "@/lib/utils";

interface ActivityTileProps {
  activity: ActivityDay[];
}

// 52 weeks × 7 days = 364 cells
const WEEKS = 52;
const DAYS_PER_WEEK = 7;

// Teal-only level progression — no scattered colors
const LEVEL_COLORS = [
  "bg-white/[0.04]",           // 0 — empty
  "bg-teal-900/60",            // 1 — light
  "bg-teal-700/70",            // 2 — medium
  "bg-teal-500/85",            // 3 — strong
  "bg-teal-400",               // 4 — max
] as const;

const LEVEL_GLOW = [
  "",
  "",
  "shadow-[0_0_4px_rgba(20,184,166,0.25)]",
  "shadow-[0_0_6px_rgba(20,184,166,0.42)]",
  "shadow-[0_0_9px_rgba(20,184,166,0.65)]",
] as const;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * GitHub-style contribution heatmap — 52 weeks of study activity.
 * Uses teal-only progression, consistent with the rest of the design system.
 */
export function ActivityTile({ activity }: ActivityTileProps) {
  const [tooltip, setTooltip] = useState<{
    date: string;
    minutes: number;
    x: number;
    y: number;
  } | null>(null);

  // Build a lookup map by date string
  const activityMap = new Map(
    activity.map((d) => [d.date, d.minutes_studied])
  );

  // Organise into weeks (columns) × days (rows)
  const weeks: ActivityDay[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: ActivityDay[] = [];
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const cell = activity[w * DAYS_PER_WEEK + d];
      week.push(cell ?? { date: "", minutes_studied: 0 });
    }
    weeks.push(week);
  }

  // Month labels
  const monthPositions: { label: string; week: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const first = week.find((d) => d.date);
    if (!first) return;
    const date = new Date(first.date);
    const month = date.getMonth();
    if (month !== lastMonth) {
      monthPositions.push({
        label: date.toLocaleString("default", { month: "short" }),
        week: wi,
      });
      lastMonth = month;
    }
  });

  const totalMinutes = activity.reduce((s, d) => s + d.minutes_studied, 0);
  const totalHours = Math.round(totalMinutes / 60);
  const activeDays = activity.filter((d) => d.minutes_studied > 0).length;

  return (
    <motion.section
      aria-labelledby="activity-heading"
      className="glass-card relative p-5 md:p-6"
      style={{ overflow: "visible" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.2 }}
      whileHover={{ y: -2 }}
    >
      {/* Subtle background orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-[var(--accent-glow)] blur-3xl opacity-50"
      />

      {/* Header */}
      <header className="mb-5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--accent-fill)] border border-[var(--accent-ring)]">
            <Activity size={12} className="text-[var(--accent-light)]" aria-hidden="true" />
          </div>
          <h2
            id="activity-heading"
            className="section-label"
          >
            Learning Activity
          </h2>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[var(--text-3)]">
          <span>
            <strong className="font-mono text-[var(--accent-light)]">{totalHours}h</strong>
            {" "}studied
          </span>
          <span className="h-3 w-px bg-[var(--border)]" />
          <span>
            <strong className="font-mono text-[var(--accent-light)]">{activeDays}</strong>
            {" "}active days
          </span>
        </div>
      </header>

      {/* Heatmap container */}
      <div className="relative overflow-x-auto pb-1">
        {/* Month labels */}
        <div
          className="mb-1 flex"
          style={{ paddingLeft: 28 }}
          aria-hidden="true"
        >
          {monthPositions.map(({ label, week }) => (
            <span
              key={`${label}-${week}`}
              className="absolute text-[9px] text-[var(--text-3)]"
              style={{ left: 28 + week * 13 }}
            >
              {label}
            </span>
          ))}
          {/* height spacer */}
          <span className="invisible text-[9px]">Jan</span>
        </div>

        <div className="flex gap-1">
          {/* Day-of-week labels */}
          <div
            className="flex flex-col justify-around shrink-0"
            aria-hidden="true"
          >
            {DAY_LABELS.map((d, i) =>
              i % 2 === 1 ? (
                <span key={d} className="text-[8px] text-[var(--text-4)] leading-none">
                  {d}
                </span>
              ) : (
                <span key={d} className="text-[8px] invisible leading-none">
                  {d}
                </span>
              )
            )}
          </div>

          {/* Grid of cells */}
          <div className="flex gap-[3px]" role="grid" aria-label="Activity grid">
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="flex flex-col gap-[3px]"
                role="row"
              >
                {week.map((day, di) => {
                  const level = activityLevel(day.minutes_studied);
                  return (
                    <motion.div
                      key={`${wi}-${di}`}
                      role="gridcell"
                      aria-label={
                        day.date
                          ? `${day.date}: ${day.minutes_studied} minutes`
                          : "No data"
                      }
                      className={[
                        "h-[10px] w-[10px] rounded-[2px] cursor-pointer",
                        LEVEL_COLORS[level],
                        LEVEL_GLOW[level],
                      ].join(" ")}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.4 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                        delay: (wi * DAYS_PER_WEEK + di) * 0.0005,
                      }}
                      onMouseEnter={(e) => {
                        if (!day.date) return;
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setTooltip({
                          date: day.date,
                          minutes: day.minutes_studied,
                          x: rect.left,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <footer
        className="mt-3 flex items-center justify-end gap-1.5"
        aria-hidden="true"
      >
        <span className="text-[9px] text-[var(--text-4)] mr-0.5">Less</span>
        {LEVEL_COLORS.map((cls, i) => (
          <div key={i} className={`h-[9px] w-[9px] rounded-[2px] ${cls}`} />
        ))}
        <span className="text-[9px] text-[var(--text-4)] ml-0.5">More</span>
      </footer>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="heatmap-tooltip"
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full glass-elevated px-3 py-2 text-[11px] shadow-xl"
            style={{ left: tooltip.x + 5, top: tooltip.y - 8 }}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <p className="font-semibold text-[var(--text-1)]">
              {new Date(tooltip.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-[var(--text-3)]">
              {tooltip.minutes > 0
                ? `${tooltip.minutes} min studied`
                : "No activity"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
