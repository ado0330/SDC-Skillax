import React from "react";
import { SDGS_BY_ID } from "@/lib/data/sdgs";
import { cn } from "@/lib/utils";

interface SdgBadgeProps {
  sdgId: number;
  showName?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function SdgBadge({
  sdgId,
  showName = false,
  size = "md",
  className,
}: SdgBadgeProps) {
  const sdg = SDGS_BY_ID.get(sdgId);
  if (!sdg) return null;

  return (
    <span
      style={{
        backgroundColor: sdg.color,
        color: sdg.textColor,
      }}
      className={cn(
        "inline-flex items-center gap-1 font-bold rounded font-mono uppercase tracking-wider shadow-sm",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className
      )}
      title={`SDG ${sdg.id}: ${sdg.name} - ${sdg.description}`}
    >
      <span>SDG {sdg.id}</span>
      {showName && <span className="font-sans font-medium normal-case ml-1">{sdg.shortName}</span>}
    </span>
  );
}
