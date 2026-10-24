"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { ProfileGate } from "@/components/ProfileGate";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreDecompositionBar, ProficiencyGapChart } from "@/components/BarCharts";
import { SdgBadge } from "@/components/SdgBadge";
import { LevelDots } from "@/components/LevelDots";
import { ROLES_BY_ID } from "@/lib/data/roles";
import {
  ArrowLeft,
  Target,
  ExternalLink,
  Map,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { matches, targetRole, setTargetRole } = useWorkspace();

  const role = ROLES_BY_ID.get(roleId);
  const match = matches.find((m) => m.role.id === roleId);

  if (!role || !match) {
    return (
      <ProfileGate>
        <div className="py-12 text-center space-y-4">
          <p className="text-muted-foreground text-sm">Career occupation not found.</p>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Career Matches</span>
          </Link>
        </div>
      </ProfileGate>
    );
  }

  const isTarget = targetRole?.id === role.id;

  const handleSetTargetAndGoToRoadmap = () => {
    setTargetRole(role.id);
    router.push("/roadmap");
  };

  return (
    <ProfileGate>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/careers" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Career Matches</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{role.name}</span>
        </div>

        {/* Page Header */}
        <PageHeader
          eyebrow={`RANK #${match.rank} • ${role.industry}`}
          title={role.name}
          description={role.description}
        >
          <div className="flex items-center gap-2.5">
            {isTarget ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-3.5 py-2 text-xs font-bold text-indigo-300">
                <Target className="h-4 w-4" />
                <span>Active Target Role</span>
              </span>
            ) : (
              <button
                onClick={() => setTargetRole(role.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary transition-colors"
              >
                <Target className="h-4 w-4 text-primary" />
                <span>Set as Target Role</span>
              </button>
            )}

            <button
              onClick={handleSetTargetAndGoToRoadmap}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Map className="h-4 w-4" />
              <span>Target & View Roadmap</span>
            </button>
          </div>
        </PageHeader>

        {/* Key Role Metainfo Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Panel className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Overall Match
              </span>
              <div className="text-2xl font-bold font-mono text-cyan-400 mt-0.5">
                {match.overallScore}%
              </div>
            </div>
            <ScoreRing score={match.overallScore} size="sm" />
          </Panel>

          <Panel className="p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Estimated Study
            </span>
            <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
              ~{match.estimatedHours} hrs
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">4-phase gap curriculum</p>
          </Panel>

          <Panel className="p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Automation Exposure
            </span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
              {role.exposure}/100
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Industrial AI sensitivity</p>
          </Panel>

          <Panel className="p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              O*NET Family Reference
            </span>
            <div className="mt-1">
              <a
                href={role.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
              >
                <span>View Standard Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Standardized taxonomy</p>
          </Panel>
        </div>

        {/* Score Decomposition & Mathematical Audit View (F-034) */}
        <Panel
          title="Mathematical Score Decomposition & Formula Audit"
          subtitle="Audit every single point contributing to the career suitability recommendation"
          icon={<Zap className="h-4 w-4" />}
        >
          <div className="space-y-5">
            <div className="rounded-lg border border-card-border/80 bg-muted/40 p-3.5 font-mono text-xs text-foreground leading-relaxed">
              <div className="text-cyan-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Deterministic Formula Calculation:
              </div>
              {match.auditExplanation}
            </div>

            <ScoreDecompositionBar components={match.components} />

            <div className="rounded-lg border border-card-border bg-card/60 p-3 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>Decision Support Disclosure</span>
              </div>
              <p>
                This match score reflects mathematical capability alignment, interest alignment, and market velocity. It is generated deterministically without language-model hallucination and represents decision support, not employment probability.
              </p>
            </div>
          </div>
        </Panel>

        {/* Proficiency Gap Analysis (F-035) */}
        <Panel
          title="Proficiency Gap Breakdown & Level Comparison"
          subtitle="Direct comparison between your current rated capabilities and target role requirements"
          icon={<Layers className="h-4 w-4" />}
        >
          <div className="space-y-4">
            <ProficiencyGapChart gaps={match.gaps} />
          </div>
        </Panel>

        {/* SDG Impact Footprint (F-037) */}
        <Panel
          title="UN Sustainable Development Goals (SDG) Alignment"
          subtitle="How this occupational pathway contributes to global social impact"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {role.sdgs.map((sdgId) => (
                <SdgBadge key={sdgId} sdgId={sdgId} showName size="md" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {role.sdgRationale}
            </p>
          </div>
        </Panel>
      </div>
    </ProfileGate>
  );
}
