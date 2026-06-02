import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { CourseGridSkeleton } from "@/components/ui/Skeleton";
import { CoursesSectionError } from "@/components/ui/ErrorState";
import { MOCK_USER, generateMockActivity } from "@/lib/mock-data";
import { getCourses } from "@/lib/data/courses";

/**
 * Async Server Component that fetches and renders the courses section.
 * Lives in its own component so Suspense can stream it without blocking
 * the rest of the page (hero, stats, activity render immediately).
 */
async function CoursesSection() {
  const result = await getCourses();

  if (!result.ok) {
    // Supabase returned an error — show the error UI instead of crashing
    return <CoursesSectionError />;
  }

  return <CourseGrid courses={result.courses} />;
}

/**
 * Dashboard page — Server Component.
 *
 * Data flow:
 *   Courses     → Supabase (server-only, @supabase/ssr, streamed via Suspense)
 *   User + activity → mock data until auth is wired up
 *
 * Nothing from the Supabase client or env vars is sent to the browser.
 */
export default function DashboardPage() {
  const activity = generateMockActivity();

  return (
    <DashboardShell user={MOCK_USER}>
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">

        {/* Hero — renders immediately, no async dependency */}
        <HeroTile user={MOCK_USER} />

        {/* Quick stats — same */}
        <StatsRow user={MOCK_USER} />

        {/*
         * Course grid — streams in once Supabase responds.
         * The skeleton pulses until data (or an error) arrives.
         */}
        <Suspense fallback={<CourseGridSkeleton count={4} />}>
          <CoursesSection />
        </Suspense>

        {/* Activity heatmap — generated from mock data, instant */}
        <ActivityTile activity={activity} />

      </div>
    </DashboardShell>
  );
}
