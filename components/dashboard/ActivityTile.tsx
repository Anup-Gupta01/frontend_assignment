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

const LEVEL_COLORS = [
  "bg-white/4",            // 0 — empty
  "bg-emerald-900/70",     // 1 — light
  "bg-emerald-700/80",     // 2 — medium
  "bg-emerald-500/90",     // 3 — strong
  "bg-emerald-400",        // 4 — max
] as const;

const LEVEL_GLOW = [
  "",
  "",
  "shadow-[0_0_4px_rgba(16,185,129,0.3)]",
  "shadow-[0_0_6px_rgba(16,185,129,0.5)]",
  "shadow-[0_0_10px_rgba(16,185,129,0.8)]",
] as const;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * GitHub-style contribution heatmap showing 52 weeks of study activity.
 * Hover any cell for the date and minutes studied.
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

  // Month labels — derive from the first day of each week
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
      className="glass-card relative overflow-hidden p-5 md:p-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.22 }}
      whileHover={{ y: -2 }}
    >
      {/* Subtle background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-2xl"
      />

      {/* Header */}
      <header className="mb-5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" aria-hidden="true" />
          <h2
            id="activity-heading"
            className="text-sm font-semibold uppercase tracking-wider text-slate-400"
          >
            Learning Activity
          </h2>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>
            <strong className="text-emerald-400 font-mono">{totalHours}h</strong>{" "}
            studied
          </span>
          <span>
            <strong className="text-cyan-400 font-mono">{activeDays}</strong>{" "}
            active days
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
              className="absolute text-[10px] text-slate-600"
              style={{ left: 28 + week * 13 }}
            >
              {label}
            </span>
          ))}
          {/* spacer so height is correct */}
          <span className="invisible text-[10px]">Jan</span>
        </div>

        <div className="flex gap-1">
          {/* Day-of-week labels */}
          <div
            className="flex flex-col justify-around shrink-0"
            aria-hidden="true"
          >
            {DAY_LABELS.map((d, i) =>
              i % 2 === 1 ? (
                <span key={d} className="text-[9px] text-slate-600 leading-none">
                  {d}
                </span>
              ) : (
                <span key={d} className="text-[9px] invisible leading-none">
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
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.35 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: (wi * DAYS_PER_WEEK + di) * 0.0006,
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
        className="mt-3 flex items-center justify-end gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] text-slate-600">Less</span>
        {LEVEL_COLORS.map((cls, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
        ))}
        <span className="text-[10px] text-slate-600">More</span>
      </footer>

      {/* Tooltip — AnimatePresence gives it a smooth fade+scale entrance */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="heatmap-tooltip"
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full glass-card px-3 py-2 text-[11px] shadow-xl"
            style={{ left: tooltip.x + 5, top: tooltip.y - 8 }}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.88, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <p className="font-semibold text-white">
              {new Date(tooltip.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-slate-400">
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
