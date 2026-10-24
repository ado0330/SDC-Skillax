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
import { AIScenario } from "@/lib/domain/types";
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
  } = useWorkspace();

  // Compute 3 scenario benchmarks across all 10 roles
  const slowerMatches = useMemo(() => {
    return rankCareerRoles(
      ROLES_CATALOG,
      profile.skills,
      profile.interests,
      profile.targetRoleId,
      "slower",
      0,
      researchSignals,
      workforceObservations
    );
  }, [profile.skills, profile.interests, profile.targetRoleId, researchSignals, workforceObservations]);

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

  // Current active matches with boost
  const activeMatches = useMemo(() => {
    return rankCareerRoles(
      ROLES_CATALOG,
      profile.skills,
      profile.interests,
      profile.targetRoleId,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations
    );
  }, [profile.skills, profile.interests, profile.targetRoleId, scenario, simulationBoost, researchSignals, workforceObservations]);

  const scenariosMeta = [
    {
      id: "slower" as AIScenario,
      name: "Slower Adoption",
      badgeColor: "border-amber-500/40 bg-amber-500/10 text-amber-400",
      description: "Gradual automation integration, constrained technical capital expenditure, and extended reliance on legacy organizational processes.",
      rules: [
        "AI literacy requirement reduced by 1 level on all roles (min 1)",
        "Research market score lowered for technical skills",
        "Roadmaps deprioritize AI and automation modules",
      ],
    },
    {
      id: "moderate" as AIScenario,
      name: "Moderate Adoption (Baseline)",
      badgeColor: "border-blue-500/40 bg-blue-500/10 text-blue-400",
      description: "Steady digital adoption aligned with standard Malaysian national technology roadmaps and enterprise digitization programs.",
      rules: [
        "Standard catalogued role requirement thresholds",
        "Neutral research market activity adjustments",
        "Balanced gap sequencing across foundational and applied phases",
      ],
    },
    {
      id: "rapid" as AIScenario,
      name: "Rapid Adoption",
      badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      description: "Aggressive generative AI rollout, enterprise agentic process integration, and widespread automated analytics workflows.",
      rules: [
        "AI literacy requirement increased by 1 (max 5) or injected at Level 3",
        "Research market score boosted for high-exposure occupations",
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
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Decision Support & Uncertainty Notice
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
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
                    ? "ring-2 ring-primary border-primary bg-primary/5 shadow-glow"
                    : "hover:border-card-border/80 bg-card/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${sc.badgeColor}`}>
                    {sc.name}
                  </span>
                  {isSelected && (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed min-h-[3rem]">
                  {sc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-card-border/60 space-y-1.5 text-[11px] text-muted-foreground">
                  {sc.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
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
          title="Hypothetical Market Activity Boost (-100 to +100)"
          subtitle="Simulate bidirectional research and demand acceleration on technical career tracks"
          icon={<Gauge className="h-4 w-4" />}
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-foreground">
                  Simulation Multiplier:
                </span>
                <span
                  className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                    simulationBoost > 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : simulationBoost < 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {simulationBoost > 0 ? `+${simulationBoost}` : simulationBoost} pts
                </span>
              </div>

              {simulationBoost !== 0 && (
                <button
                  onClick={() => setSimulationBoost(0)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to Baseline (0)</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min={-100}
                max={100}
                step={5}
                value={simulationBoost}
                onChange={(e) => setSimulationBoost(parseInt(e.target.value) || 0)}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>-100 (Market Downturn)</span>
                <span>0 (Standard Baseline)</span>
                <span>+100 (Hyper-Growth)</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic">
              Formula impact: <code className="font-mono text-cyan-400">simulationAdjustment = boost × technicalShare × 0.4</code>. Occupations requiring AI, ML, Python, and Automation experience dynamic sensitivity changes.
            </p>
          </div>
        </Panel>

        {/* Cross-Scenario Score Comparison Table (F-040) */}
        <Panel
          title="Cross-Scenario Comparative Audit Matrix"
          subtitle="Side-by-side evaluation of all 10 catalogued occupations across Slower, Moderate, and Rapid scenarios"
          icon={<Sliders className="h-4 w-4" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-card-border text-muted-foreground font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 pr-4">Occupation Title</th>
                  <th className="py-2.5 px-3">Industry</th>
                  <th className="py-2.5 px-3 text-center">Slower</th>
                  <th className="py-2.5 px-3 text-center">Moderate</th>
                  <th className="py-2.5 px-3 text-center">Rapid</th>
                  <th className="py-2.5 px-3 text-center font-bold text-foreground">Active ({scenario})</th>
                  <th className="py-2.5 px-3 text-center">Sensitivity Delta</th>
                  <th className="py-2.5 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60">
                {ROLES_CATALOG.map((role) => {
                  const slowScore =
                    slowerMatches.find((m) => m.role.id === role.id)?.overallScore || 0;
                  const modScore =
                    moderateMatches.find((m) => m.role.id === role.id)?.overallScore || 0;
                  const rapidScore =
                    rapidMatches.find((m) => m.role.id === role.id)?.overallScore || 0;
                  const currentScore =
                    activeMatches.find((m) => m.role.id === role.id)?.overallScore || 0;

                  const delta = rapidScore - slowScore;

                  return (
                    <tr key={role.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-foreground">
                        <Link href={`/careers/${role.id}`} className="hover:text-cyan-400">
                          {role.name}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {role.industry}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-amber-400">
                        {slowScore}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-blue-400">
                        {modScore}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-400">
                        {rapidScore}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-foreground">
                        {currentScore}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[11px]">
                        <span
                          className={
                            delta > 0
                              ? "text-emerald-400"
                              : delta < 0
                              ? "text-amber-400"
                              : "text-muted-foreground"
                          }
                        >
                          {delta > 0 ? `+${delta}` : delta}%
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <Link
                          href={`/careers/${role.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-[11px]"
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
