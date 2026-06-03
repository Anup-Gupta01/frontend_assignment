import { CourseGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Route-level loading UI.
 *
 * Mirrors the Bento Grid structure of the actual page so the transition
 * from loading → content produces no layout shift.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8">
      <div className="bento-grid">

        {/* Hero skeleton */}
        <div className="bento-hero glass-card min-h-[220px] skeleton" />

        {/* Stats column skeleton */}
        <div className="bento-stats-col bento-stat grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="glass-card h-28 skeleton"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Course grid skeleton */}
        <div className="bento-courses">
          <CourseGridSkeleton count={4} />
        </div>

        {/* Activity heatmap skeleton */}
        <div className="bento-activity glass-card h-52 skeleton" />

      </div>
    </div>
  );
}
