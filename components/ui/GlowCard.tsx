import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "emerald" | "cyan" | "purple" | "amber" | "none";
  hover?: boolean;
  as?: React.ElementType;
}

const glowStyles: Record<string, string> = {
  emerald: "hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
  cyan:    "hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
  purple:  "hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
  amber:   "hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
  none:    "",
};

/**
 * Reusable glassmorphism card with optional glow hover effect.
 */
export function GlowCard({
  children,
  className,
  glowColor = "emerald",
  hover = false,
  as: Tag = "div",
}: GlowCardProps) {
  return (
    <Tag
      className={cn(
        "glass-card",
        hover && [
          "glass-card-hover cursor-pointer",
          glowStyles[glowColor],
        ],
        className
      )}
    >
      {children}
    </Tag>
  );
}
