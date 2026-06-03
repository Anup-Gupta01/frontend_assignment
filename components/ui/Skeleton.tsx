"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Pulsing skeleton placeholder — safe to use while data is in flight.
 * Uses the shimmer CSS utility class from globals.css.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-lg skeleton", className)}
      aria-hidden="true"
    />
  );
}

interface CourseGridSkeletonProps {
  count?: number;
}

/** Skeleton stand-in for the course grid while Supabase data loads. */
export function CourseGridSkeleton({ count = 4 }: CourseGridSkeletonProps) {
  return (
    <section
      className="glass-card p-5 md:p-6"
      aria-busy="true"
      aria-label="Loading courses"
    >
      <div className="mb-5 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="glass-card flex flex-col gap-4 p-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 26,
              delay: i * 0.055,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-[3px] w-full rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
