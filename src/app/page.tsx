"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { Panel } from "@/components/Panel";
import { PageHeader } from "@/components/PageHeader";
import { ScoreRing } from "@/components/ScoreRing";
import { RadarChart } from "@/components/RadarChart";
import { ScoreDecompositionBar } from "@/components/BarCharts";
import { SdgBadge } from "@/components/SdgBadge";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  TrendingUp,
  Clock,
  BookOpen,
  Globe,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const {
    profile,
    isProfileInitialized,
    matches,
    topMatch,
    targetRole,
    setTargetRole,
    scenario,
    simulationBoost,
    roadmap,
    completedMilestoneIds,
    toggleMilestone,
    researchSignals,
    loadSyntheticPreset,
  } = useWorkspace();

  // Active target or fallback to top match
  const focusRole = targetRole || topMatch?.role;
  const focusMatch = useMemo(() => {
    if (!focusRole) return topMatch;
    return matches.find((m) => m.role.id === focusRole.id) || topMatch;
  }, [matches, focusRole, topMatch]);

  // Next active uncompleted milestone
  const nextMilestone = useMemo(() => {
    return roadmap.find((m) => !completedMilestoneIds.includes(m.id));
  }, [roadmap, completedMilestoneIds]);

  // Distinct SDGs impacted by top 3 matches
  const topMatchedSdgs = useMemo(() => {
    const sdgSet = new Set<number>();
    matches.slice(0, 3).forEach((m) => {
      m.role.sdgs.forEach((id) => sdgSet.add(id));
    });
    return sdgSet;
  }, [matches]);

  // Milestone completion percentage
  const completionPct = useMemo(() => {
    if (roadmap.length === 0) return 0;
    const completedCount = roadmap.filter((m) => completedMilestoneIds.includes(m.id)).length;
    return Math.round((completedCount / roadmap.length) * 100);
  }, [roadmap, completedMilestoneIds]);

  // Uninitialized welcome view
  if (!isProfileInitialized) {
    return (
      <div className="space-y-12 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-8 sm:p-12 text-center shadow-lg">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-sm font-semibold text-accent-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Future Workforce Intelligence &amp; Career OS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]">
              Navigate AI Transformation with{" "}
              <span className="text-primary">
                Explainable Career Intelligence
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Empowering Malaysian workers, lifelong learners, and workforce planners. Benchmark your capabilities against national priority roles, simulate AI adoption shocks, and build deterministic 4-phase reskilling roadmaps.
            </p>

            {/* Entry Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/profile"
                className="ui-button w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-action px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-action-hover transition-all "
              >
                <Compass className="h-4 w-4" />
                <span>Build My Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/assessment"
                className="ui-button ui-button-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-card-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
              >
                <span>5-Scenario Quick Wizard</span>
              </Link>
            </div>
          </div>

          {/* Fast-Track Demo Presets */}
          <div className="mt-12 border-t border-card-border/80 pt-8 max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Instant Synthetic Demo Presets (No typing required)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => loadSyntheticPreset("sample-aina")}
                className="ui-button flex flex-col items-start p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-cyan-500/50 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-semibold text-foreground group-hover:text-accent-cyan transition-colors">
                    Aina (Operations)
                  </span>
                  <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    Mid-Career
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Logistics Coordinator transitioning to Supply Chain Automation &amp; Business Process Analysis.
                </p>
                <span className="mt-3 text-sm font-semibold text-accent-cyan flex items-center gap-1">
                  <span>Load Aina Preset</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>

              <button
                onClick={() => loadSyntheticPreset("sample-daniel")}
                className="ui-button flex flex-col items-start p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-cyan-500/50 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-semibold text-foreground group-hover:text-accent-cyan transition-colors">
                    Daniel (Data)
                  </span>
                  <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    Early Career
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Junior Software Assistant upskilling in Python, SQL, and Machine Learning pipelines.
                </p>
                <span className="mt-3 text-sm font-semibold text-accent-cyan flex items-center gap-1">
                  <span>Load Daniel Preset</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>

              <button
                onClick={() => loadSyntheticPreset("sample-kumar")}
                className="ui-button flex flex-col items-start p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-cyan-500/50 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-semibold text-foreground group-hover:text-accent-cyan transition-colors">
                    Kumar (Maintenance)
                  </span>
                  <span className="text-xs uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    Supervisor
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Industrial Technician transitioning to IoT Operations &amp; Predictive Asset Maintenance.
                </p>
                <span className="mt-3 text-sm font-semibold text-accent-cyan flex items-center gap-1">
                  <span>Load Kumar Preset</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Panel className="p-5">
            <ShieldCheck className="h-6 w-6 text-accent-cyan mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              Deterministic Math Engine
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Zero LLM hallucination. 100% reproducible formula combining skills (50%), transferable (20%), interest (15%), and market signals (15%).
            </p>
          </Panel>

          <Panel className="p-5">
            <Sliders className="h-6 w-6 text-chart-3 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              AI Scenario Lab
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Stress-test career resilience against Slower, Moderate, or Rapid technological adoption and macroeconomic shifts.
            </p>
          </Panel>

          <Panel className="p-5">
            <BookOpen className="h-6 w-6 text-success mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              4-Phase Learning Pathway
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Automated sequencing from foundational digital literacy to capstones and production-grade portfolio evidence.
            </p>
          </Panel>

          <Panel className="p-5">
            <Globe className="h-6 w-6 text-warning mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              17 UN SDG Impact Matrix
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Align every hour of reskilling with the United Nations Sustainable Development Goals and national sustainability milestones.
            </p>
          </Panel>
        </div>
      </div>
    );
  }

  // Initialized Dashboard View
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Executive Intelligence Briefing"
        title={`Welcome back, ${profile.name || "Learner"}`}
        description={`Active Career Profile: ${profile.occupation || "General Professional"} • ${profile.industry || "General Industry"}. Monitoring AI exposure and reskilling milestones.`}
      >
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="ui-button ui-button-secondary px-3 py-1.5 rounded-lg border border-card-border bg-card text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/scenarios"
            className="ui-button px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Scenario Lab</span>
          </Link>
        </div>
      </PageHeader>

      {/* 4-Key Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Match Card */}
        <Panel glow className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Top Recommended Role</span>
            <Sparkles className="h-4 w-4 text-accent-cyan" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-semibold text-foreground">
              {topMatch?.role.name || "Calculating..."}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-accent-cyan">
                {topMatch?.overallScore || 0}%
              </span>
              <span className="text-sm text-muted-foreground">Suitability Match</span>
            </div>
          </div>
        </Panel>

        {/* Target Career & Roadmap Progress */}
        <Panel className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Target Career Pathway</span>
            <Target className="h-4 w-4 text-success" />
          </div>
          <div className="mt-3">
            <div className="text-base font-semibold text-foreground">
              {targetRole ? targetRole.name : "None Designated"}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {completionPct}%
              </span>
              <span className="text-sm text-muted-foreground">
                Roadmap Completed ({completedMilestoneIds.length}/{roadmap.length})
              </span>
            </div>
          </div>
        </Panel>

        {/* Active Scenario Indicator */}
        <Panel className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Active AI Scenario</span>
            <Sliders className="h-4 w-4 text-chart-3" />
          </div>
          <div className="mt-3">
            <div className="text-base font-semibold text-foreground capitalize">
              {scenario} Adoption
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Simulation Boost:</span>
              <span className={`font-mono font-semibold ${
                simulationBoost > 0 ? "text-success" : simulationBoost < 0 ? "text-warning" : "text-muted-foreground"
              }`}>
                {simulationBoost > 0 ? `+${simulationBoost}` : simulationBoost} pts
              </span>
            </div>
          </div>
        </Panel>

        {/* UN SDG Footprint */}
        <Panel className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>SDG Alignment</span>
            <Globe className="h-4 w-4 text-warning" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">
                {topMatchedSdgs.size}
              </span>
              <span className="text-sm text-muted-foreground">/ 17 Goals Impacted</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Directly advanced by top 3 matches
            </p>
          </div>
        </Panel>
      </div>

      {/* Visual Centerpiece: 19-Skill Polygonal Radar + Top Match Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 19-Skill Polygonal Radar Matrix (7 cols) */}
        <Panel className="lg:col-span-7 p-6 flex flex-col justify-start">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Compass className="h-4 w-4 text-accent-cyan" />
                <span>19-Skill Capability Radar</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Comparing your current proficiencies (cyan) against {focusRole?.name || "Target Role"} requirements (amber).
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs uppercase font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-success border border-emerald-500/20">
                5 Transferable
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-accent-cyan border border-cyan-500/20">
                5 Digital
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-chart-3 border border-purple-500/20">
                9 Technical
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <RadarChart
              userSkills={profile.skills}
              targetRequirements={focusRole?.requirements}
              targetName={focusRole?.name}
              size={440}
            />
          </div>

          <div className="pt-4 border-t border-card-border/60 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Need to fine-tune your self-ratings?
            </span>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <span>Update Skills Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Panel>

        {/* Top Recommendation Intelligence Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {focusMatch ? (
            <Panel glow className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {focusMatch.role.industry}
                    </span>
                    {targetRole?.id === focusMatch.role.id && (
                      <span className="text-sm font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-success border border-emerald-500/20">
                        Designated Target
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 text-xl font-semibold text-foreground">
                    {focusMatch.role.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {focusMatch.role.description}
                  </p>
                </div>

                <ScoreRing score={focusMatch.overallScore} size="md" />
              </div>

              {/* Mathematical Score Decomposition Bar */}
              <div className="pt-3 border-t border-card-border/60">
                <div className="flex items-center justify-between text-sm font-semibold mb-2">
                  <span className="text-muted-foreground">Formula Decomposition</span>
                  <span className="font-mono text-accent-cyan">
                    {focusMatch.overallScore}% Overall
                  </span>
                </div>
                <ScoreDecompositionBar components={focusMatch.components} />
              </div>

              {/* Top Shortfalls Preview */}
              {focusMatch.gaps.length > 0 && (
                <div className="pt-3 border-t border-card-border/60">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-foreground">
                      Key Competency Gaps ({focusMatch.gaps.length})
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {focusMatch.estimatedHours} study hours est.
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {focusMatch.gaps.slice(0, 3).map((gap) => (
                      <div
                        key={gap.skillId}
                        className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/40 border border-card-border/40"
                      >
                        <span className="font-medium text-foreground">
                          {gap.skillName}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-muted-foreground">L{gap.currentLevel} → L{gap.requiredLevel}</span>
                          <span className="text-warning font-semibold">(-{gap.gap})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                {targetRole?.id !== focusMatch.role.id ? (
                  <button
                    onClick={() => setTargetRole(focusMatch.role.id)}
                    className="ui-button text-sm font-semibold px-3 py-1.5 rounded-lg border border-card-border hover:bg-muted/40 text-foreground transition-colors"
                  >
                    Set as Target Career
                  </button>
                ) : (
                  <span className="text-sm text-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Active Target</span>
                  </span>
                )}

                <Link
                  href={`/careers/${focusMatch.role.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Full Mathematical Audit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Panel>
          ) : (
            <Panel className="p-6 text-center text-muted-foreground text-sm">
              Calculating recommendations...
            </Panel>
          )}

          {/* SDG Badges Strip */}
          {focusRole && (
            <Panel className="p-4 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                SDG Linkages:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {focusRole.sdgs.map((sdgId) => (
                  <SdgBadge key={sdgId} sdgId={sdgId} size="sm" showName />
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* Row 3: Active Reskilling Milestone & Trend Radar Digest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Active Milestone */}
        <Panel className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-success" />
                <h3 className="text-sm font-semibold text-foreground">
                  Active Reskilling Milestone
                </h3>
              </div>
              {nextMilestone && (
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-success border border-emerald-500/20">
                  Phase {nextMilestone.phase}
                </span>
              )}
            </div>

            {nextMilestone ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-card-border bg-muted/30 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {nextMilestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Provider: {nextMilestone.provider} • {nextMilestone.hours} estimated hours
                      </p>
                    </div>

                    <button
                      onClick={() => toggleMilestone(nextMilestone.id)}
                      className="ui-button px-2.5 py-1 rounded bg-action hover:bg-action-hover text-primary-foreground border border-primary/30 text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground pt-1 border-t border-card-border/60">
                    <strong>Objective:</strong> {nextMilestone.objective}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-card-border bg-muted/20 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">
                  All Current Milestones Completed!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have successfully finished all learning pathway modules for this career.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total Roadmap: {completedMilestoneIds.length}/{roadmap.length} Milestones
            </span>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <span>View Full 4-Phase Pathway</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Panel>

        {/* Fresh Research Digest */}
        <Panel className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent-cyan" />
                <h3 className="text-sm font-semibold text-foreground">
                  Latest Scientific Research Signals
                </h3>
              </div>
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                HF / MIT / Crossref
              </span>
            </div>

            <div className="space-y-2.5">
              {researchSignals.slice(0, 2).map((sig) => (
                <div
                  key={sig.id}
                  className="p-3 rounded-lg border border-card-border bg-muted/30 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground line-clamp-1">
                      {sig.title}
                    </span>
                    <span className="text-sm text-muted-foreground shrink-0">
                      {sig.source}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {sig.observation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Scientific publication activity (Research proxy)
            </span>
            <Link
              href="/radar"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <span>Open Trend Radar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Panel>
      </div>

      {/* Row 4: Strategic Action Modules Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/careers"
          className="ui-button ui-button-secondary p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-primary/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Compass className="h-4 w-4" />
            <span>Career Directory</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore all 10 catalogued benchmark occupations ranked by deterministic match.
          </p>
        </Link>

        <Link
          href="/scenarios"
          className="ui-button ui-button-secondary p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-purple-400/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-chart-3 font-semibold text-xs uppercase tracking-wider">
            <Sliders className="h-4 w-4" />
            <span>Scenario Lab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Simulate Slower vs. Rapid AI adoption shocks and test score sensitivity.
          </p>
        </Link>

        <Link
          href="/sdgs"
          className="ui-button ui-button-secondary p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-emerald-400/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-success font-semibold text-xs uppercase tracking-wider">
            <Globe className="h-4 w-4" />
            <span>UN SDG Matrix</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect reskilling milestones with the 17 UN Sustainable Development Goals.
          </p>
        </Link>

        <Link
          href="/employer"
          className="ui-button ui-button-secondary p-4 rounded-xl border border-card-border bg-card/60 hover:bg-card hover:border-amber-400/40 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-warning font-semibold text-xs uppercase tracking-wider">
            <Users className="h-4 w-4" />
            <span>Employer Cohorts</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Inspect capability analytics across synthetic Malaysian enterprise teams.
          </p>
        </Link>
      </div>
    </div>
  );
}
