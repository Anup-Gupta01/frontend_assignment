"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
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

/** Maps icon_name values stored in the DB to Lucide components. */
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
 * Variant for the card — inherits stagger delay from CourseGrid's parent container.
 * We use spring physics exclusively so the motion feels physical, not tweened.
 */
const tileVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
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
      className="glass-card group flex flex-col gap-4 p-5 cursor-pointer"
      variants={tileVariants}
      // whileHover drives elevation + border glow — transform + box-shadow only, no reflow
      whileHover={{
        y: -4,
        boxShadow: `0 16px 48px ${course.color}22, 0 0 0 1px ${course.color}33`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label={`Course: ${course.title}, ${progressPercent}% complete`}
    >
      {/* Header: icon + category badge */}
      <header className="flex items-start justify-between gap-3">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
          style={{
            background: `${course.color}20`,
            border: `1px solid ${course.color}40`,
          }}
          whileHover={{ scale: 1.12, rotate: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          <Icon
            size={18}
            style={{ color: course.color }}
            aria-hidden="true"
          />
        </motion.div>
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
          <motion.span
            className="font-mono text-[13px] font-bold"
            style={{ color: course.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.07 + 0.3 }}
          >
            {progressPercent}%
          </motion.span>
        </div>

        {/* Progress track */}
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
            style={{
              background: `linear-gradient(90deg, ${course.color}99, ${course.color})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              delay: index * 0.07 + 0.15,
            }}
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
