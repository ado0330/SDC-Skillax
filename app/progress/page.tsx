"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ScoreRing } from "@/components/ScoreRing";
import {
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  Target,
  ArrowRight,
  BookOpen,
  Flame,
  Sparkles,
  ExternalLink,
  Sliders,
  Layers,
} from "lucide-react";

type MilestoneFilter = "all" | "completed" | "pending";

export default function ProgressPage() {
  const {
    profile,
    updateProfile,
    targetRole,
    roadmap,
    completedMilestoneIds,
    toggleMilestone,
    topMatch,
  } = useWorkspace();

  const [filter, setFilter] = useState<MilestoneFilter>("all");

  const focusRole = targetRole || topMatch?.role;

  // Study hours calculations
  const stats = useMemo(() => {
    const totalMilestones = roadmap.length;
    const completedCount = roadmap.filter((m) =>
      completedMilestoneIds.includes(m.id)
    ).length;
    const completionPct =
      totalMilestones > 0
        ? Math.round((completedCount / totalMilestones) * 100)
        : 0;

    const totalHours = roadmap.reduce((acc, m) => acc + m.hours, 0);
    const completedHours = roadmap
      .filter((m) => completedMilestoneIds.includes(m.id))
      .reduce((acc, m) => acc + m.hours, 0);
    const remainingHours = Math.max(0, totalHours - completedHours);

    const weeklyHours = profile.weeklyHours > 0 ? profile.weeklyHours : 10;
    const weeksRemaining =
      weeklyHours > 0 ? (remainingHours / weeklyHours).toFixed(1) : "0";

    // Phase level effort
    const phaseBreakdown = [1, 2, 3, 4].map((phaseNum) => {
      const phaseMilestones = roadmap.filter((m) => m.phase === phaseNum);
      const phaseTotal = phaseMilestones.length;
      const phaseCompleted = phaseMilestones.filter((m) =>
        completedMilestoneIds.includes(m.id)
      ).length;
      const phaseHours = phaseMilestones.reduce((acc, m) => acc + m.hours, 0);
      const phaseCompletedHours = phaseMilestones
        .filter((m) => completedMilestoneIds.includes(m.id))
        .reduce((acc, m) => acc + m.hours, 0);
      const pct =
        phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;

      return {
        phase: phaseNum as 1 | 2 | 3 | 4,
        title:
          phaseNum === 1
            ? "Phase 1: Foundational Literacy"
            : phaseNum === 2
            ? "Phase 2: Applied Technical Skills"
            : phaseNum === 3
            ? "Phase 3: Applied Capstone"
            : "Phase 4: Production Portfolio & Evidence",
        total: phaseTotal,
        completed: phaseCompleted,
        totalHours: phaseHours,
        completedHours: phaseCompletedHours,
        pct,
      };
    });

    return {
      totalMilestones,
      completedCount,
      completionPct,
      totalHours,
      completedHours,
      remainingHours,
      weeklyHours,
      weeksRemaining,
      phaseBreakdown,
    };
  }, [roadmap, completedMilestoneIds, profile.weeklyHours]);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return roadmap.filter((m) => {
      const isDone = completedMilestoneIds.includes(m.id);
      if (filter === "completed") return isDone;
      if (filter === "pending") return !isDone;
      return true;
    });
  }, [roadmap, completedMilestoneIds, filter]);

  // Velocity Badges
  const badges = [
    {
      id: "first-step",
      name: "First Milestone",
      description: "Completed your first reskilling module",
      achieved: stats.completedCount >= 1,
      icon: Sparkles,
      color: "text-accent-cyan bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "halfway",
      name: "Momentum Builder",
      description: "Finished 50% or more of career pathway",
      achieved: stats.completionPct >= 50,
      icon: Flame,
      color: "text-warning bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "foundation-master",
      name: "Foundation Master",
      description: "Completed 100% of Phase 1 Foundational modules",
      achieved: stats.phaseBreakdown[0].pct === 100 && stats.phaseBreakdown[0].total > 0,
      icon: Layers,
      color: "text-chart-3 bg-purple-500/10 border-purple-500/30",
    },
    {
      id: "job-ready",
      name: "Job-Ready Certified",
      description: "Completed all 4 phases including capstone & portfolio",
      achieved: stats.completionPct === 100 && stats.totalMilestones > 0,
      icon: Award,
      color: "text-success bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <ProfileGate>
      <div className="space-y-8 pb-12">
        <PageHeader
          eyebrow="Reskilling Analytics"
          title="Lifelong Learning Progress"
          description={`Tracking completion milestones, study hours invested, and estimated delivery dates toward your career transition.`}
        >
          {focusRole && (
            <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card/60 px-3 py-1.5 text-sm text-muted-foreground">
              <Target className="h-4 w-4 text-primary" />
              <span>Target: <strong className="text-foreground">{focusRole.name}</strong></span>
            </div>
          )}
        </PageHeader>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Progress Ring */}
          <Panel glow className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pathway Completion
              </span>
              <div className="text-2xl font-semibold text-foreground">
                {stats.completedCount} / {stats.totalMilestones}
              </div>
              <p className="text-sm text-muted-foreground">
                Milestones completed
              </p>
            </div>
            <ScoreRing score={stats.completionPct} size="md" label="DONE" />
          </Panel>

          {/* Hours Invested */}
          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Study Hours Completed</span>
              <Clock className="h-4 w-4 text-success" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-success font-mono">
                {stats.completedHours}
              </span>
              <span className="text-sm text-muted-foreground">/ {stats.totalHours} hrs</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.remainingHours} study hours remaining
            </p>
          </Panel>

          {/* Time to Target Projection */}
          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Estimated Delivery</span>
              <Calendar className="h-4 w-4 text-accent-cyan" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground font-mono">
                ~{stats.weeksRemaining}
              </span>
              <span className="text-sm text-muted-foreground">Weeks to Target</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              At your current pace of {stats.weeklyHours} hrs/week
            </p>
          </Panel>

          {/* Target Role Context */}
          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Active Target</span>
              <Target className="h-4 w-4 text-chart-3" />
            </div>
            <div className="mt-3">
              <div className="text-base font-semibold text-foreground truncate">
                {focusRole?.name || "No target role set"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {focusRole ? `${focusRole.industry} • 4-Phase Curriculum` : "Select a target in Career Matches"}
              </p>
            </div>
          </Panel>
        </div>

        {/* Weekly Study Pace Adjuster */}
        <Panel className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-accent-cyan" />
                <h3 className="text-sm font-semibold text-foreground">
                  Weekly Study Pace Simulator
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Adjust your weekly study commitment to project target completion timelines dynamically.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <input aria-label="Weekly study hours"
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={stats.weeklyHours}
                  onChange={(e) =>
                    updateProfile({ weeklyHours: Number(e.target.value) })
                  }
                  className="ui-field w-36 sm:w-48 accent-cyan-500 cursor-pointer"
                />
                <span className="font-mono text-xs font-semibold text-foreground min-w-[60px] text-right">
                  {stats.weeklyHours} hrs/wk
                </span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Phase-by-Phase Effort Progress */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span>4-Phase Curriculum Progression</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.phaseBreakdown.map((phase) => (
              <Panel key={phase.phase} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                      Phase {phase.phase}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground mt-1">
                      {phase.title}
                    </h4>
                  </div>
                  <span className="text-sm font-semibold font-mono text-primary">
                    {phase.pct}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-card-border overflow-hidden">
                  <div
                    style={{ width: `${phase.pct}%` }}
                    className="h-full bg-chart-1 transition-all duration-300"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                  <span>
                    {phase.completed} of {phase.total} milestones done
                  </span>
                  <span className="font-mono">
                    {phase.completedHours} / {phase.totalHours} hrs
                  </span>
                </div>
              </Panel>
            ))}
          </div>
        </div>

        {/* Achievement Velocity Badges */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-warning" />
            <span>Reskilling Velocity Badges</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;

              return (
                <Panel
                  key={badge.id}
                  glow={badge.achieved}
                  className={`p-4 transition-all ${
                    badge.achieved ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl border ${badge.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {badge.name}
                      </h4>
                      <span className="text-sm font-semibold text-muted-foreground">
                        {badge.achieved ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {badge.description}
                  </p>
                </Panel>
              );
            })}
          </div>
        </div>

        {/* Milestone Activity Checklist */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-success" />
                <span>Pathway Modules Checklist ({filteredMilestones.length})</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Check off completed milestones in real time. State is preserved across recalculations.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-card-border shrink-0">
              {(["all", "completed", "pending"] as MilestoneFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`ui-button px-3 py-1 text-sm font-medium rounded-lg capitalize transition-colors ${
                    filter === f
                      ? "bg-action text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-card-border overflow-hidden bg-card divide-y divide-card-border/60">
            {filteredMilestones.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No milestones found matching filter &quot;{filter}&quot;.
              </div>
            ) : (
              filteredMilestones.map((m) => {
                const isCompleted = completedMilestoneIds.includes(m.id);

                return (
                  <div
                    key={m.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isCompleted ? "bg-muted/20" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button aria-label={`${isCompleted ? "Mark incomplete" : "Mark complete"}: ${m.title}`}
                        onClick={() => toggleMilestone(m.id)}
                        aria-pressed={isCompleted}
                        className={`ui-button ui-button-icon mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          isCompleted
                            ? "bg-emerald-700 border-emerald-500 text-white shadow-sm"
                            : "border-card-border hover:border-emerald-500"
                        }`}
                        title={isCompleted ? "Mark incomplete" : "Mark complete"}
                      >
                        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs uppercase font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-semibold">
                            Phase {m.phase}
                          </span>
                          <span className="text-sm font-semibold px-2 py-0.2 rounded bg-cyan-500/10 text-accent-cyan">
                            {m.skillId}
                          </span>
                          <h4
                            className={`text-sm font-semibold ${
                              isCompleted
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {m.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {m.objective}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:self-center pl-8 sm:pl-0">
                      <div className="text-right text-sm">
                        <span className="font-mono font-semibold text-foreground">
                          {m.hours} hrs
                        </span>
                        <span className="text-muted-foreground block text-sm">
                          {m.provider}
                        </span>
                      </div>

                      {m.url && (
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ui-button p-1.5 rounded-lg border border-card-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                          title="Open course syllabus"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </ProfileGate>
  );
}
