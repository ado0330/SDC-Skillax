import React from "react";
import { cn } from "@/lib/utils";

interface LevelDotsProps {
  currentLevel: number; // 0 to 5
  requiredLevel?: number; // 1 to 5
  maxLevel?: number;
  size?: "sm" | "md";
  className?: string;
}

export function LevelDots({
  currentLevel,
  requiredLevel,
  maxLevel = 5,
  size = "md",
  className,
}: LevelDotsProps) {
  const dots = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div role="img" aria-label={`Level ${currentLevel} of ${maxLevel}${requiredLevel !== undefined ? `; required level ${requiredLevel}` : ""}`} className={cn("inline-flex items-center gap-1", className)}>
      {dots.map((level) => {
        const isCurrentFilled = level <= currentLevel;
        const isRequiredShortfall =
          requiredLevel !== undefined &&
          level > currentLevel &&
          level <= requiredLevel;

        return (
          <span
            key={level}
            className={cn(
              "rounded-full transition-colors",
              size === "sm" ? "h-1.5 w-3" : "h-2 w-4",
              isCurrentFilled
                ? "bg-chart-1"
                : isRequiredShortfall
                ? "border border-indigo-400 bg-indigo-500/30"
                : "bg-muted-foreground/20"
            )}
            title={`Level ${level}`}
          />
        );
      })}
    </div>
  );
}
