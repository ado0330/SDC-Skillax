"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { LevelDots } from "@/components/LevelDots";
import { ScoreRing } from "@/components/ScoreRing";
import { SYNTHETIC_WORKERS } from "@/lib/data/syntheticWorkers";
import { ROLES_CATALOG } from "@/lib/data/roles";
import { SKILLS_CATALOG, SKILLS_BY_ID } from "@/lib/data/skills";
import { rankCareerRoles } from "@/lib/domain/scoring";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Target,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building2,
  CheckCircle2,
  BarChart3,
  Layers,
  Search,
} from "lucide-react";

export default function EmployerWorkforcePage() {
  const router = useRouter();
  const { loadSyntheticPreset, scenario, simulationBoost, researchSignals, workforceObservations } = useWorkspace();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("worker-aina");
  const [roleSearch, setRoleSearch] = useState<string>("");

  // Calculate top match for each synthetic worker
  const workerMatches = useMemo(() => {
    return SYNTHETIC_WORKERS.map((worker) => {
      const matches = rankCareerRoles(
        ROLES_CATALOG,
        worker.skills,
        [], // no specific interest override
        undefined,
        scenario,
        simulationBoost,
        researchSignals,
        workforceObservations
      );
      return {
        worker,
        topMatch: matches[0],
        allMatches: matches,
      };
    });
  }, [scenario, simulationBoost, researchSignals, workforceObservations]);

  // Aggregate category skill averages across all 3 workers
  const cohortAverages = useMemo(() => {
    const skillAverages = SKILLS_CATALOG.map((skill) => {
      const sum = SYNTHETIC_WORKERS.reduce((acc, w) => acc + (w.skills[skill.id] || 0), 0);
      const avg = Number((sum / SYNTHETIC_WORKERS.length).toFixed(1));
      return {
        skillId: skill.id,
        name: skill.name,
        category: skill.category,
        average: avg,
      };
    });

    // Group by category
    const byCategory = {
      Transferable: skillAverages.filter((s) => s.category === "Transferable"),
      Digital: skillAverages.filter((s) => s.category === "Digital"),
      Technical: skillAverages.filter((s) => s.category === "Technical"),
    };

    const overallAvg = Number(
      (
        skillAverages.reduce((acc, s) => acc + s.average, 0) /
        skillAverages.length
      ).toFixed(1)
    );

    return {
      skillAverages,
      byCategory,
      overallAvg,
    };
  }, []);

  // Organizational Requirement Coverage across 10 benchmark roles
  const coverageMatrix = useMemo(() => {
    return ROLES_CATALOG.map((role) => {
      const readyWorkers = workerMatches.filter((wm) => {
        const match = wm.allMatches.find((m) => m.role.id === role.id);
        return match && match.overallScore >= 60;
      });

      // Find skills required by this role that have 0 workers meeting the requirement
      const unmetSkills = role.requirements.filter((req) => {
        const anyMet = SYNTHETIC_WORKERS.some(
          (w) => (w.skills[req.skillId] || 0) >= req.level
        );
        return !anyMet;
      });

      const readinessScore = Math.round(
        ((role.requirements.length - unmetSkills.length) / role.requirements.length) * 100
      );

      const priority =
        readinessScore < 40 ? "High Priority" : readinessScore < 75 ? "Moderate" : "On Track";

      return {
        role,
        readyWorkersCount: readyWorkers.length,
        unmetSkills,
        readinessScore,
        priority,
      };
    }).sort((a, b) => a.readinessScore - b.readinessScore);
  }, [workerMatches]);

  const activeWorkerData = workerMatches.find((wm) => wm.worker.id === selectedWorkerId) || workerMatches[0];

  const handleSimulateInSandbox = (workerId: string) => {
    // Map worker id to sample cv preset id
    const presetMap: Record<string, string> = {
      "worker-aina": "sample-aina",
      "worker-daniel": "sample-daniel",
      "worker-kumar": "sample-kumar",
    };
    const presetId = presetMap[workerId] || "sample-aina";
    loadSyntheticPreset(presetId);
    router.push("/");
  };

  const filteredCoverage = useMemo(() => {
    if (!roleSearch.trim()) return coverageMatrix;
    return coverageMatrix.filter(
      (item) =>
        item.role.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
        item.role.industry.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [coverageMatrix, roleSearch]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Workforce Capability Intelligence"
        title="Enterprise Capability Planning &amp; Cohort Analytics"
        description="Strategic capability mapping and training needs analysis across synthetic Malaysian enterprise teams. Identify capability shortfalls, forecast transition pipelines, and plan targeted upskilling."
      />

      {/* Mandatory Statutory Screening Disclaimer */}
      <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5 text-amber-200">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Statutory Disclaimer: Aggregate Capability Planning View Only
            </h3>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              This module is designed strictly for organizational capability mapping, collective training needs analysis, and curriculum planning. In compliance with fair labor practices, this platform is <strong>explicitly NOT intended or certified</strong> for automated hiring screening, adverse employment decisions, promotion filtering, or individual performance appraisal. All data shown uses synthetic benchmark personas.
            </p>
          </div>
        </div>
      </div>

      {/* Top Cohort Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Panel glow className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Cohort Size</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {SYNTHETIC_WORKERS.length}
            </span>
            <span className="text-xs text-muted-foreground">Synthetic Profiles</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Cross-departmental pilot cohort
          </p>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Cohort Average Rating</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {cohortAverages.overallAvg}
            </span>
            <span className="text-xs text-muted-foreground">/ 5.0 Baseline</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Across 19 standard national competencies
          </p>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Top Capability Domain</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-foreground">
              Transferable Skills (3.2/5)
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Project Organization &amp; Operational Communication
            </p>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Primary Training Priority</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-rose-400">
              AI &amp; Automation Literacy
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cohort average 1.7/5 vs. required 3.5 target
            </p>
          </div>
        </Panel>
      </div>

      {/* Cohort Capability Distribution by Category */}
      <Panel className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Competency Benchmarks by Skill Category</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Aggregated proficiency averages across the 3 synthetic enterprise workers.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Cohort Average</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-card-border" />
              <span>Scale (1-5)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transferable Skills */}
          <div className="space-y-3 p-4 rounded-xl border border-card-border bg-muted/20">
            <div className="flex items-center justify-between pb-2 border-b border-card-border">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Transferable (5)
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground">
                Avg:{" "}
                {(
                  cohortAverages.byCategory.Transferable.reduce((a, b) => a + b.average, 0) / 5
                ).toFixed(1)}
                /5
              </span>
            </div>

            <div className="space-y-2.5">
              {cohortAverages.byCategory.Transferable.map((sk) => (
                <div key={sk.skillId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{sk.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{sk.average}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-card-border overflow-hidden">
                    <div
                      style={{ width: `${(sk.average / 5) * 100}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Skills */}
          <div className="space-y-3 p-4 rounded-xl border border-card-border bg-muted/20">
            <div className="flex items-center justify-between pb-2 border-b border-card-border">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Digital &amp; Analytical (5)
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground">
                Avg:{" "}
                {(
                  cohortAverages.byCategory.Digital.reduce((a, b) => a + b.average, 0) / 5
                ).toFixed(1)}
                /5
              </span>
            </div>

            <div className="space-y-2.5">
              {cohortAverages.byCategory.Digital.map((sk) => (
                <div key={sk.skillId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{sk.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{sk.average}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-card-border overflow-hidden">
                    <div
                      style={{ width: `${(sk.average / 5) * 100}%` }}
                      className="h-full bg-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3 p-4 rounded-xl border border-card-border bg-muted/20">
            <div className="flex items-center justify-between pb-2 border-b border-card-border">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Technical &amp; Systems (9)
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground">
                Avg:{" "}
                {(
                  cohortAverages.byCategory.Technical.reduce((a, b) => a + b.average, 0) / 9
                ).toFixed(1)}
                /5
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {cohortAverages.byCategory.Technical.map((sk) => (
                <div key={sk.skillId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{sk.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{sk.average}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-card-border overflow-hidden">
                    <div
                      style={{ width: `${(sk.average / 5) * 100}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Cohort Workers Detail Deep Dive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <span>Synthetic Worker Profiles ({SYNTHETIC_WORKERS.length})</span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Select worker to inspect transition recommendations
          </span>
        </div>

        {/* Worker Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {workerMatches.map(({ worker, topMatch }) => {
            const isSelected = worker.id === selectedWorkerId;

            return (
              <button
                key={worker.id}
                onClick={() => setSelectedWorkerId(worker.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                    : "border-card-border bg-card/60 hover:bg-card hover:border-card-border/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-foreground">
                    {worker.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {worker.experience} yrs
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {worker.title}
                </div>
                <div className="mt-3 pt-2 border-t border-card-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Top Transition:</span>
                  <span className="font-semibold text-primary">
                    {topMatch?.role.name} ({topMatch?.overallScore}%)
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Worker Detailed Card */}
        {activeWorkerData && (
          <Panel glow className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-card-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {activeWorkerData.worker.department}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activeWorkerData.worker.experience} years experience
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {activeWorkerData.worker.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{activeWorkerData.worker.education}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                  {activeWorkerData.worker.bio}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                <button
                  onClick={() => handleSimulateInSandbox(activeWorkerData.worker.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open in Personal OS</span>
                </button>
              </div>
            </div>

            {/* Current Skills Matrix & Gaps for Top Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Proficiencies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Current Assessed Capabilities
                </h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {Object.entries(activeWorkerData.worker.skills).map(([skillId, lvl]) => {
                    const sk = SKILLS_BY_ID.get(skillId);
                    return (
                      <div
                        key={skillId}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs"
                      >
                        <span className="font-medium text-foreground">
                          {sk?.name || skillId}
                        </span>
                        <LevelDots currentLevel={lvl} maxLevel={5} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Career Transitions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Top Recommended Transition Pathways
                </h4>
                <div className="space-y-2">
                  {activeWorkerData.allMatches.slice(0, 3).map((match) => (
                    <div
                      key={match.role.id}
                      className="p-3 rounded-lg border border-card-border bg-muted/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">
                          {match.role.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {match.gaps.length} capability gaps • {match.estimatedHours} hrs est.
                        </span>
                      </div>
                      <ScoreRing score={match.overallScore} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        )}
      </div>

      {/* Organizational Requirement Coverage Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>Priority Occupational Requirement Coverage (10 Benchmark Occupations)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assessing enterprise capability coverage against Malaysia&apos;s digital transformation goals.
            </p>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search occupation or industry..."
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-card-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-card-border overflow-hidden bg-card divide-y divide-card-border/60">
          <div className="grid grid-cols-12 gap-3 p-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
            <span className="col-span-4">Benchmark Role</span>
            <span className="col-span-2 text-center">Cohort Ready</span>
            <span className="col-span-3 text-center">Cohort Readiness Index</span>
            <span className="col-span-3 text-right">Strategic Priority</span>
          </div>

          {filteredCoverage.map((item) => (
            <div
              key={item.role.id}
              className="grid grid-cols-12 gap-3 p-4 items-center text-xs hover:bg-muted/20 transition-colors"
            >
              <div className="col-span-4 space-y-0.5">
                <span className="font-bold text-foreground block">
                  {item.role.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.role.industry}
                </span>
              </div>

              <div className="col-span-2 text-center font-mono">
                <span className="font-bold text-foreground">
                  {item.readyWorkersCount}
                </span>{" "}
                <span className="text-muted-foreground text-[11px]">/ 3 Workers</span>
              </div>

              <div className="col-span-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span>{item.readinessScore}%</span>
                  <span className="text-muted-foreground">
                    {item.unmetSkills.length} unmet requirements
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-card-border overflow-hidden">
                  <div
                    style={{ width: `${item.readinessScore}%` }}
                    className={`h-full rounded-full ${
                      item.readinessScore >= 75
                        ? "bg-emerald-500"
                        : item.readinessScore >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                </div>
              </div>

              <div className="col-span-3 text-right">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                    item.priority === "High Priority"
                      ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                      : item.priority === "Moderate"
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
