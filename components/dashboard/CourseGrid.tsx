import { GraduationCap } from "lucide-react";
import type { Course } from "@/types";
import { CourseTile } from "./CourseTile";

interface CourseGridProps {
  courses: Course[];
}

/**
 * Section wrapping the grid of CourseTile cards.
 * Data will be fetched from Supabase once env vars are configured.
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course, i) => (
          <CourseTile key={course.id} course={course} index={i} />
        ))}
      </div>
    </section>
  );
}
