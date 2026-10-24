"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { Panel } from "@/components/Panel";
import { PageHeader } from "@/components/PageHeader";
import { SdgBadge } from "@/components/SdgBadge";
import { ROLES_CATALOG } from "@/lib/data/roles";
import { SYNTHETIC_WORKERS } from "@/lib/data/syntheticWorkers";
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Binary,
  Layers,
  Globe,
  Sliders,
  CheckCircle2,
  Users,
  BookOpen,
  Target,
  ExternalLink,
  Lock,
  Zap,
} from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { loadSyntheticPreset } = useWorkspace();

  const handleFastTrack = (presetId: string) => {
    loadSyntheticPreset(presetId);
    router.push("/");
  };

  return (
    <div className="space-y-12 pb-16 max-w-6xl mx-auto">
      {/* Hero Presentation Header */}
      <div className="relative overflow-hidden rounded-3xl border border-card-border bg-gradient-to-b from-card via-card/80 to-background p-8 sm:p-14 text-center shadow-2xl">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400">
            <Sparkles className="h-4 w-4" />
            <span>SDC Aiversecity Hackathon • Domain 1: Future of Work</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            SKILLAX AI Platform
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
              Future Workforce Intelligence &amp; Career OS
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A high-precision, explainable AI platform designed for Malaysian lifelong learners, mid-career transitioners, and workforce planners. Benchmark capabilities against national priority roles, simulate AI adoption shocks, and generate deterministic 4-phase reskilling roadmaps.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4" />
              <span>Launch Career OS Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/assessment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-card-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
            >
              <span>5-Scenario Quick Diagnostic</span>
            </Link>

            <Link
              href="/methodology"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-card-border bg-card/80 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <Binary className="h-4 w-4" />
              <span>Scoring Formulas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Architectural Invariants (For Hackathon Judges) */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Enterprise Architecture &amp; Competition Standards
          </span>
          <h2 className="text-2xl font-bold text-foreground">
            Core Architectural Invariants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Panel glow className="p-5 space-y-2">
            <Lock className="h-6 w-6 text-cyan-400" />
            <h3 className="text-sm font-bold text-foreground">
              Strict No-Database Invariant
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero external database connections. State resides in client-side memory and browser localStorage. Ephemeral server buffers zero raw CVs immediately upon response.
            </p>
          </Panel>

          <Panel className="p-5 space-y-2">
            <Binary className="h-6 w-6 text-purple-400" />
            <h3 className="text-sm font-bold text-foreground">
              Deterministic Scoring Engine
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero LLM hallucination in suitability percentages. Pure mathematical formulas ensure identical inputs produce identical scores and rankings 100% of the time.
            </p>
          </Panel>

          <Panel className="p-5 space-y-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h3 className="text-sm font-bold text-foreground">
              Human-in-the-Loop Governance
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scenario shocks stage proposals in <code className="text-foreground">/updates</code> with status <em>Pending Review</em>. Saved roadmaps are never silently overwritten.
            </p>
          </Panel>

          <Panel className="p-5 space-y-2">
            <Globe className="h-6 w-6 text-amber-400" />
            <h3 className="text-sm font-bold text-foreground">
              17 UN SDG Impact Alignment
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every benchmark occupation is mapped to UN Sustainable Development Goals with official brand colors, luminance contrast, and task rationales.
            </p>
          </Panel>
        </div>
      </div>

      {/* Evaluator Fast-Track Presets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            <span>Fast-Track Demo Personas (1-Click Evaluation)</span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Instantly loads fully-populated profiles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleFastTrack("sample-aina")}
            className="p-5 rounded-2xl border border-card-border bg-card/60 hover:bg-card hover:border-cyan-500/50 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                Aina (Operations)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Mid-Career • 7 Yrs
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Senior Logistics Coordinator transitioning toward Business Process Automation and BI Analytics.
            </p>
            <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Test Aina&apos;s Journey</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>

          <button
            onClick={() => handleFastTrack("sample-daniel")}
            className="p-5 rounded-2xl border border-card-border bg-card/60 hover:bg-card hover:border-cyan-500/50 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                Daniel (Data &amp; Tech)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Early Career • 2 Yrs
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Junior Data Programmer upskilling in SQL, Python, and scalable Machine Learning inference pipelines.
            </p>
            <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Test Daniel&apos;s Journey</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>

          <button
            onClick={() => handleFastTrack("sample-kumar")}
            className="p-5 rounded-2xl border border-card-border bg-card/60 hover:bg-card hover:border-cyan-500/50 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                Kumar (Manufacturing)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                Supervisor • 11 Yrs
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plant Maintenance Supervisor transitioning toward Industrial IoT telemetry and predictive maintenance.
            </p>
            <div className="mt-4 pt-3 border-t border-card-border/60 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Test Kumar&apos;s Journey</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* 10 Benchmark Priority Occupations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              <span>10 National Priority Benchmark Occupations</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mapped to O*NET task classifications and Malaysian strategic transformation targets.
            </p>
          </div>
          <Link
            href="/careers"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Explore All Matches</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ROLES_CATALOG.map((role) => (
            <Panel key={role.id} className="p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {role.industry}
                </span>
                <h4 className="text-xs font-bold text-foreground mt-1.5 line-clamp-2">
                  {role.name}
                </h4>
              </div>

              <div className="pt-2 border-t border-card-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {role.sdgs.slice(0, 2).map((id) => (
                    <SdgBadge key={id} sdgId={id} size="sm" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {role.exposure}% exp.
                </span>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      {/* Recommended Evaluator Tour Guide */}
      <Panel glow className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-cyan-400" />
          <h3 className="text-base font-bold text-foreground">
            Evaluator Tour Guide (Recommended Verification Flow)
          </h3>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <li className="p-3 rounded-xl border border-card-border bg-muted/20 space-y-1">
            <span className="font-bold text-cyan-400">Step 1: Profile &amp; CV</span>
            <p className="text-muted-foreground">
              Visit <Link href="/profile" className="text-primary hover:underline">/profile</Link> to adjust skill self-ratings or test zero-retention CV extraction.
            </p>
          </li>
          <li className="p-3 rounded-xl border border-card-border bg-muted/20 space-y-1">
            <span className="font-bold text-cyan-400">Step 2: Mathematical Audit</span>
            <p className="text-muted-foreground">
              Visit <Link href="/careers" className="text-primary hover:underline">/careers</Link> and select a role to inspect formula decomposition bars.
            </p>
          </li>
          <li className="p-3 rounded-xl border border-card-border bg-muted/20 space-y-1">
            <span className="font-bold text-cyan-400">Step 3: Scenario Lab Shocks</span>
            <p className="text-muted-foreground">
              Test Slower, Moderate, and Rapid AI toggles at <Link href="/scenarios" className="text-primary hover:underline">/scenarios</Link>.
            </p>
          </li>
          <li className="p-3 rounded-xl border border-card-border bg-muted/20 space-y-1">
            <span className="font-bold text-cyan-400">Step 4: Roadmap &amp; Progress</span>
            <p className="text-muted-foreground">
              Check off milestones at <Link href="/roadmap" className="text-primary hover:underline">/roadmap</Link> and track hours at <Link href="/progress" className="text-primary hover:underline">/progress</Link>.
            </p>
          </li>
        </ol>
      </Panel>
    </div>
  );
}
