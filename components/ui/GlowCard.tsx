import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  as?: React.ElementType;
}

/**
 * Reusable glassmorphism card with optional teal glow hover effect.
 * Uses the single teal accent family — no per-component color overrides.
 */
export function GlowCard({
  children,
  className,
  glow = false,
  as: Tag = "div",
}: GlowCardProps) {
  return (
    <Tag
      className={cn(
        "glass-card",
        glow && [
          "cursor-pointer transition-all duration-200",
          "hover:border-[var(--border-accent)] hover:shadow-[var(--glow-sm)]",
        ],
        className
      )}
    >
      {children}
    </Tag>
  );
}
