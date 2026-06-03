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
      staggerChildren: 0.065,
      delayChildren: 0.06,
    },
  },
};

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <section
      aria-labelledby="courses-heading"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 20px",
      }}
    >
      {/* Section header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "var(--accent-fill)",
              border: "1px solid var(--accent-ring)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GraduationCap
              size={13}
              style={{ color: "var(--accent-light)" }}
              aria-hidden="true"
            />
          </div>
          <h2
            id="courses-heading"
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              color: "var(--text-2)",
            }}
          >
            My Courses
          </h2>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "var(--text-3)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {courses.length} enrolled
        </span>
      </header>

      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
          }}
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

function EmptyState() {
  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "56px 0",
        textAlign: "center",
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Inbox size={20} style={{ color: "var(--text-3)" }} aria-hidden="true" />
      </div>
      <div>
        <p
          style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)", marginBottom: 4 }}
        >
          No courses yet
        </p>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>
          Enrol in a course to start tracking your progress here.
        </p>
      </div>
    </motion.div>
  );
}
