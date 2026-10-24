"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ExportModal } from "@/components/ExportModal";
import { ROLES_CATALOG } from "@/lib/data/roles";
import { Milestone } from "@/lib/domain/types";
import {
  Map,
  CheckCircle,
  Circle,
  Clock,
  ExternalLink,
  Target,
  RotateCcw,
  Download,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function RoadmapPage() {
  const {
    profile,
    targetRole,
    setTargetRole,
    roadmap,
    toggleMilestone,
    regenerateRoadmap,
    scenario,
  } = useWorkspace();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Group roadmap milestones by Phase 1, 2, 3, 4
  const phaseGroups = useMemo(() => {
    const p1 = roadmap.filter((m) => m.phase === 1);
    const p2 = roadmap.filter((m) => m.phase === 2);
    const p3 = roadmap.filter((m) => m.phase === 3);
    const p4 = roadmap.filter((m) => m.phase === 4);
    return { p1, p2, p3, p4 };
  }, [roadmap]);

  const totalHours = useMemo(() => {
    return roadmap.reduce((sum, m) => sum + m.hours, 0);
  }, [roadmap]);

  const completedCount = useMemo(() => {
    return roadmap.filter((m) => m.completed).length;
  }, [roadmap]);

  const completedHours = useMemo(() => {
    return roadmap.filter((m) => m.completed).reduce((sum, m) => sum + m.hours, 0);
  }, [roadmap]);

  const percentComplete =
    totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  const weeklyPace = profile.weeklyHours || 10;
  const estimatedWeeks =
    weeklyPace > 0 ? (totalHours / weeklyPace).toFixed(1) : "0";

  const renderMilestoneCard = (milestone: Milestone) => {
    return (
      <div
        key={milestone.id}
        className={`rounded-lg border p-4 transition-all ${
          milestone.completed
            ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground"
            : "border-card-border bg-card/60 hover:border-primary/40"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => toggleMilestone(milestone.id)}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-emerald-400 transition-colors"
            title={milestone.completed ? "Mark incomplete" : "Mark milestone completed"}
          >
            {milestone.completed ? (
              <CheckCircle className="h-5 w-5 text-emerald-400 fill-emerald-500/20" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4
                className={`text-sm font-bold tracking-tight ${
                  milestone.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {milestone.title}
              </h4>

              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold text-foreground">
                  <Clock className="h-3 w-3 text-cyan-400" />
                  {milestone.hours} hrs
                </span>
                <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                  {milestone.provider}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {milestone.objective}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-card-border/50 text-[11px]">
              <span className="text-muted-foreground/80 italic">
                {milestone.prerequisites}
              </span>
              <a
                href={milestone.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline ml-auto"
              >
                <span>Access Course Resource</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProfileGate>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Reskilling Pathway"
          title="Personalized Learning Roadmap"
          description="Structured 4-phase learning pathway tailored to your capability gaps, active AI adoption scenario, and target career."
        >
          <div className="flex items-center gap-2">
            <button
              onClick={regenerateRoadmap}
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              title="Recalculate gaps and ordering while preserving completed checkmarks"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Regenerate Plan</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Plan</span>
            </button>
          </div>
        </PageHeader>

        {/* Target Role Selector & High-Level Progress */}
        <Panel className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Target Career
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {targetRole?.name || "Select Target Occupation"}
                </h3>
              </div>
            </div>

            {/* Switch Target Career Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Target Role:</label>
              <select
                value={targetRole?.id || ""}
                onChange={(e) => setTargetRole(e.target.value)}
                className="rounded-md border border-card-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
              >
                {ROLES_CATALOG.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.industry})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Total Pathway Effort
              </span>
              <span className="font-mono text-lg font-bold text-foreground">
                {totalHours} hours
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Completed Milestones
              </span>
              <span className="font-mono text-lg font-bold text-emerald-400">
                {completedCount} of {roadmap.length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Completion Rate
              </span>
              <span className="font-mono text-lg font-bold text-cyan-400">
                {percentComplete}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Projected Duration
              </span>
              <span className="font-mono text-lg font-bold text-indigo-400">
                ~{estimatedWeeks} weeks
              </span>
              <span className="text-[10px] text-muted-foreground block">
                at {weeklyPace} hrs/week
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${percentComplete}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
            />
          </div>
        </Panel>

        {/* 4-Phase Curriculum Timeline */}
        <div className="space-y-6">
          {/* Phase 1: Foundational Skills */}
          <Panel
            title="Phase 1: Foundational Core Competencies"
            subtitle="Skills with significant gaps (current rated level < 2). Master fundamental concepts."
            icon={<BookOpen className="h-4 w-4" />}
          >
            {phaseGroups.p1.length > 0 ? (
              <div className="space-y-3">
                {phaseGroups.p1.map((m) => renderMilestoneCard(m))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">
                No foundational level gaps detected. Your baseline proficiencies satisfy Phase 1.
              </p>
            )}
          </Panel>

          {/* Phase 2: Applied & Technical Specialization */}
          <Panel
            title="Phase 2: Applied & Technical Specialization"
            subtitle="Advanced skill gaps (current level >= 2). Deep dive into production frameworks and tools."
            icon={<Layers className="h-4 w-4" />}
          >
            {phaseGroups.p2.length > 0 ? (
              <div className="space-y-3">
                {phaseGroups.p2.map((m) => renderMilestoneCard(m))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">
                No technical shortfall detected for this phase.
              </p>
            )}
          </Panel>

          {/* Phase 3: Guided Capstone Project */}
          <Panel
            title="Phase 3: Applied Capstone Deliverable"
            subtitle="Hands-on project work synthesizing acquired competencies into an industry deliverable."
            icon={<Award className="h-4 w-4" />}
          >
            <div className="space-y-3">
              {phaseGroups.p3.map((m) => renderMilestoneCard(m))}
            </div>
          </Panel>

          {/* Phase 4: Career Transition & Portfolio Readiness */}
          <Panel
            title="Phase 4: Career Transition & Portfolio Readiness"
            subtitle="Document your case studies, publish repositories, and prepare transition briefings."
            icon={<Sparkles className="h-4 w-4" />}
          >
            <div className="space-y-3">
              {phaseGroups.p4.map((m) => renderMilestoneCard(m))}
            </div>
          </Panel>
        </div>

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          targetRole={targetRole}
          profile={profile}
          roadmap={roadmap}
          totalHours={totalHours}
        />
      </div>
    </ProfileGate>
  );
}
