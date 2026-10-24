"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { SdgBadge } from "@/components/SdgBadge";
import { ScoreRing } from "@/components/ScoreRing";
import { LevelDots } from "@/components/LevelDots";
import { SDGS_CATALOG, SDGS_BY_ID } from "@/lib/data/sdgs";
import { ROLES_CATALOG, ROLES_BY_ID } from "@/lib/data/roles";
import { SKILLS_BY_ID } from "@/lib/data/skills";
import {
  Globe,
  Target,
  Sparkles,
  ArrowRight,
  Search,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
} from "lucide-react";

type SdgCategory = "all" | "impacted" | "economic" | "environmental" | "social";

export default function SdgMatrixPage() {
  const { profile, matches, targetRole, setTargetRole } = useWorkspace();
  const [selectedSdgId, setSelectedSdgId] = useState<number>(8); // Default to SDG 8 Decent Work
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<SdgCategory>("all");

  // Map roles to each SDG
  const sdgRolesMap = useMemo(() => {
    const map = new Map<number, typeof ROLES_CATALOG>();
    SDGS_CATALOG.forEach((s) => map.set(s.id, []));

    ROLES_CATALOG.forEach((role) => {
      role.sdgs.forEach((sdgId) => {
        const list = map.get(sdgId) || [];
        list.push(role);
        map.set(sdgId, list);
      });
    });
    return map;
  }, []);

  // Map user match score by roleId
  const scoreByRoleId = useMemo(() => {
    const map = new Map<string, number>();
    matches.forEach((sr) => map.set(sr.role.id, sr.overallScore));
    return map;
  }, [matches]);

  // Distinct SDGs impacted by user's top 3 matched careers
  const topMatchedSdgs = useMemo(() => {
    const sdgSet = new Set<number>();
    matches.slice(0, 3).forEach((sr) => {
      sr.role.sdgs.forEach((id) => sdgSet.add(id));
    });
    return sdgSet;
  }, [matches]);

  // Target role SDGs
  const targetRoleSdgs = useMemo(() => {
    if (!targetRole) return [];
    return targetRole.sdgs;
  }, [targetRole]);

  // Category classification helper
  const matchesCategory = (sdgId: number, category: SdgCategory): boolean => {
    if (category === "all") return true;
    if (category === "impacted") return topMatchedSdgs.has(sdgId);
    if (category === "economic") return [8, 9, 12].includes(sdgId);
    if (category === "environmental") return [6, 7, 13, 14, 15].includes(sdgId);
    if (category === "social") return [1, 2, 3, 4, 5, 10, 16, 17].includes(sdgId);
    return true;
  };

  // Filtered SDGs for grid
  const filteredSdgs = useMemo(() => {
    return SDGS_CATALOG.filter((sdg) => {
      const matchesSearch =
        sdg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sdg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sdg.id.toString() === searchQuery.trim();
      return matchesSearch && matchesCategory(sdg.id, categoryFilter);
    });
  }, [searchQuery, categoryFilter, topMatchedSdgs]);

  const activeSdg = SDGS_BY_ID.get(selectedSdgId) || SDGS_CATALOG[7];
  const activeSdgRoles = sdgRolesMap.get(selectedSdgId) || [];

  // Associated user skills across active SDG roles
  const activeSdgSkills = useMemo(() => {
    const skillMap = new Map<string, { current: number; required: number; count: number }>();
    activeSdgRoles.forEach((role) => {
      role.requirements.forEach((req) => {
        const existing = skillMap.get(req.skillId);
        const userLevel = profile.skills[req.skillId] || 0;
        if (!existing) {
          skillMap.set(req.skillId, {
            current: userLevel,
            required: req.level,
            count: 1,
          });
        } else {
          existing.required = Math.max(existing.required, req.level);
          existing.count += 1;
        }
      });
    });

    return Array.from(skillMap.entries()).map(([skillId, data]) => {
      const meta = SKILLS_BY_ID.get(skillId);
      return {
        skillId,
        name: meta?.name || skillId,
        category: meta?.category || "Technical",
        current: data.current,
        required: data.required,
        met: data.current >= data.required,
        shortfall: Math.max(0, data.required - data.current),
      };
    }).sort((a, b) => b.shortfall - a.shortfall);
  }, [activeSdgRoles, profile.skills]);

  return (
    <ProfileGate>
      <div className="space-y-8 pb-12">
        <PageHeader
          eyebrow="SDG Impact Intelligence"
          title="UN Sustainable Development Goals Matrix"
          description="Track how your reskilling pathway directly contributes to the United Nations 17 Sustainable Development Goals (SDGs) and Malaysian green-tech economic growth."
        >
          {targetRole && (
            <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card/60 px-3 py-1.5 text-sm text-muted-foreground">
              <Target className="h-4 w-4 text-primary" />
              <span>Target: <strong className="text-foreground">{targetRole.name}</strong></span>
            </div>
          )}
        </PageHeader>

        {/* Top Impact Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Panel glow className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Direct SDG Footprint</span>
              <Globe className="h-4 w-4 text-accent-cyan" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground tracking-tight">
                {topMatchedSdgs.size}
              </span>
              <span className="text-sm text-muted-foreground">/ 17 Goals</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Directly advanced by your top 3 recommended career pathways.
            </p>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Target Role Alignment</span>
              <Target className="h-4 w-4 text-success" />
            </div>
            {targetRole ? (
              <div className="mt-3">
                <div className="text-sm font-semibold text-foreground truncate">
                  {targetRole.name}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {targetRoleSdgs.map((id) => (
                    <SdgBadge key={id} sdgId={id} size="sm" showName />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground italic">No target role designated</span>
                <p className="text-sm text-muted-foreground mt-1">Set a target in Career Matches</p>
              </div>
            )}
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Catalogued Benchmark Roles</span>
              <Layers className="h-4 w-4 text-chart-3" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground tracking-tight">
                {ROLES_CATALOG.length}
              </span>
              <span className="text-sm text-muted-foreground">Occupations Mapped</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              All 10 occupations mapped to O*NET task-sustainability indicators.
            </p>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Primary Impact Domain</span>
              <Award className="h-4 w-4 text-warning" />
            </div>
            <div className="mt-3">
              <div className="text-base font-semibold text-foreground">
                SDG 8 &amp; SDG 9
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Decent Work &amp; Resilient Industry Innovation (Highest cohort density).
              </p>
            </div>
          </Panel>
        </div>

        {/* Filter Bar & Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-card border border-card-border">
            {[
              { id: "all", label: "All 17 SDGs" },
              { id: "impacted", label: `My Footprint (${topMatchedSdgs.size})` },
              { id: "economic", label: "Economic (8, 9, 12)" },
              { id: "environmental", label: "Environmental (6, 7, 13-15)" },
              { id: "social", label: "Social & Institutional" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as SdgCategory)}
                className={`ui-button px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  categoryFilter === cat.id
                    ? "bg-action text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input aria-label="Search SDG by number or keyword..."
              type="text"
              placeholder="Search SDG by number or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ui-field w-full pl-9 pr-3 py-1.5 rounded-lg border border-card-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* 17 UN SDG Interactive Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Official UN SDG Directory ({filteredSdgs.length} shown) — Click to Inspect
            </h3>
            <span className="text-sm text-muted-foreground">
              Selected: <strong className="text-foreground">SDG {activeSdg.id}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredSdgs.map((sdg) => {
              const isSelected = sdg.id === selectedSdgId;
              const mappedRoles = sdgRolesMap.get(sdg.id) || [];
              const isImpacted = topMatchedSdgs.has(sdg.id);

              return (
                <button
                  key={sdg.id}
                  onClick={() => setSelectedSdgId(sdg.id)}
                  style={{
                    borderLeftColor: sdg.color,
                  }}
                  className={`ui-button relative p-3 rounded-xl border text-left transition-all duration-200 border-l-4 flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/40 -translate-y-0.5"
                      : "border-card-border bg-card/60 hover:bg-card hover:border-card-border hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        style={{
                          backgroundColor: sdg.color,
                          color: sdg.textColor,
                        }}
                        className="px-1.5 py-0.5 rounded text-sm font-mono font-semibold"
                      >
                        {String(sdg.id).padStart(2, "0")}
                      </span>

                      {isImpacted && (
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" title="Impacted by your top career recommendations" />
                      )}
                    </div>

                    <div className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                      {sdg.name}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-card-border/50 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{mappedRoles.length} role{mappedRoles.length !== 1 ? "s" : ""}</span>
                    {mappedRoles.length > 0 && (
                      <span className="text-primary font-semibold text-sm">
                        {Math.max(...mappedRoles.map((r) => scoreByRoleId.get(r.id) || 0))}% max
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected SDG Deep Dive Section */}
        <div className="space-y-6">
          {/* SDG Banner */}
          <div
            style={{
              borderColor: activeSdg.color,
            }}
            className="rounded-2xl border-2 overflow-hidden bg-card shadow-lg"
          >
            <div
              style={{
                backgroundColor: activeSdg.color,
                color: activeSdg.textColor,
              }}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/20 backdrop-blur text-2xl font-black font-mono">
                    {String(activeSdg.id).padStart(2, "0")}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest opacity-80">
                      United Nations Goal {activeSdg.id}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                      {activeSdg.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://sdgs.un.org/goals/goal${activeSdg.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ui-button inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 backdrop-blur text-sm font-semibold transition-colors"
                  >
                    <span>UN SDG Factsheet</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <p className="mt-4 text-sm md:text-base leading-relaxed opacity-95 max-w-4xl">
                {activeSdg.description}
              </p>
            </div>

            {/* Sub-bar explaining Malaysian workforce alignment */}
            <div className="px-6 py-3 bg-muted/40 border-t border-card-border flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-warning" />
                <span>
                  <strong>Malaysian Workforce Context:</strong> Upskilling local talent in digital, automation, and data telemetry accelerates SDG {activeSdg.id} compliance across regional industries.
                </span>
              </div>
              <span className="font-semibold text-foreground">
                {activeSdgRoles.length} Associated Catalog Occupations
              </span>
            </div>
          </div>

          {/* Dual Columns: Associated Occupations & Skills Relevance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Associated Occupations (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span>Mapped Occupations ({activeSdgRoles.length})</span>
                </h3>
                <span className="text-sm text-muted-foreground">
                  Ranked by your profile match
                </span>
              </div>

              {activeSdgRoles.length === 0 ? (
                <Panel className="p-8 text-center text-muted-foreground">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    No Direct Catalog Occupations Mapped to SDG {activeSdg.id}
                  </p>
                  <p className="text-sm mt-1 max-w-md mx-auto">
                    While none of our 10 primary benchmark occupations are tagged exclusively with SDG {activeSdg.id}, transferable competencies such as <em>Problem Solving</em>, <em>Organization</em>, and <em>Digital Literacy</em> empower civic and green projects supporting this goal.
                  </p>
                </Panel>
              ) : (
                <div className="space-y-3">
                  {activeSdgRoles
                    .map((role) => ({
                      ...role,
                      userScore: scoreByRoleId.get(role.id) || 0,
                    }))
                    .sort((a, b) => b.userScore - a.userScore)
                    .map((role) => {
                      const isTarget = targetRole?.id === role.id;

                      return (
                        <Panel key={role.id} glow={isTarget} className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                  {role.industry}
                                </span>
                                {isTarget && (
                                  <span className="text-sm font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-success border border-emerald-500/30">
                                    Target Career
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-semibold text-foreground">
                                {role.name}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {role.description}
                              </p>
                            </div>

                            <div className="flex sm:flex-col items-center justify-between sm:items-end gap-2 shrink-0">
                              <ScoreRing score={role.userScore} size="sm" />
                              <span className="text-sm text-muted-foreground">
                                Overall Match
                              </span>
                            </div>
                          </div>

                          {/* SDG Specific Rationale */}
                          <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-card-border/60 text-sm">
                            <span className="font-semibold text-foreground block mb-1">
                              SDG Impact Rationale:
                            </span>
                            <p className="text-muted-foreground leading-relaxed">
                              {role.sdgRationale}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 flex items-center justify-between pt-3 border-t border-card-border">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {role.sdgs.map((id) => (
                                <SdgBadge key={id} sdgId={id} size="sm" showName={id === selectedSdgId} />
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              {!isTarget && (
                                <button
                                  onClick={() => setTargetRole(role.id)}
                                  className="ui-button text-sm font-medium text-muted-foreground hover:text-foreground px-2.5 py-1 rounded border border-card-border hover:bg-muted/40 transition-colors"
                                >
                                  Set Target
                                </button>
                              )}
                              <Link
                                href={`/careers/${role.id}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                              >
                                <span>Audit Breakdown</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </Panel>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Skills Relevance & Capability Check (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-cyan" />
                  <span>Required Skills for SDG {activeSdg.id}</span>
                </h3>
                <span className="text-sm text-muted-foreground">
                  Your Current Mastery
                </span>
              </div>

              {activeSdgSkills.length === 0 ? (
                <Panel className="p-6 text-center text-muted-foreground text-sm">
                  No explicit skill requirements mapped for this goal.
                </Panel>
              ) : (
                <Panel className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The following competencies are demanded by occupations supporting <strong>SDG {activeSdg.id}</strong>. Improving any skill marked with a gap increases your capacity to contribute directly to this goal.
                  </p>

                  <div className="divide-y divide-card-border/60">
                    {activeSdgSkills.map((sk) => (
                      <div key={sk.skillId} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">
                              {sk.name}
                            </span>
                            <span className="text-sm px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                              {sk.category}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Target: L{sk.required}</span>
                            <span>•</span>
                            <span>Current: L{sk.current}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <LevelDots currentLevel={sk.current} requiredLevel={sk.required} size="sm" />
                          {sk.met ? (
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-success bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Ready</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-warning bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <AlertCircle className="h-3 w-3" />
                              <span>-{sk.shortfall} gap</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ready to close skill shortfalls?</span>
                    <Link
                      href="/roadmap"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>Open Learning Roadmap</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Panel>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProfileGate>
  );
}
