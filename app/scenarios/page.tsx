"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ScoreRing } from "@/components/ScoreRing";
import { ROLES_CATALOG } from "@/lib/data/roles";
import { rankCareerRoles } from "@/lib/domain/scoring";
import { generateLearningRoadmap } from "@/lib/domain/roadmap";
import { AIScenario } from "@/lib/domain/types";
import { findResearchSignalsForSkills } from "@/lib/domain/trends";
import { formatDisplayDate } from "@/lib/utils";
import {
  Sliders,
  Sparkles,
  Zap,
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Target,
  Gauge,
  Activity,
} from "lucide-react";

export default function ScenariosPage() {
  const {
    profile,
    scenario,
    setScenario,
    simulationBoost,
    setSimulationBoost,
    researchSignals,
    workforceObservations,
    completedMilestoneIds,
  } = useWorkspace();

  // Compute 3 scenario benchmarks across all 10 roles
  const moderateMatches = useMemo(() => {
    return rankCareerRoles(
      ROLES_CATALOG,
      profile.skills,
      profile.interests,
      profile.targetRoleId,
      "moderate",
      0,
      researchSignals,
      workforceObservations
    );
  }, [profile.skills, profile.interests, profile.targetRoleId, researchSignals, workforceObservations]);

  const rapidMatches = useMemo(() => {
    return rankCareerRoles(
      ROLES_CATALOG,
      profile.skills,
      profile.interests,
      profile.targetRoleId,
      "rapid",
      0,
      researchSignals,
      workforceObservations
    );
  }, [profile.skills, profile.interests, profile.targetRoleId, researchSignals, workforceObservations]);

  const comparisonRoleId = profile.targetRoleId || moderateMatches[0]?.role.id;
  const moderateRoleMatch = moderateMatches.find((match) => match.role.id === comparisonRoleId);
  const rapidRoleMatch = rapidMatches.find((match) => match.role.id === comparisonRoleId);
  const moderateNextStep = moderateRoleMatch
    ? generateLearningRoadmap(moderateRoleMatch.role, profile.skills, "moderate", new Set(completedMilestoneIds)).find((step) => !step.completed)
    : undefined;
  const rapidNextStep = rapidRoleMatch
    ? generateLearningRoadmap(rapidRoleMatch.role, profile.skills, "rapid", new Set(completedMilestoneIds)).find((step) => !step.completed)
    : undefined;
  const changedSkillGaps = moderateRoleMatch && rapidRoleMatch
    ? [...new Set([...moderateRoleMatch.gaps, ...rapidRoleMatch.gaps].map((gap) => gap.skillId))]
        .map((skillId) => ({
          moderate: moderateRoleMatch.gaps.find((gap) => gap.skillId === skillId),
          rapid: rapidRoleMatch.gaps.find((gap) => gap.skillId === skillId),
        }))
        .filter(({ moderate, rapid }) => moderate?.requiredLevel !== rapid?.requiredLevel || moderate?.gap !== rapid?.gap)
    : [];
  const roleResearch = moderateRoleMatch
    ? findResearchSignalsForSkills(moderateRoleMatch.role.requirements.map((requirement) => requirement.skillId), researchSignals).slice(0, 3)
    : [];

  const scenariosMeta = [
    {
      id: "slower" as AIScenario,
      name: "Slower Adoption",
      badgeColor: "border-amber-500/40 bg-amber-500/10 text-warning",
      description: "Gradual automation integration, constrained technical capital expenditure, and extended reliance on legacy organizational processes.",
      rules: [
        "AI literacy requirement reduced by 1 level on all roles (min 1)",
        "Scenario market adjustment: −10 × technical share + 0.05 × role exposure",
        "Roadmaps deprioritize AI and automation modules",
      ],
    },
    {
      id: "moderate" as AIScenario,
      name: "Moderate Adoption (Baseline)",
      badgeColor: "border-blue-500/40 bg-blue-500/10 text-primary",
      description: "Steady digital adoption aligned with standard Malaysian national technology roadmaps and enterprise digitization programs.",
      rules: [
        "Standard catalogued role requirement thresholds",
        "No scenario adjustment to the market index",
        "Balanced gap sequencing across foundational and applied phases",
      ],
    },
    {
      id: "rapid" as AIScenario,
      name: "Rapid Adoption",
      badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-success",
      description: "Aggressive generative AI rollout, enterprise agentic process integration, and widespread automated analytics workflows.",
      rules: [
        "AI literacy requirement increased by 1 (max 5) or injected at Level 3",
        "Scenario market adjustment: +20 × technical share − 0.10 × role exposure",
        "Roadmaps prioritize AI, ML, and automation gaps upfront",
      ],
    },
  ];

  return (
    <ProfileGate>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Sensitivity Simulation"
          title="Scenario Lab & Market Sensitivity"
          description="Explore how varying AI adoption rates and hypothetical market shifts alter occupational suitability and skill requirements."
        />

        {/* Disclaimer Panel */}
        <Panel className="border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-warning">
                Decision Support & Uncertainty Notice
              </h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Future adoption scenarios test your profile's sensitivity to macroeconomic technology shifts. They represent mathematical stress tests for career resilience, not definitive predictions of employment likelihood.
              </p>
            </div>
          </div>
        </Panel>

        {/* 3 Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenariosMeta.map((sc) => {
            const isSelected = scenario === sc.id;

            return (
              <div
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`panel-card p-5 cursor-pointer transition-all ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-primary/5 shadow-sm"
                    : "hover:border-card-border/80 bg-card/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-sm font-semibold ${sc.badgeColor}`}>
                    {sc.name}
                  </span>
                  {isSelected && (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                  {sc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-card-border/60 space-y-1.5 text-sm text-muted-foreground">
                  {sc.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-accent-cyan font-semibold">•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hypothetical Simulation Boost Slider (F-041) */}
        <Panel
          title="Hypothetical market adjustment (-100 to +100)"
          subtitle="A user-controlled stress-test input; not observed demand"
          icon={<Gauge className="h-4 w-4" />}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  Simulation Multiplier:
                </span>
                <span
                  className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                    simulationBoost > 0
                      ? "bg-emerald-500/20 text-success"
                      : simulationBoost < 0
                      ? "bg-red-500/20 text-destructive"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {simulationBoost > 0 ? `+${simulationBoost}` : simulationBoost} pts
                </span>
              </div>

              {simulationBoost !== 0 && (
                <button
                  onClick={() => setSimulationBoost(0)}
                  className="ui-button inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to Baseline (0)</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              <input aria-label="Simulation boost"
                type="range"
                min={-100}
                max={100}
                step={5}
                value={simulationBoost}
                onChange={(e) => setSimulationBoost(parseInt(e.target.value) || 0)}
                className="ui-field w-full accent-cyan-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between font-mono text-xs text-muted-foreground">
                <span>-100 (Market Downturn)</span>
                <span>0 (Standard Baseline)</span>
                <span>+100 (Hyper-Growth)</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Formula impact: <code className="font-mono text-accent-cyan">simulationAdjustment = boost × technicalShare × 0.4</code>. Occupations requiring AI, ML, Python, and Automation experience dynamic sensitivity changes.
            </p>
          </div>
        </Panel>

        {/* What-if comparison reuses the deterministic career ranking and roadmap logic. */}
        <Panel
          title="Moderate vs Rapid adoption"
          subtitle="Same profile and interests; scenario estimates, not employment predictions"
          icon={<Sliders className="h-4 w-4" />}
        >
          {moderateRoleMatch && rapidRoleMatch && (
            <div className="mb-4 grid gap-4 border-b border-card-border/60 pb-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-semibold text-foreground">{moderateRoleMatch.role.name}{profile.targetRoleId ? " · selected role" : " · current top match"}</p>
                <p className="mt-1 text-muted-foreground">Changed skill priorities: {changedSkillGaps.length
                  ? changedSkillGaps.map(({ moderate, rapid }) => {
                    const skillName = rapid?.skillName ?? moderate?.skillName ?? "Skill";
                    const before = moderate ? `Level ${moderate.requiredLevel} (gap ${moderate.gap})` : "not required";
                    const after = rapid ? `Level ${rapid.requiredLevel} (gap ${rapid.gap})` : "not required";
                    return `${skillName}: ${before} → ${after}`;
                  }).join("; ")
                  : "No role skill requirement changes for this profile."}</p>
                <p className="mt-1 text-muted-foreground">
                  Next roadmap step: Moderate {moderateNextStep?.title ?? "none"} · Rapid {rapidNextStep?.title ?? "none"}.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Rapid raises an existing AI requirement by one level (up to 5), or adds Level 3 if absent. It also applies the existing technical-share and role-exposure adjustment. These are explicit stress-test assumptions.</p>
                <p className="mt-2 font-semibold text-foreground">Related research context</p>
                {roleResearch.length ? <ul className="mt-1 space-y-1">
                  {roleResearch.map((signal) => <li key={signal.id} className="text-muted-foreground">
                    <a className="text-primary hover:underline" href={signal.sourceUrl} target="_blank" rel="noreferrer">{signal.title}</a>
                    <span> · {signal.source} · {signal.publishedAt ? formatDisplayDate(signal.publishedAt) : "date unavailable"}</span>
                  </li>)}
                </ul> : <p className="mt-1 text-muted-foreground">No current research items match this role&apos;s catalogued skills.</p>}
                <p className="mt-1 text-xs text-muted-foreground">Research provides context only; it does not change scenario scores or imply hiring demand.</p>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border text-muted-foreground font-mono uppercase text-sm tracking-wider">
                  <th className="py-2.5 pr-4">Occupation Title</th>
                  <th className="py-2.5 px-3">Industry</th>
                  <th className="py-2.5 px-3 text-center">Moderate score / rank</th>
                  <th className="py-2.5 px-3 text-center">Rapid score / rank</th>
                  <th className="py-2.5 px-3 text-center">Change</th>
                  <th className="py-2.5 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60">
                {ROLES_CATALOG.map((role) => {
                  const moderateMatch = moderateMatches.find((match) => match.role.id === role.id)!;
                  const rapidMatch = rapidMatches.find((match) => match.role.id === role.id)!;
                  const delta = rapidMatch.overallScore - moderateMatch.overallScore;
                  const rankDelta = moderateMatch.rank - rapidMatch.rank;

                  return (
                    <tr key={role.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-foreground">
                        <Link href={`/careers/${role.id}`} className="hover:text-accent-cyan">
                          {role.name}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {role.industry}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-primary">
                        {moderateMatch.overallScore}% <span className="text-xs text-muted-foreground">#{moderateMatch.rank}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-success">
                        {rapidMatch.overallScore}% <span className="text-xs text-muted-foreground">#{rapidMatch.rank}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-xs">
                        <span
                          className={
                            delta > 0
                              ? "text-success"
                              : delta < 0
                              ? "text-warning"
                              : "text-muted-foreground"
                          }
                        >
                          {delta > 0 ? `+${delta}` : delta} pts · {rankDelta > 0 ? `↑${rankDelta}` : rankDelta < 0 ? `↓${Math.abs(rankDelta)}` : "same rank"}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <Link
                          href={`/careers/${role.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-sm"
                        >
                          <span>Audit</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ProfileGate>
  );
}
