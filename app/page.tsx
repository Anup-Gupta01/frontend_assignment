import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { CourseGridSkeleton } from "@/components/ui/Skeleton";
import { MOCK_USER, generateMockActivity } from "@/lib/mock-data";
import { getCourses } from "@/lib/data/courses";

// Separate async component so Suspense can stream it independently
async function CoursesSection() {
  const courses = await getCourses();
  return <CourseGrid courses={courses} />;
}

/**
 * Dashboard page — async Server Component.
 *
 * Data flow:
 *   Courses → Supabase via a streaming Suspense boundary (CourseGridSkeleton
 *             pulses while the fetch is in flight, then swaps in real data)
 *   User profile + activity → mock data until auth is wired up
 *
 * Nothing from the Supabase client or env vars is ever sent to the browser.
 */
export default function DashboardPage() {
  const activity = generateMockActivity();

  return (
    <DashboardShell user={MOCK_USER}>
      {/* Page-level padding */}
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">

        {/* ── Hero tile ───────────────────────────────────────────── */}
        <HeroTile user={MOCK_USER} />

        {/* ── Quick stats ─────────────────────────────────────────── */}
        <StatsRow user={MOCK_USER} />

        {/* ── Course grid — streams in after Supabase responds ────── */}
        <Suspense fallback={<CourseGridSkeleton count={4} />}>
          <CoursesSection />
        </Suspense>

        {/* ── Activity heatmap ────────────────────────────────────── */}
        <ActivityTile activity={activity} />

      </div>
    </DashboardShell>
  );
}
