"use client";

import React, { useState } from "react";
import { SKILLS_CATALOG } from "@/lib/data/skills";
import { SkillCategory } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

interface RadarChartProps {
  userSkills: Record<string, number>;
  targetRequirements?: { skillId: string; level: number }[];
  targetName?: string;
  size?: number;
  className?: string;
}

export function RadarChart({
  userSkills,
  targetRequirements,
  targetName,
  size = 460,
  className,
}: RadarChartProps) {
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.36; // leave room for labels around edges
  const totalSkills = SKILLS_CATALOG.length; // 19

  // Map target requirements for lookup
  const targetMap = new Map<string, number>();
  if (targetRequirements) {
    targetRequirements.forEach((r) => targetMap.set(r.skillId, r.level));
  }

  // Helper for polar to cartesian
  const getCoordinates = (index: number, level: number) => {
    const angle = (2 * Math.PI * index) / totalSkills - Math.PI / 2;
    const r = (Math.max(0, Math.min(5, level)) / 5) * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate grid concentric polygons (Levels 1 to 5)
  const gridRings = [1, 2, 3, 4, 5].map((lvl) => {
    const points = SKILLS_CATALOG.map((_, i) => {
      const { x, y } = getCoordinates(i, lvl);
      return `${x},${y}`;
    }).join(" ");
    return { level: lvl, points };
  });

  // Generate user polygon
  const userPoints = SKILLS_CATALOG.map((skill, i) => {
    const lvl = userSkills[skill.id] || 0;
    const { x, y } = getCoordinates(i, lvl);
    return `${x},${y}`;
  }).join(" ");

  // Generate target overlay polygon (if target exists)
  const targetPoints = targetRequirements
    ? SKILLS_CATALOG.map((skill, i) => {
        const lvl = targetMap.get(skill.id) || 0;
        const { x, y } = getCoordinates(i, lvl);
        return `${x},${y}`;
      }).join(" ")
    : null;

  // Category color indicators
  const getCategoryColor = (cat: SkillCategory) => {
    switch (cat) {
      case "Transferable":
        return "#10b981"; // Emerald
      case "Digital":
        return "#06b6d4"; // Cyan
      case "Technical":
        return "#8b5cf6"; // Violet
      default:
        return "#94a3b8";
    }
  };

  const activeSkill = SKILLS_CATALOG.find((s) => s.id === hoveredSkillId);

  return (
    <div className={cn("relative flex flex-col items-center select-none", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          {/* User gradient fill */}
          <linearGradient id="userRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.25" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric Grid Polygons */}
        {gridRings.map((ring) => (
          <polygon
            key={ring.level}
            points={ring.points}
            fill="transparent"
            stroke="hsl(var(--card-border))"
            strokeWidth={ring.level === 5 ? "1.5" : "0.75"}
            strokeDasharray={ring.level < 5 ? "2 3" : undefined}
            className="opacity-70"
          />
        ))}

        {/* Radial Spokes */}
        {SKILLS_CATALOG.map((skill, i) => {
          const { x, y } = getCoordinates(i, 5);
          return (
            <line
              key={skill.id}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="hsl(var(--card-border))"
              strokeWidth="0.75"
              className="opacity-60"
            />
          );
        })}

        {/* Target Overlay Polygon (Dashed Amber/Indigo) */}
        {targetPoints && (
          <polygon
            points={targetPoints}
            fill="rgba(245, 158, 11, 0.08)"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeDasharray="4 3"
            className="transition-all duration-300"
          />
        )}

        {/* User Skills Filled Polygon */}
        <polygon
          points={userPoints}
          fill="url(#userRadarGrad)"
          stroke="#06b6d4"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
          className="transition-all duration-500 ease-out"
        />

        {/* Vertices & Interactive Dots */}
        {SKILLS_CATALOG.map((skill, i) => {
          const userLvl = userSkills[skill.id] || 0;
          const userCoord = getCoordinates(i, userLvl);
          const targetLvl = targetMap.get(skill.id) || 0;
          const targetCoord = targetRequirements ? getCoordinates(i, targetLvl) : null;
          const isHovered = hoveredSkillId === skill.id;

          return (
            <g
              key={skill.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredSkillId(skill.id)}
              onMouseLeave={() => setHoveredSkillId(null)}
            >
              {/* Target requirement dot */}
              {targetCoord && targetLvl > 0 && (
                <circle
                  cx={targetCoord.x}
                  cy={targetCoord.y}
                  r="3.5"
                  fill="#f59e0b"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              )}

              {/* User skill dot */}
              <circle
                cx={userCoord.x}
                cy={userCoord.y}
                r={isHovered ? "6" : "4"}
                fill={isHovered ? "#38bdf8" : "#06b6d4"}
                stroke="#0f172a"
                strokeWidth="1.5"
                className="transition-all duration-150"
              />

              {/* Outer perimeter label anchor point */}
              {(() => {
                const angle = (2 * Math.PI * i) / totalSkills - Math.PI / 2;
                const labelR = maxRadius + 22;
                const lx = cx + labelR * Math.cos(angle);
                const ly = cy + labelR * Math.sin(angle);
                const isRight = Math.cos(angle) > 0.1;
                const isLeft = Math.cos(angle) < -0.1;
                const textAnchor = isRight ? "start" : isLeft ? "end" : "middle";

                return (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    fill={isHovered ? "#38bdf8" : "hsl(var(--foreground))"}
                    fontSize={isHovered ? "11" : "9.5"}
                    fontWeight={isHovered ? "700" : "500"}
                    className="transition-all duration-150"
                  >
                    {skill.name}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip / Detail Strip */}
      <div className="mt-2 min-h-[38px] w-full max-w-sm rounded-lg border border-card-border bg-card/80 px-3 py-1.5 text-center text-xs backdrop-blur">
        {activeSkill ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                style={{ backgroundColor: getCategoryColor(activeSkill.category) }}
                className="h-2 w-2 rounded-full shrink-0"
              />
              <span className="font-bold text-foreground">{activeSkill.name}</span>
              <span className="text-[10px] text-muted-foreground">({activeSkill.category})</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-cyan-400 font-semibold">
                You: L{userSkills[activeSkill.id] || 0}/5
              </span>
              {targetMap.has(activeSkill.id) && (
                <span className="text-amber-400">
                  Target: L{targetMap.get(activeSkill.id)}/5
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Your Profile</span>
            </span>
            {targetRequirements && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>{targetName || "Target Role"} Requirements</span>
              </span>
            )}
            <span className="text-[10px] italic">Hover vertices to inspect</span>
          </div>
        )}
      </div>
    </div>
  );
}
