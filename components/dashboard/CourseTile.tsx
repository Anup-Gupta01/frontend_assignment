"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Atom,
  Cpu,
  Network,
  Calculator,
  Code,
  BookOpen,
} from "lucide-react";
import type { Course } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface CourseTileProps {
  course: Course;
  index: number;
}

/** Maps Lucide icon names (stored in DB) to components */
const iconMap: Record<string, React.ElementType> = {
  Brain,
  Atom,
  Cpu,
  Network,
  Calculator,
  Code,
  BookOpen,
};

/**
 * Individual course card with progress bar, icon, and metadata.
 */
export function CourseTile({ course, index }: CourseTileProps) {
  const Icon = iconMap[course.icon] ?? BookOpen;
  const progressPercent = Math.round(course.progress);
  const remaining = course.total_lessons - course.completed_lessons;

  return (
    <motion.article
      className="glass-card glass-card-hover group flex flex-col gap-4 p-5 cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      aria-label={`Course: ${course.title}, ${progressPercent}% complete`}
    >
      {/* Header: icon + category badge */}
      <header className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-110"
          style={{
            background: `${course.color}20`,
            border: `1px solid ${course.color}40`,
          }}
        >
          <Icon
            size={18}
            style={{ color: course.color }}
            aria-hidden="true"
          />
        </div>
        <Badge variant="muted" size="sm">
          {course.category}
        </Badge>
      </header>

      {/* Title & instructor */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
          {course.title}
        </h3>
        <p className="text-[12px] text-slate-500">{course.instructor}</p>
      </div>

      {/* Progress */}
      <footer className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {course.completed_lessons}/{course.total_lessons} lessons
          </span>
          <span
            className="font-mono text-[13px] font-bold"
            style={{ color: course.color }}
          >
            {progressPercent}%
          </span>
        </div>
        {/* Progress bar */}
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/8"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progressPercent}% complete`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${course.color}aa, ${course.color})` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, delay: 0.1 * index, ease: "easeOut" }}
          />
        </div>
        {remaining > 0 && (
          <p className="text-[10px] text-slate-600">
            {remaining} lessons remaining
          </p>
        )}
      </footer>
    </motion.article>
  );
}
