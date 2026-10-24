import React from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0 to 100
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ScoreRing({
  score,
  label = "MATCH",
  size = "md",
  className,
}: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  const sizeConfig = {
    sm: { dimension: 56, stroke: 4.5, radius: 22, text: "text-xs", labelText: "text-[9px]" },
    md: { dimension: 84, stroke: 6, radius: 34, text: "text-lg", labelText: "text-[11px]" },
    lg: { dimension: 110, stroke: 8, radius: 46, text: "text-2xl", labelText: "text-[10px]" },
    xl: { dimension: 140, stroke: 10, radius: 58, text: "text-3xl", labelText: "text-[11px]" },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={`${label}: ${clampedScore}%`}
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: config.dimension, height: config.dimension }}
    >
      <svg
        width={config.dimension}
        height={config.dimension}
        className="-rotate-90 transform"
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--cyan))" />
            <stop offset="100%" stopColor="hsl(var(--violet))" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={config.radius}
          fill="transparent"
          stroke="hsl(var(--card-border))"
          strokeWidth={config.stroke}
        />

        {/* Animated Progress ring */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={config.radius}
          fill="transparent"
          stroke="hsl(var(--chart-1))"
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("font-semibold font-mono tracking-tight text-foreground", config.text)}>
          {clampedScore}%
        </span>
        {label && (
          <span className={cn("font-medium uppercase tracking-normal text-muted-foreground", config.labelText)}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
