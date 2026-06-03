import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeroTile } from "@/components/dashboard/HeroTile";
import { StatCard } from "@/components/dashboard/StatCard";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { ActivityTile } from "@/components/dashboard/ActivityTile";
import { CourseGridSkeleton } from "@/components/ui/Skeleton";
import { CoursesSectionError } from "@/components/ui/ErrorState";
import { MOCK_USER, generateMockActivity } from "@/lib/mock-data";
import { getCourses } from "@/lib/data/courses";
import { formatNumber } from "@/lib/utils";

// ── Async island: only this waits on Supabase ─────────────────
async function CoursesSection() {
  const result = await getCourses();
  if (!result.ok) return <CoursesSectionError />;
  return <CourseGrid courses={result.courses} />;
}

/**
 * Dashboard page — Server Component.
 *
 * Layout: Bento Grid
 *   ┌──────────────────────────┬───────────┐
 *   │  Hero (8 cols)           │  XP       │
 *   │                          │  Hours    │
 *   │                          │  Rank     │
 *   ├──────────────────────────┴───────────┤
 *   │  Course Grid (12 cols, 3-up)         │
 *   ├──────────────────────────────────────┤
 *   │  Activity Heatmap (12 cols)          │
 *   └──────────────────────────────────────┘
 *
 * Data flow:
 *   Courses → Supabase server-side, streamed via Suspense
 *   Everything else → mock data (no async blocking)
 */
export default function DashboardPage() {
  const activity = generateMockActivity();
  const user = MOCK_USER;

  const stats = [
    {
      label: "Total XP",
      value: formatNumber(user.total_xp),
      sub: "+820 this week",
      trend: "up" as const,
      color: "#14b8a6",
    },
    {
      label: "Hours Studied",
      value: String(user.hours_studied),
      sub: "+12.5 this week",
      trend: "up" as const,
      color: "#14b8a6",
    },
    {
      label: "Global Rank",
      value: `#${user.rank}`,
      sub: "↑ 3 positions",
      trend: "up" as const,
      color: "#14b8a6",
    },
  ] as const;

  return (
    <DashboardShell user={user}>
      {/*
       * max-w-screen-2xl keeps the grid from stretching too wide on 4K screens.
       * padding is uniform so the bento tiles never touch the viewport edge.
       */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8">
        <div className="bento-grid">

          {/* ── Hero tile — spans 8 of 12 cols on desktop ── */}
          <div className="bento-hero">
            <HeroTile user={user} />
          </div>

          {/*
           * ── Stats column — 3 stacked cards, right column on desktop
           * bento-stats-col sets display:flex flex-col at ≥1024px
           * bento-stat is the span-4 fallback on mobile/tablet
           */}
          <div className="bento-stats-col bento-stat" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>

          {/* ── Course grid — Supabase data streamed in via Suspense ── */}
          <div className="bento-courses">
            <Suspense fallback={<CourseGridSkeleton count={4} />}>
              <CoursesSection />
            </Suspense>
          </div>

          {/* ── Activity heatmap — mock data, renders immediately ── */}
          <div className="bento-activity">
            <ActivityTile activity={activity} />
          </div>

        </div>
      </div>
    </DashboardShell>
  );
}
