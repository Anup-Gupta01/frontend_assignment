"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Pulsing skeleton placeholder — safe to use while data is in flight.
 * Uses opacity animation only (no layout-triggering properties).
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={cn("rounded-lg bg-white/5", className)}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
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
    <section aria-busy="true" aria-label="Loading courses">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="glass-card flex flex-col gap-4 p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
              delay: i * 0.06,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
