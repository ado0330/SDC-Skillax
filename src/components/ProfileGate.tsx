"use client";

import React from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { Panel } from "./Panel";
import { UserCheck, Sparkles, ArrowRight, User } from "lucide-react";

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { isProfileInitialized, loadSyntheticPreset } = useWorkspace();

  if (isProfileInitialized) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <Panel glow className="max-w-xl text-center p-8 sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-accent-cyan ring-1 ring-cyan-500/30">
          <Sparkles className="h-7 w-7" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to SKILLAX AI
        </h2>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          To generate personalized career intelligence, match recommendations, and custom reskilling roadmaps, please create your capability profile or load a synthetic Malaysian worker preset.
        </p>

        {/* Primary CTA */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/profile"
            className="ui-button inline-flex items-center justify-center gap-2 rounded-lg bg-action px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-action-hover transition-colors"
          >
            <UserCheck className="h-4 w-4" />
            <span>Create My Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Demo Fast-Track Presets */}
        <div className="mt-8 border-t border-card-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Instant Demo Shortcuts (No typing required)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <button
              onClick={() => loadSyntheticPreset("sample-aina")}
              className="ui-button flex flex-col items-center p-2.5 rounded-lg border border-card-border bg-muted/40 hover:bg-card hover:border-primary/40 transition-all text-left"
            >
              <span className="font-semibold text-foreground">Aina (Operations)</span>
              <span className="text-sm text-muted-foreground mt-0.5">Mid-Career • Logistics</span>
            </button>
            <button
              onClick={() => loadSyntheticPreset("sample-daniel")}
              className="ui-button flex flex-col items-center p-2.5 rounded-lg border border-card-border bg-muted/40 hover:bg-card hover:border-primary/40 transition-all text-left"
            >
              <span className="font-semibold text-foreground">Daniel (Data)</span>
              <span className="text-sm text-muted-foreground mt-0.5">Early Career • Python/SQL</span>
            </button>
            <button
              onClick={() => loadSyntheticPreset("sample-kumar")}
              className="ui-button flex flex-col items-center p-2.5 rounded-lg border border-card-border bg-muted/40 hover:bg-card hover:border-primary/40 transition-all text-left"
            >
              <span className="font-semibold text-foreground">Kumar (Maintenance)</span>
              <span className="text-sm text-muted-foreground mt-0.5">Supervisor • IoT Transition</span>
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
