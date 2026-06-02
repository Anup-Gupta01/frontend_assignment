"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { Course } from "@/types";
import { CourseTile } from "./CourseTile";

interface CourseGridProps {
  courses: Course[];
}

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.18,
    },
  },
};

/**
 * Section wrapping the grid of CourseTile cards.
 * Parent variants drive the stagger; each CourseTile receives the child variant.
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
    </section>
  );
}
