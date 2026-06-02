"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { GraduationCap, Inbox } from "lucide-react";
import type { Course } from "@/types";
import { CourseTile } from "./CourseTile";

interface CourseGridProps {
  courses: Course[];
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

/**
 * Section wrapping the grid of CourseTile cards.
 *
 * - Parent variants drive the stagger; CourseTile reads them via `variants` prop.
 * - Shows a polished empty state when no courses are returned.
 */
export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <section aria-labelledby="courses-heading">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-emerald-400" aria-hidden="true" />
          <h2
            id="courses-heading"
            className="text-sm font-semibold uppercase tracking-wider text-slate-400"
          >
            My Courses
          </h2>
        </div>
        <span className="text-[11px] text-slate-600">
          {courses.length} enrolled
        </span>
      </header>

      {courses.length === 0 ? (
        <EmptyCoursesState />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {courses.map((course, i) => (
            <CourseTile key={course.id} course={course} index={i} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

/**
 * Shown when the courses array is empty — either no data has been added
 * yet or Supabase returned zero rows.
 */
function EmptyCoursesState() {
  return (
    <motion.div
      className="glass-card flex flex-col items-center justify-center gap-3 py-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/8">
        <Inbox size={22} className="text-slate-500" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-300">No courses yet</p>
        <p className="text-[12px] text-slate-600 max-w-xs">
          Enrol in a course to start tracking your progress here.
        </p>
      </div>
    </motion.div>
  );
}
