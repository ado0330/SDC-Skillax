"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ScoreRing } from "@/components/ScoreRing";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  X,
  History,
  FileCheck,
} from "lucide-react";

export default function UpdatesPage() {
  const {
    recommendationHistory,
    pendingProposal,
    approveProposal,
    rejectProposal,
    stageReplanningProposal,
    completedMilestoneIds,
  } = useWorkspace();

  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    pendingProposal?.id || null
  );

  const activeProposal =
    recommendationHistory.find((p) => p.id === (selectedProposalId || pendingProposal?.id)) ||
    pendingProposal ||
    recommendationHistory[0];

  const pendingCount = recommendationHistory.filter((p) => p.status === "Pending Review").length;
  const approvedCount = recommendationHistory.filter((p) => p.status === "Approved").length;
  const rejectedCount = recommendationHistory.filter((p) => p.status === "Rejected").length;

  return (
    <ProfileGate>
      <div className="space-y-8 pb-12 max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Human-in-the-Loop Governance"
          title="Replanning &amp; Audit Trail"
          description="Inspect and approve mathematical career recalculation proposals triggered by AI scenario shocks or fresh workforce observations. Saved learning pathways are never silently overwritten."
        >
          <button
            onClick={() =>
              stageReplanningProposal(
                "Manual replanning simulation triggered by evaluator to audit proposal workflow"
              )
            }
            className="ui-button text-sm font-semibold px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-accent-cyan hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simulate Replanning Trigger</span>
          </button>
        </PageHeader>

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Panel glow={pendingCount > 0} className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Pending Review</span>
              <AlertCircle className={`h-4 w-4 ${pendingCount > 0 ? "text-warning" : "text-muted-foreground"}`} />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-semibold ${pendingCount > 0 ? "text-warning" : "text-foreground"}`}>
                {pendingCount}
              </span>
              <span className="text-sm text-muted-foreground">Proposals Staged</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Awaiting explicit human approval
            </p>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Approved Revisions</span>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground">
                {approvedCount}
              </span>
              <span className="text-sm text-muted-foreground">Applied</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Successfully merged into roadmap
            </p>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Rejected Revisions</span>
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground">
                {rejectedCount}
              </span>
              <span className="text-sm text-muted-foreground">Archived</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Previous curriculum preserved
            </p>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <span>Governance Invariant</span>
              <ShieldCheck className="h-4 w-4 text-accent-cyan" />
            </div>
            <div className="mt-2 text-sm text-foreground font-semibold">
              Zero Silent Overwrites
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Section 2.5 of AGENTS.md mandates all recalculations remain staged as proposals until confirmed.
            </p>
          </Panel>
        </div>

        {/* Active Proposal Review Panel */}
        {activeProposal ? (
          <Panel glow={activeProposal.status === "Pending Review"} className="p-6 sm:p-8 space-y-6">
            {/* Proposal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-card-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs uppercase font-mono font-semibold px-2 py-0.5 rounded border ${
                      activeProposal.status === "Pending Review"
                        ? "bg-amber-500/10 text-warning border-amber-500/30"
                        : activeProposal.status === "Approved"
                        ? "bg-emerald-500/10 text-success border-emerald-500/30"
                        : "bg-rose-500/10 text-destructive border-rose-500/30"
                    }`}
                  >
                    {activeProposal.status}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    ID: {activeProposal.id}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Recalculation Proposal: {activeProposal.reason}
                </h3>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Staged at {new Date(activeProposal.timestamp).toLocaleString()}</span>
                </span>
              </div>

              {activeProposal.status === "Pending Review" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => rejectProposal(activeProposal.id)}
                    className="ui-button inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-destructive hover:bg-rose-500/20 text-sm font-semibold transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject Changes</span>
                  </button>
                  <button
                    onClick={() => approveProposal(activeProposal.id)}
                    className="ui-button inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-action hover:bg-action-hover text-white text-sm font-semibold shadow-md transition-all "
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve &amp; Update Roadmap</span>
                  </button>
                </div>
              )}
            </div>

            {/* Ranking Changes Comparison Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                  Career Suitability Ranking Shifts
                </h4>
                <span className="text-sm text-muted-foreground">
                  Comparing current baseline vs. proposed trajectory
                </span>
              </div>

              <div className="comparison-table rounded-xl border border-card-border overflow-x-auto bg-card divide-y divide-card-border/60">
                <div className="grid grid-cols-12 gap-2 p-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
                  <span className="col-span-5">Occupation</span>
                  <span className="col-span-2 text-center">Previous Rank</span>
                  <span className="col-span-2 text-center">Proposed Rank</span>
                  <span className="col-span-3 text-right">Score Delta</span>
                </div>

                {activeProposal.afterMatches.slice(0, 5).map((afterMatch, idx) => {
                  const beforeMatch = activeProposal.beforeMatches.find(
                    (bm) => bm.role.id === afterMatch.role.id
                  );
                  const prevRank = beforeMatch ? beforeMatch.rank : idx + 1;
                  const newRank = afterMatch.rank;
                  const rankDelta = prevRank - newRank; // positive means moved up

                  const prevScore = beforeMatch ? beforeMatch.overallScore : afterMatch.overallScore;
                  const newScore = afterMatch.overallScore;
                  const scoreDelta = newScore - prevScore;

                  return (
                    <div
                      key={afterMatch.role.id}
                      className="grid grid-cols-12 gap-2 p-3 items-center text-sm hover:bg-muted/20 transition-colors"
                    >
                      <div className="col-span-5">
                        <span className="font-semibold text-foreground block">
                          {afterMatch.role.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {afterMatch.role.industry}
                        </span>
                      </div>

                      <div className="col-span-2 text-center font-mono text-muted-foreground">
                        #{prevRank} ({prevScore}%)
                      </div>

                      <div className="col-span-2 text-center font-mono font-semibold text-foreground">
                        #{newRank} ({newScore}%)
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-2 font-mono">
                        {rankDelta !== 0 && (
                          <span
                            className={`inline-flex items-center gap-0.5 text-sm px-1.5 py-0.2 rounded font-semibold ${
                              rankDelta > 0
                                ? "text-success bg-emerald-500/10"
                                : "text-warning bg-amber-500/10"
                            }`}
                          >
                            {rankDelta > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>{rankDelta > 0 ? `▲${rankDelta}` : `▼${Math.abs(rankDelta)}`}</span>
                          </span>
                        )}

                        <span
                          className={`font-semibold ${
                            scoreDelta > 0
                              ? "text-success"
                              : scoreDelta < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        >
                          {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proposed Curriculum Invariant Notice */}
            <div className="p-4 rounded-xl bg-muted/40 border border-card-border/80 flex items-start gap-3 text-sm">
              <FileCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">
                  Milestone Completion Preservation Guarantee
                </span>
                <p className="text-muted-foreground leading-relaxed mt-0.5">
                  Approving this proposal will synchronize your curriculum to reflect updated difficulty requirements while strictly retaining all{" "}
                  <strong className="text-foreground">{completedMilestoneIds.length} completed milestone checkoffs</strong>.
                </p>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel className="p-10 text-center space-y-3">
            <History className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <h3 className="text-base font-semibold text-foreground">
              No Proposals Currently in History
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Recalculation proposals are automatically created when you modify AI adoption scenarios in the Scenario Lab or when new workforce datasets are ingested.
            </p>
            <button
              onClick={() =>
                stageReplanningProposal(
                  "Evaluator test proposal triggered to audit human-in-the-loop review workflow"
                )
              }
              className="ui-button mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-action text-primary-foreground text-sm font-semibold hover:bg-action-hover transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Test Proposal</span>
            </button>
          </Panel>
        )}

        {/* Historical Proposals Audit Trail */}
        {recommendationHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span>Recalculation Audit Trail ({recommendationHistory.length})</span>
            </h3>

            <div className="rounded-2xl border border-card-border overflow-hidden bg-card divide-y divide-card-border/60">
              {recommendationHistory.map((item) => {
                const isSelected = item.id === activeProposal?.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedProposalId(item.id)}
                    className={`ui-button w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 border-l-4 border-l-primary"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs uppercase font-mono font-semibold px-2 py-0.5 rounded border ${
                            item.status === "Pending Review"
                              ? "bg-amber-500/10 text-warning border-amber-500/30"
                              : item.status === "Approved"
                              ? "bg-emerald-500/10 text-success border-emerald-500/30"
                              : "bg-rose-500/10 text-destructive border-rose-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {item.reason}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-muted-foreground font-mono">
                        {item.afterMatches.length} Roles Scored
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ProfileGate>
  );
}
