import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "emerald" | "cyan" | "purple" | "amber" | "muted";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  cyan:    "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
  purple:  "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  amber:   "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  muted:   "bg-white/5 text-slate-400 border border-white/10",
};

const sizeStyles: Record<string, string> = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

/**
 * Small status/label badge with variant colors.
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
        "inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
