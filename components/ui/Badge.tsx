import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "emerald" | "cyan" | "purple" | "amber" | "muted";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<string, string> = {
  accent:  "bg-[var(--accent-fill)] text-[var(--accent-light)] border border-[var(--accent-ring)]",
  emerald: "bg-[var(--accent-fill)] text-[var(--accent-light)] border border-[var(--accent-ring)]",
  cyan:    "bg-[var(--accent-fill)] text-[var(--accent-light)] border border-[var(--accent-ring)]",
  purple:  "bg-[var(--accent-fill)] text-[var(--accent-light)] border border-[var(--accent-ring)]",
  amber:   "bg-[var(--accent-fill)] text-[var(--accent-light)] border border-[var(--accent-ring)]",
  muted:   "bg-white/[0.05] text-[var(--text-3)] border border-white/[0.07]",
};

const sizeStyles: Record<string, string> = {
  sm: "text-[9px] px-2 py-0.5",
  md: "text-[10px] px-2.5 py-1",
};

/**
 * Small status/label badge — all variants map to the same teal accent family
 * for visual consistency. 'muted' variant for neutral/secondary labels.
 */
export function Badge({
  children,
  variant = "muted",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-widest",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
