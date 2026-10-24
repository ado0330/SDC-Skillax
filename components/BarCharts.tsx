import React from "react";
import { ComponentScores, SkillGap } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

interface ScoreDecompositionBarProps {
  components: ComponentScores;
  className?: string;
}

export function ScoreDecompositionBar({
  components,
  className,
}: ScoreDecompositionBarProps) {
  const hasWorkforce = components.workforceScore !== null;
  const baselineScale = hasWorkforce ? 0.9 : 1.0;

  const items = [
    {
      label: "Direct Skills Alignment",
      rawScore: components.skillsScore,
      weightPct: Math.round(50 * baselineScale),
      points: Number((components.skillsScore * 0.5 * baselineScale).toFixed(1)),
      color: "bg-chart-1",
      textColor: "text-primary",
      description: "Direct alignment to catalogued role skill proficiencies.",
    },
    {
      label: "Transferable Skills",
      rawScore: components.transferableScore,
      weightPct: Math.round(20 * baselineScale),
      points: Number((components.transferableScore * 0.2 * baselineScale).toFixed(1)),
      color: "bg-chart-2",
      textColor: "text-chart-2",
      description: "Cross-functional competencies (communication, ethics, coordination).",
    },
    {
      label: "Sectoral & Role Interest",
      rawScore: components.interestScore,
      weightPct: Math.round(15 * baselineScale),
      points: Number((components.interestScore * 0.15 * baselineScale).toFixed(1)),
      color: "bg-chart-3",
      textColor: "text-chart-3",
      description: "Match between candidate interest tags and occupational industry.",
    },
    {
      label: "Research Market Activity",
      rawScore: components.marketScore,
      weightPct: Math.round(15 * baselineScale),
      points: Number((components.marketScore * 0.15 * baselineScale).toFixed(1)),
      color: "bg-chart-4",
      textColor: "text-warning",
      description: "Scientific publication mentions (Hugging Face / MIT AI News).",
    },
  ];

  if (hasWorkforce && components.workforceScore !== null) {
    items.push({
      label: "Workforce Demand Indicator",
      rawScore: components.workforceScore,
      weightPct: 10,
      points: Number((components.workforceScore * 0.1).toFixed(1)),
      color: "bg-chart-5",
      textColor: "text-destructive",
      description: "Eligible comparable time-series workforce demand trend.",
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Visual Stacked Bar */}
      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted border border-card-border p-0.5 gap-0.5">
        {items.map((item) => (
          <div
            key={item.label}
            style={{ width: `${item.points}%` }}
            className={cn("h-full rounded-sm transition-all duration-500", item.color)}
            title={`${item.label}: ${item.points} pts (${item.rawScore}% raw)`}
          />
        ))}
      </div>

      {/* Individual Item Breakdowns */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-card-border/60 bg-card/40 p-3">
            <div className="score-breakdown-row flex items-center justify-between text-sm mb-1">
              <span className="font-semibold text-foreground">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-mono">
                  {item.rawScore}% raw × {item.weightPct}% weight =
                </span>
                <span className={cn("font-mono font-semibold text-sm", item.textColor)}>
                  +{item.points} pts
                </span>
              </div>
            </div>

            {/* Progress line */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                style={{ width: `${item.rawScore}%` }}
                className={cn("h-full rounded-full", item.color)}
              />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProficiencyGapChartProps {
  gaps: SkillGap[];
  className?: string;
}

export function ProficiencyGapChart({
  gaps,
  className,
}: ProficiencyGapChartProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {gaps.map((gap) => {
        const isMet = gap.gap === 0;

        return (
          <div
            key={gap.skillId}
            className="rounded-lg border border-card-border/60 bg-card/40 p-3 text-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-foreground text-sm">{gap.skillName}</span>
                <span className="ml-2 text-sm text-muted-foreground">({gap.category})</span>
              </div>
              <div>
                {isMet ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-sm font-semibold text-success">
                    Requirement Met
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-sm font-semibold text-warning font-mono">
                    -{gap.gap} Level Shortfall
                  </span>
                )}
              </div>
            </div>

            {/* Dual Bar (Current Cyan vs Required Indigo) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-14 text-sm font-mono text-muted-foreground">Current:</span>
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${(gap.currentLevel / 5) * 100}%` }}
                    className="h-full rounded-full bg-cyan-400"
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs font-semibold text-accent-cyan">
                  {gap.currentLevel}/5
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-14 text-sm font-mono text-muted-foreground">Required:</span>
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${(gap.requiredLevel / 5) * 100}%` }}
                    className="h-full rounded-full bg-indigo-500"
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs font-semibold text-primary">
                  {gap.requiredLevel}/5
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
