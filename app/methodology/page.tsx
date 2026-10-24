"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ROLES_CATALOG } from "@/lib/data/roles";
import { SKILLS_CATALOG } from "@/lib/data/skills";
import {
  ShieldCheck,
  Binary,
  Layers,
  Database,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <PageHeader
        eyebrow="Algorithmic Transparency &amp; Governance"
        title="Scoring Methodology &amp; Scientific Disclosures"
        description="Full mathematical equation disclosures, evidence separation standards, O*NET benchmark mappings, and privacy architectural invariants governing SKILLAX AI."
      />

      {/* 1. Core Deterministic Mathematical Formula */}
      <Panel glow className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
            <Binary className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              1. Deterministic Scoring Logic (Zero-Hallucination Invariant)
            </h2>
            <p className="text-xs text-muted-foreground">
              Career match scores and rankings are calculated via pure, deterministic functions in <code className="text-cyan-400">lib/domain/scoring.ts</code>.
            </p>
          </div>
        </div>

        {/* Formula Cards */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-card-border space-y-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Baseline Suitability Formula (4-Component Weighted Model)
            </span>
            <div className="p-3 rounded-lg bg-card/80 border border-card-border/80 font-mono text-xs text-cyan-400 overflow-x-auto">
              baselineScore = round(0.50 × skillsScore + 0.20 × transferableScore + 0.15 × interestScore + 0.15 × marketScore)
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Where <strong>skillsScore</strong> evaluates proficiency match against role requirements (50%), <strong>transferableScore</strong> measures cross-functional core competencies (20%), <strong>interestScore</strong> evaluates candidate sector preference (15%), and <strong>marketScore</strong> incorporates scientific research publication mentions (15%).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-card-border space-y-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Workforce Demand Integration (5-Component Extended Model)
            </span>
            <div className="p-3 rounded-lg bg-card/80 border border-card-border/80 font-mono text-xs text-emerald-400 overflow-x-auto">
              overallMatch = round(0.90 × baselineScore + 0.10 × workforceScore)
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              When an eligible empirical workforce observation series is detected for the occupation, the baseline is scaled by 0.90 and workforce demand contributes 10% to the overall match ranking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-card-border space-y-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              AI Scenario Dynamics &amp; Simulation Boost
            </span>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>
                <strong>Slower Adoption:</strong> AI literacy requirements are reduced by 1 level (minimum level 1). Market score is adjusted by <code className="text-foreground">-10 × technicalShare + 0.05 × exposure</code>.
              </p>
              <p>
                <strong>Rapid Adoption:</strong> AI requirements increase by +1 level (or injected at Level 3 for non-AI roles). Market score receives <code className="text-foreground">+20 × technicalShare - 0.10 × exposure</code>.
              </p>
              <p>
                <strong>Simulation Boost:</strong> Manual slider from -100 to +100 points modifies <code className="text-foreground">marketScore = clamp(marketScore + boost, 0, 100)</code>.
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* 2. Rigorous Separation of Evidence Types */}
      <Panel className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              2. Rigorous Separation of Evidence Types
            </h2>
            <p className="text-xs text-muted-foreground">
              Section 2.4 of AGENTS.md establishes strict evidentiary boundaries to avoid misleading users.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-card-border bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" />
              <span>Scientific Research Signals</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Curated from daily Hugging Face AI papers and MIT AI News RSS feeds. These signals are proxies for <strong>academic and applied research activity</strong>. They are <strong>never conflated</strong> with job vacancies, active hiring figures, or wage statistics.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-card-border bg-muted/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Workforce Demand Standards</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Time-series datasets must meet mathematical comparability rules: 11-attribute series key hash, frequency alignment, positive non-zero baseline checks, and statistical thresholds (<code className="text-foreground">&gt; +5%</code> Rising, <code className="text-foreground">&lt; -5%</code> Declining, <code className="text-foreground">±5%</code> Stable).
            </p>
          </div>
        </div>
      </Panel>

      {/* 3. Occupational Benchmarks & O*NET Mappings */}
      <Panel className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              3. Occupational Taxonomy &amp; O*NET Benchmark Codes
            </h2>
            <p className="text-xs text-muted-foreground">
              All 10 benchmark careers are mapped to US Department of Labor O*NET Standard Occupational Classification (SOC) codes.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-card-border overflow-hidden bg-card divide-y divide-card-border/60">
          <div className="grid grid-cols-12 gap-2 p-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40">
            <span className="col-span-5">Occupation</span>
            <span className="col-span-3">Industry</span>
            <span className="col-span-2 text-center">Exposure Index</span>
            <span className="col-span-2 text-right">O*NET Link</span>
          </div>

          {ROLES_CATALOG.map((role) => (
            <div
              key={role.id}
              className="grid grid-cols-12 gap-2 p-3 items-center text-xs hover:bg-muted/20 transition-colors"
            >
              <div className="col-span-5">
                <span className="font-bold text-foreground block">{role.name}</span>
                <span className="text-[10px] text-muted-foreground">{role.requirements.length} skill requirements</span>
              </div>
              <div className="col-span-3 text-muted-foreground">{role.industry}</div>
              <div className="col-span-2 text-center font-mono font-semibold text-foreground">
                {role.exposure}%
              </div>
              <div className="col-span-2 text-right">
                <a
                  href={role.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  <span>O*NET</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 4. Privacy & Strict No-Database Invariant */}
      <Panel className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              4. Privacy &amp; Strict No-Database Architectural Invariant
            </h2>
            <p className="text-xs text-muted-foreground">
              Section 2.1 of AGENTS.md enforces zero database persistence and client-side data sovereignty.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong>Strict No-Database Rule:</strong> This prototype operates with <strong>zero external database connections</strong> (no PostgreSQL, SQLite, MongoDB, Prisma, or Drizzle). All user profile preferences, skill self-ratings, target career designations, and milestone progress reside exclusively in the user&apos;s local browser storage under key <code className="text-foreground font-mono">skillax_workspace_v2</code>.
          </p>
          <p>
            <strong>Consented Ephemeral AI Processing:</strong> Uploaded resumes and pasted CV text are processed exclusively in stateless server RAM via Google Gemini 2.5 Flash SDK. Memory buffers are zeroed immediately upon response generation. Raw files and extracted personal CV texts are <strong>never written to server disk or logs</strong>.
          </p>
          <p>
            <strong>Atomic Purge:</strong> When the user clicks &quot;Reset Workspace&quot; in Settings, all local browser state is wiped instantly, returning the application to virgin state with zero retained data traces.
          </p>
        </div>
      </Panel>
    </div>
  );
}
