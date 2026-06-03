"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  /** Human-readable message shown below the icon. */
  message?: string;
  /** If provided, renders a retry button that calls this function. */
  onRetry?: () => void;
}

/**
 * Reusable error fallback UI.
 * Keeps error presentation consistent across the app without repeating JSX.
 */
export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center"
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
        <AlertTriangle size={20} className="text-rose-400" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-medium text-[var(--text-1)]">Something went wrong</p>
        <p className="text-[11px] text-[var(--text-3)] max-w-xs">{message}</p>
      </div>

      {onRetry && (
        <motion.button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-[var(--text-2)] hover:bg-white/[0.08] hover:text-[var(--text-1)] transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <RefreshCw size={11} aria-hidden="true" />
          Try again
        </motion.button>
      )}
    </motion.div>
  );
}

/**
 * Wrapper specifically for the courses section when Supabase returns an error.
 * Slots into the same space the CourseGrid would occupy.
 */
export function CoursesSectionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <section
      className="glass-card p-5 md:p-6"
      aria-labelledby="courses-error-heading"
    >
      <div className="mb-5">
        <h2
          id="courses-error-heading"
          className="section-label"
        >
          My Courses
        </h2>
      </div>
      <ErrorState
        message="Couldn't load your courses. Check your connection or Supabase configuration."
        onRetry={onRetry}
      />
    </section>
  );
}
