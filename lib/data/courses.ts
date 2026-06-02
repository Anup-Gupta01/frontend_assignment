import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types";

// ── Types ─────────────────────────────────────────────────────

/**
 * Raw shape returned by Supabase — maps 1-to-1 with the `courses` table.
 * Keeping this separate from the UI's `Course` interface insulates component
 * code from schema changes.
 */
export interface CourseRow {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  instructor: string;
  color: string;
  category: string;
  total_lessons: number;
  completed_lessons: number;
  created_at: string;
}

/** Maps a raw DB row to the Course shape the UI expects. */
function rowToCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    progress: row.progress,
    icon: row.icon_name,
    instructor: row.instructor,
    color: row.color,
    category: row.category,
    total_lessons: row.total_lessons,
    completed_lessons: row.completed_lessons,
    created_at: row.created_at,
  };
}

// ── Result type ────────────────────────────────────────────────

/**
 * Typed fetch result — lets callers distinguish between "no data" and
 * "fetch failed" without catching exceptions.
 */
export type CoursesResult =
  | { ok: true;  courses: Course[] }
  | { ok: false; message: string  };

// ── Queries ───────────────────────────────────────────────────

/**
 * Fetch all courses ordered by creation date, ascending.
 *
 * Runs **server-only** — the Supabase client here uses `@supabase/ssr`'s
 * server helper so credentials never leave the backend.
 */
export async function getCourses(): Promise<CoursesResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true })
    .returns<CourseRow[]>();

  if (error) {
    console.error("[getCourses] Supabase error:", error.message);
    return { ok: false, message: error.message };
  }

  return { ok: true, courses: (data ?? []).map(rowToCourse) };
}
