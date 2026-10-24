"use client";

import React, { useState, useMemo } from "react";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ManageDataModal } from "@/components/ManageDataModal";
import { formatDisplayDate } from "@/lib/utils";
import { SKILLS_CATALOG } from "@/lib/data/skills";
import {
  analyzeWorkforceSeries,
  AnalyzedWorkforceSeries,
  TrendDirection,
} from "@/lib/domain/workforce";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Upload,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  Database,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function RadarPage() {
  const {
    researchSignals,
    setResearchSignals,
    workforceObservations,
    importWorkforceObservations,
    resetWorkforceObservations,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<"research" | "workforce">("research");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // 1. Analyze Workforce Observations using pure domain logic
  const analyzedSeries = useMemo(() => {
    return analyzeWorkforceSeries(workforceObservations);
  }, [workforceObservations]);

  // 2. Filter Research Signals
  const filteredSignals = useMemo(() => {
    return researchSignals.filter((sig) => {
      const matchesSearch =
        searchQuery === "" ||
        sig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sig.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sig.observation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkill =
        selectedSkillFilter === "all" ||
        sig.skillIds.includes(selectedSkillFilter);

      return matchesSearch && matchesSkill;
    });
  }, [researchSignals, searchQuery, selectedSkillFilter]);

  // 3. Article counts per skill (F-026)
  const skillArticleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const sig of researchSignals) {
      for (const sid of sig.skillIds) {
        counts[sid] = (counts[sid] || 0) + 1;
      }
    }
    return counts;
  }, [researchSignals]);

  // 4. Filter Workforce Series
  const filteredWorkforce = useMemo(() => {
    return analyzedSeries.filter((series) => {
      const matchesDirection =
        directionFilter === "all" || series.direction === directionFilter;
      const matchesSkill =
        selectedSkillFilter === "all" || series.skillId === selectedSkillFilter;
      return matchesDirection && matchesSkill;
    });
  }, [analyzedSeries, directionFilter, selectedSkillFilter]);

  const handleRefreshResearch = async () => {
    setIsRefreshing(true);
    setRefreshNotice(null);

    try {
      const res = await fetch("/api/research");
      const data = await res.json();
      if (data.signals) {
        setResearchSignals(data.signals);
      }
      if (data.fromCache) {
        setRefreshNotice("Refresh limited to once per minute; showing most recent retrieval.");
      } else {
        setRefreshNotice("Live scientific research feeds synchronized successfully.");
      }
      setTimeout(() => setRefreshNotice(null), 4000);
    } catch {
      setRefreshNotice("Feed unreachable. Displaying cached verified research evidence.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDirectionBadge = (direction: TrendDirection, percentageChange: number | null) => {
    switch (direction) {
      case "Rising":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            <span>Rising ({percentageChange !== null && percentageChange > 0 ? `+${percentageChange}` : percentageChange}%)</span>
          </span>
        );
      case "Declining":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400">
            <TrendingDown className="h-3 w-3" />
            <span>Declining ({percentageChange}%)</span>
          </span>
        );
      case "Stable":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            <Minus className="h-3 w-3" />
            <span>Stable ({percentageChange !== null && percentageChange > 0 ? `+${percentageChange}` : percentageChange}%)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Insufficient Data</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Market Surveillance"
        title="Trend Radar & Market Intelligence"
        description="Dual-track evidence monitoring technical research activity alongside statistical time-series workforce demand datasets."
      >
        {activeTab === "research" ? (
          <button
            onClick={handleRefreshResearch}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Public Research</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={resetWorkforceObservations}
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Evidence</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import Dataset (CSV/JSON)</span>
            </button>
          </div>
        )}
      </PageHeader>

      {/* Tab Selector */}
      <div className="flex border-b border-card-border">
        <button
          onClick={() => setActiveTab("research")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === "research"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Research Activity Feed ({researchSignals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("workforce")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === "workforce"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Workforce Demand Trends ({analyzedSeries.length} Series)</span>
        </button>
      </div>

      {refreshNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-400">
          <Activity className="h-4 w-4 shrink-0" />
          <span>{refreshNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: RESEARCH ACTIVITY (Hugging Face / MIT AI News)                      */}
      {/* ========================================================================= */}
      {activeTab === "research" && (
        <div className="space-y-6">
          {/* Provenance & Ethical Disclosure Banner (F-025) */}
          <Panel className="border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Separation of Evidence Invariant & Methodology Notice
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Scientific research publications (Hugging Face Daily Papers and MIT AI News) measure technical community interest and algorithmic evolution. They are explicit proxies for technology velocity and <strong>must never be conflated with hiring demand, job vacancies, or wage growth</strong>.
                </p>
              </div>
            </div>
          </Panel>

          {/* Evidence Count per Skill Visualizer (F-026) */}
          <Panel title="Research Mentions per Standard Skill" subtitle="Frequency of scientific citations across active signals">
            <div className="flex flex-wrap gap-2 pt-1">
              {SKILLS_CATALOG.map((skill) => {
                const count = skillArticleCounts[skill.id] || 0;
                return (
                  <button
                    key={skill.id}
                    onClick={() =>
                      setSelectedSkillFilter(selectedSkillFilter === skill.id ? "all" : skill.id)
                    }
                    className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                      selectedSkillFilter === skill.id
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 font-semibold"
                        : count > 0
                        ? "border-card-border bg-card/60 text-foreground hover:bg-card"
                        : "border-transparent bg-muted/40 text-muted-foreground/60"
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className="rounded-full bg-background/80 px-1.5 py-0.2 font-mono text-[10px]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publication title, source, or observation findings..."
                className="w-full rounded-md border border-card-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="rounded-md border border-card-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Skills</option>
              {SKILLS_CATALOG.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Signal Cards Feed */}
          <div className="space-y-4">
            {filteredSignals.map((sig) => (
              <Panel key={sig.id} className="hover:border-card-border transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                        {sig.source}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono" suppressHydrationWarning>
                        <Calendar className="h-3 w-3" />
                        {formatDisplayDate(sig.publishedAt)}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] uppercase font-mono text-muted-foreground">
                        {sig.mode}
                      </span>
                    </div>

                    <a
                      href={sig.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-cyan-400 transition-colors"
                    >
                      <span>{sig.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                    </a>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {sig.observation}
                    </p>
                  </div>
                </div>

                {/* Skill Badges Footer */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-card-border/60 pt-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                    Related Skills:
                  </span>
                  {sig.skillIds.map((sid) => {
                    const skill = SKILLS_CATALOG.find((s) => s.id === sid);
                    return (
                      <span
                        key={sid}
                        className="rounded-full bg-card border border-card-border px-2 py-0.5 text-[11px] font-medium text-foreground"
                      >
                        {skill?.name || sid}
                      </span>
                    );
                  })}
                </div>
              </Panel>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WORKFORCE DEMAND (Time-Series & Comparability Engine)              */}
      {/* ========================================================================= */}
      {activeTab === "workforce" && (
        <div className="space-y-6">
          {/* Summary Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Panel className="p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Active Series
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground">
                {analyzedSeries.length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Comparable groupings</p>
            </Panel>
            <Panel className="p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Rising Trends
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">
                {analyzedSeries.filter((s) => s.direction === "Rising").length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">&gt; +5.0% change</p>
            </Panel>
            <Panel className="p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                Stable Trends
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-blue-400">
                {analyzedSeries.filter((s) => s.direction === "Stable").length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Within ±5.0%</p>
            </Panel>
            <Panel className="p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                Declining Trends
              </span>
              <div className="mt-1 text-2xl font-bold font-mono text-red-400">
                {analyzedSeries.filter((s) => s.direction === "Declining").length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">&lt; -5.0% change</p>
            </Panel>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="rounded-md border border-card-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Directions</option>
              <option value="Rising">Rising Trends (&gt; +5%)</option>
              <option value="Stable">Stable Trends (±5%)</option>
              <option value="Declining">Declining Trends (&lt; -5%)</option>
              <option value="Insufficient Data">Insufficient Data</option>
            </select>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="rounded-md border border-card-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Skills</option>
              {SKILLS_CATALOG.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Series Cards */}
          <div className="space-y-4">
            {filteredWorkforce.map((series) => (
              <Panel key={series.seriesKey} className="hover:border-card-border transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border/60 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">
                        {series.skillId.toUpperCase()} • {series.sourceName}
                      </h4>
                      {series.synthetic && (
                        <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400 uppercase">
                          Synthetic Baseline
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {series.industry} • {series.geography} • {series.measurementType} ({series.unit})
                    </p>
                  </div>
                  <div>{getDirectionBadge(series.direction, series.percentageChange)}</div>
                </div>

                {/* Observation Chronology */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Observation Timeline ({series.periodClass})</span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {series.comparabilityReason}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {series.observations.map((obs, idx) => (
                      <div
                        key={obs.id}
                        className="rounded-lg border border-card-border/60 bg-muted/30 p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-foreground">
                            Period: {obs.periodStart} to {obs.periodEnd}
                          </span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {obs.definition}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-foreground">
                            {obs.value}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1">
                            {obs.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      )}

      {/* Dataset Ingestion Modal */}
      <ManageDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(newObs) => importWorkforceObservations(newObs)}
      />
    </div>
  );
}
