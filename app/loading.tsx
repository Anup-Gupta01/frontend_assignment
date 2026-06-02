import { CourseGridSkeleton } from "@/components/ui/Skeleton";

/**
 * Route-level loading UI — shown by Next.js while the page is streaming in.
 * Uses the same skeleton layout as the Suspense fallback so the shift
 * between loading → content feels seamless.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Hero skeleton */}
      <div className="glass-card h-[200px] animate-pulse bg-white/3 rounded-2xl" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-card h-24 animate-pulse bg-white/3 rounded-2xl"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>

      {/* Course grid skeleton */}
      <CourseGridSkeleton count={4} />

      {/* Activity heatmap skeleton */}
      <div className="glass-card h-48 animate-pulse bg-white/3 rounded-2xl" />
    </div>
  );
}
