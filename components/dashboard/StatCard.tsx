"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down";
  color: string;
  index: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 26 },
  },
};

export function StatCard({ label, value, sub, trend, index }: StatCardProps) {
  return (
    <motion.article
      className="glass-card relative flex flex-col justify-between overflow-hidden"
      style={{ padding: "16px", minHeight: 90 }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 26,
        delay: index * 0.07 + 0.1,
      }}
      whileHover={{
        y: -2,
        boxShadow:
          "0 8px 32px rgba(20,184,166,0.14), 0 0 0 1px rgba(20,184,166,0.18)",
        borderColor: "rgba(20,184,166,0.22)",
      }}
      aria-label={`${label}: ${value}`}
    >
      {/* Accent orb */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -12,
          top: -12,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(20,184,166,0.14)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Label */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text-3)",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </span>

      {/* Value */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          color: "var(--accent-light)",
          display: "block",
          marginBottom: 8,
        }}
      >
        {value}
      </span>

      {/* Trend + sub */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 11,
          color: "var(--text-3)",
        }}
      >
        {trend === "up" ? (
          <TrendingUp
            size={10}
            style={{ color: "var(--accent)", flexShrink: 0 }}
            aria-hidden="true"
          />
        ) : (
          <TrendingDown
            size={10}
            style={{ color: "#f43f5e", flexShrink: 0 }}
            aria-hidden="true"
          />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {sub}
        </span>
      </span>
    </motion.article>
  );
}
