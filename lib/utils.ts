import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with K/M suffix (e.g. 12500 → "12.5K")
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate an ISO date string for N days ago.
 */
export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

/**
 * Get a deterministic activity level (0–4) from minutes.
 */
export function activityLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes === 0) return 0;
  if (minutes < 30)  return 1;
  if (minutes < 60)  return 2;
  if (minutes < 120) return 3;
  return 4;
}
