"use client";

import React, { useState, useMemo } from "react";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ManageDataModal } from "@/components/ManageDataModal";
import { formatDisplayDate, formatDisplayTimestamp } from "@/lib/utils";
import { isSignalSetStale } from "@/lib/domain/trends";
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
  const lastRetrievedAt = useMemo(() => {
    const timestamps = researchSignals.map((signal) => Date.parse(signal.retrievedAt)).filter(Number.isFinite);
    return timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null;
  }, [researchSignals]);
  const storedEvidenceIsStale = researchSignals.length > 0 && isSignalSetStale(lastRetrievedAt);

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
      if (Array.isArray(data.signals) && ["live", "cached", "stale"].includes(data.status)) {
        setResearchSignals(data.signals);
      }
      if (data.status === "live") {
        setRefreshNotice(`Updated from public feeds${data.failedSources?.length ? `; ${data.failedSources.length} source unavailable` : ""}.`);
      } else if (data.status === "cached") {
        setRefreshNotice("Showing the most recent successful feed retrieval.");
      } else if (data.status === "stale") {
        setRefreshNotice("Feeds could not refresh. Showing stale external evidence from the last successful update.");
      } else {
        setRefreshNotice(researchSignals.length
          ? "Public feeds are unavailable. Existing evidence was kept and may be stale."
          : "Public feeds are unavailable. Retry later; no new evidence was loaded.");
      }
      if (data.status === "live" || data.status === "cached") setTimeout(() => setRefreshNotice(null), 6000);
    } catch {
      setRefreshNotice("Could not reach the research service. Existing evidence is unchanged.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDirectionBadge = (direction: TrendDirection, percentageChange: number | null) => {
    switch (direction) {
      case "Rising":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-sm font-semibold text-success">
            <TrendingUp className="h-3 w-3" />
            <span>Rising ({percentageChange !== null && percentageChange > 0 ? `+${percentageChange}` : percentageChange}%)</span>
          </span>
        );
      case "Declining":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-sm font-semibold text-destructive">
            <TrendingDown className="h-3 w-3" />
            <span>Declining ({percentageChange}%)</span>
          </span>
        );
      case "Stable":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
            <Minus className="h-3 w-3" />
            <span>Stable ({percentageChange !== null && percentageChange > 0 ? `+${percentageChange}` : percentageChange}%)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-sm font-semibold text-warning">
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
        description="Source-linked research activity and workforce demand evidence, kept separate."
      >
        {activeTab === "research" ? (
          <button
            onClick={handleRefreshResearch}
            disabled={isRefreshing}
            className="ui-button inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-sm font-semibold text-accent-cyan hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Public Research</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={resetWorkforceObservations}
              className="ui-button ui-button-secondary inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Evidence</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="ui-button inline-flex items-center gap-2 rounded-lg bg-action px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-action-hover transition-colors"
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
          className={`ui-button flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            activeTab === "research"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Research Activity ({researchSignals.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("workforce")}
          className={`ui-button flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
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
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-accent-cyan">
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
              <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-warning">
                  Research activity is not hiring demand
                </h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Publications show research activity. They do not establish job demand, vacancies, wages, or employment growth; trend direction stays uncertain.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sources: <a className="underline" href="https://huggingface.co/blog/feed.xml" target="_blank" rel="noreferrer">Hugging Face Blog RSS</a> · <a className="underline" href="https://news.mit.edu/rss/topic/artificial-intelligence2" target="_blank" rel="noreferrer">MIT AI News RSS</a>
                  {lastRetrievedAt && <> · Last retrieved {formatDisplayTimestamp(lastRetrievedAt)}</>}
                  {storedEvidenceIsStale && <span className="font-semibold text-warning"> · Stale; refresh to update</span>}
                </p>
              </div>
            </div>
          </Panel>

          {/* Evidence Count per Skill Visualizer (F-026) */}
          <Panel title="Related skills" subtitle="Conservative keyword matches in the title and summary; not an employment trend">
            <div className="flex flex-wrap gap-2 pt-1">
              {SKILLS_CATALOG.map((skill) => {
                const count = skillArticleCounts[skill.id] || 0;
                return (
                  <button
                    key={skill.id}
                    onClick={() =>
                      setSelectedSkillFilter(selectedSkillFilter === skill.id ? "all" : skill.id)
                    }
                    className={`ui-button inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm transition-colors ${
                      selectedSkillFilter === skill.id
                        ? "border-cyan-500 bg-cyan-500/20 text-accent-cyan font-semibold"
                        : count > 0
                        ? "border-card-border bg-card/60 text-foreground hover:bg-card"
                        : "border-transparent bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className="rounded-full bg-background/80 px-1.5 py-0.2 font-mono text-xs">
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
              <input aria-label="Search publication title, source, or observation findings..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publication title, source, or observation findings..."
                className="ui-field w-full rounded-md border border-card-border bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <select aria-label="Filter by skill"
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="ui-field rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
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
            {filteredSignals.length === 0 && (
              <Panel className="text-sm text-muted-foreground">
                No public research items are available. Refresh to try the feeds again.
              </Panel>
            )}
            {filteredSignals.map((sig) => (
              <Panel key={sig.id} className="hover:border-card-border transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-sm font-semibold text-accent-cyan">
                        {sig.source}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1 font-mono" suppressHydrationWarning>
                        <Calendar className="h-3 w-3" />
                        {sig.publishedAt ? formatDisplayDate(sig.publishedAt) : "Publication date unavailable"}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.2 text-xs font-mono text-muted-foreground">
                        {sig.evidenceType === "external" ? "External research" : "Synthetic demo"}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.2 text-xs font-mono text-muted-foreground">Direction uncertain</span>
                    </div>

                    <a
                      href={sig.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent-cyan transition-colors"
                    >
                      <span>{sig.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                    </a>

                    {sig.observation && <p className="text-sm text-muted-foreground leading-relaxed pt-1">{sig.observation}</p>}
                    <p className="text-xs text-muted-foreground">Retrieved {formatDisplayTimestamp(sig.retrievedAt)}. {sig.limitations}</p>
                  </div>
                </div>

                {/* Skill Badges Footer */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-card-border/60 pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                    Inferred skill matches:
                  </span>
                  {sig.skillIds.map((sid) => {
                    const skill = SKILLS_CATALOG.find((s) => s.id === sid);
                    return (
                      <span
                        key={sid}
                        className="rounded-full bg-card border border-card-border px-2 py-0.5 text-sm font-medium text-foreground"
                      >
                        {skill?.name || sid}
                      </span>
                    );
                  })}
                  {sig.skillIds.length === 0 && <span className="text-sm text-muted-foreground">No direct skill match</span>}
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
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Series
              </span>
              <div className="mt-1 text-2xl font-semibold font-mono text-foreground">
                {analyzedSeries.length}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Comparable groupings</p>
            </Panel>
            <Panel className="p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-success">
                Rising Trends
              </span>
              <div className="mt-1 text-2xl font-semibold font-mono text-success">
                {analyzedSeries.filter((s) => s.direction === "Rising").length}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">&gt; +5.0% change</p>
            </Panel>
            <Panel className="p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Stable Trends
              </span>
              <div className="mt-1 text-2xl font-semibold font-mono text-primary">
                {analyzedSeries.filter((s) => s.direction === "Stable").length}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Within ±5.0%</p>
            </Panel>
            <Panel className="p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                Declining Trends
              </span>
              <div className="mt-1 text-2xl font-semibold font-mono text-destructive">
                {analyzedSeries.filter((s) => s.direction === "Declining").length}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">&lt; -5.0% change</p>
            </Panel>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select aria-label="Filter by trend direction"
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="ui-field rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
            >
              <option value="all">All Directions</option>
              <option value="Rising">Rising Trends (&gt; +5%)</option>
              <option value="Stable">Stable Trends (±5%)</option>
              <option value="Declining">Declining Trends (&lt; -5%)</option>
              <option value="Insufficient Data">Insufficient Data</option>
            </select>
            <select aria-label="Filter by skill"
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="ui-field rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
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
                      <h4 className="text-sm font-semibold text-foreground">
                        {series.skillId.toUpperCase()} • {series.sourceName}
                      </h4>
                      {series.synthetic && (
                        <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-warning uppercase">
                          Synthetic Baseline
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {series.industry} • {series.geography} • {series.measurementType} ({series.unit})
                    </p>
                  </div>
                  <div>{getDirectionBadge(series.direction, series.percentageChange)}</div>
                </div>

                {/* Observation Chronology */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Observation Timeline ({series.periodClass})</span>
                    <span className="text-sm font-mono text-accent-cyan">
                      {series.comparabilityReason}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {series.observations.map((obs, idx) => (
                      <div
                        key={obs.id}
                        className="rounded-lg border border-card-border/60 bg-muted/30 p-2.5 flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-semibold text-foreground">
                            Period: {obs.periodStart} to {obs.periodEnd}
                          </span>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {obs.definition}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold font-mono text-foreground">
                            {obs.value}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">
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
