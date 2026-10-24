"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ScoreRing } from "@/components/ScoreRing";
import { SdgBadge } from "@/components/SdgBadge";
import {
  Compass,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Sparkles,
  Layers,
} from "lucide-react";

const INDUSTRIES = [
  "All Industries",
  "Business & Services",
  "Technology",
  "Manufacturing",
  "Sustainability",
  "Health",
  "Agriculture",
];

export default function CareersPage() {
  const { matches, targetRole, setTargetRole } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesSearch =
        searchQuery === "" ||
        match.role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.role.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesInd =
        selectedIndustry === "All Industries" ||
        match.role.industry.toLowerCase() === selectedIndustry.toLowerCase();

      return matchesSearch && matchesInd;
    });
  }, [matches, searchQuery, selectedIndustry]);

  return (
    <ProfileGate>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Explainable Career Intelligence"
          title="Career Suitability Matches"
          description="Deterministic ranking of 10 benchmark O*NET occupations evaluated against your current capabilities, interests, and live market signals."
        >
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>10 Roles Evaluated Deterministically</span>
          </div>
        </PageHeader>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search career role title, description, or requirements..."
              className="w-full rounded-md border border-card-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="rounded-md border border-card-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Career Cards Directory */}
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const isTarget = targetRole?.id === match.role.id;

            return (
              <Panel
                key={match.role.id}
                glowTarget={isTarget}
                className="transition-all hover:border-primary/50"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Rank, ScoreRing & Role Details */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <ScoreRing score={match.overallScore} size="md" />

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          #{match.rank}
                        </span>
                        <h3 className="text-base font-bold text-foreground">
                          {match.role.name}
                        </h3>
                        {isTarget && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                            <Target className="h-3 w-3" />
                            Target Career
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
                        {match.role.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                        <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                          {match.role.industry}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-amber-400" />
                          <span>
                            {match.missingCount === 0
                              ? "All requirements met"
                              : `${match.missingCount} skill gaps`}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-cyan-400" />
                          <span>~{match.estimatedHours} study hours</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: SDGs & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                    <div className="flex flex-wrap gap-1">
                      {match.role.sdgs.map((sdgId) => (
                        <SdgBadge key={sdgId} sdgId={sdgId} size="sm" />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {!isTarget && (
                        <button
                          onClick={() => setTargetRole(match.role.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <Target className="h-3.5 w-3.5" />
                          <span>Set Target</span>
                        </button>
                      )}
                      <Link
                        href={`/careers/${match.role.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                      >
                        <span>Audit Match</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Subcomponent Mini Bar Preview */}
                <div className="mt-4 pt-3 border-t border-card-border/60 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Direct Skills (50%)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {match.components.skillsScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Transferable (20%)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {match.components.transferableScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Interest Fit (15%)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {match.components.interestScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Research (15%)</span>
                    <span className="font-mono font-semibold text-foreground">
                      {match.components.marketScore}%
                    </span>
                  </div>
                  {match.components.workforceScore !== null && (
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Workforce (10%)</span>
                      <span className="font-mono font-semibold text-rose-400">
                        {match.components.workforceScore}%
                      </span>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </ProfileGate>
  );
}
