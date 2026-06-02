import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { MOCK_USER, generateMockActivity } from "@/lib/mock-data";
import { getCourses } from "@/lib/data/courses";

/**
 * Dashboard page — async Server Component.
 *
 * Data flow:
 *   Courses → Supabase (server-only, via @supabase/ssr)
 *   User profile + activity → mock data until auth is wired up
 *
 * Nothing from the Supabase client or env vars is ever sent to the browser.
 */
export default async function DashboardPage() {
  const [courses, activity] = await Promise.all([
    getCourses(),
    Promise.resolve(generateMockActivity()),
  ]);

  return (
    <DashboardShell user={MOCK_USER}>
      {/* Page-level padding */}
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">

        {/* ── Hero tile ───────────────────────────────────────────── */}
        <HeroTile user={MOCK_USER} />

        {/* ── Quick stats ─────────────────────────────────────────── */}
        <StatsRow user={MOCK_USER} />

        {/* ── Course grid (live from Supabase) ────────────────────── */}
        <CourseGrid courses={courses} />

        {/* ── Activity heatmap ────────────────────────────────────── */}
        <ActivityTile activity={activity} />

      </div>
    </DashboardShell>
  );
}
