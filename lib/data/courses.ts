import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types";

// ── Types ─────────────────────────────────────────────────────

/**
 * Raw shape returned by Supabase — maps 1-to-1 with the `courses` table.
 * Keeping this separate from the UI's `Course` interface makes it easy
 * to handle schema drift without touching component code.
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

// ── Queries ───────────────────────────────────────────────────

/**
 * Fetch all courses ordered by creation date, newest last.
 *
 * This runs **only on the server** — the Supabase client created here uses
 * `@supabase/ssr`'s server helper, so no secrets ever leave the backend.
 *
 * Returns an empty array on error rather than throwing, so the page can
 * degrade gracefully (e.g. show an empty state) instead of crashing.
 */
export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true })
    .returns<CourseRow[]>();

  if (error) {
    // Log server-side so nothing leaks to the client bundle.
    console.error("[getCourses] Supabase query failed:", error.message);
    return [];
  }

  return (data ?? []).map(rowToCourse);
}
