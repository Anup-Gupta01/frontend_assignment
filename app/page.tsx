import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { MOCK_USER, MOCK_COURSES, generateMockActivity } from "@/lib/mock-data";

/**
 * Dashboard page — Server Component.
 *
 * Data flow:
 *   • Currently uses mock data so the UI works without a Supabase project.
 *   • When you're ready to wire up real data:
 *       1. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
 *       2. Replace MOCK_COURSES with: const { data: courses } = await supabase.from("courses").select("*")
 *       3. Replace MOCK_USER with a real auth.getUser() call
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

        {/* ── Course grid ─────────────────────────────────────────── */}
        <CourseGrid courses={MOCK_COURSES} />

        {/* ── Activity heatmap ────────────────────────────────────── */}
        <ActivityTile activity={activity} />

      </div>
    </DashboardShell>
  );
}
