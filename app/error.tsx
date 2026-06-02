"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error boundary — catches unhandled errors thrown during
 * Server Component rendering and gives the user a way to recover.
 *
 * Must be a Client Component (Next.js requirement for error boundaries).
 */
export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to a monitoring service in production (e.g. Sentry)
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md">
        <ErrorState
          message={
            process.env.NODE_ENV === "development"
              ? error.message
              : "An unexpected error occurred. Please refresh the page."
          }
          onRetry={reset}
        />
      </div>
    </div>
  );
}
