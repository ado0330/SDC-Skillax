"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ResetModal } from "@/components/ResetModal";
import { ROLES_CATALOG } from "@/lib/data/roles";
import {
  Settings,
  Moon,
  Sun,
  Eye,
  Sliders,
  Database,
  Trash2,
  Cpu,
  Clock,
  Target,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    theme,
    toggleTheme,
    reducedMotion,
    toggleReducedMotion,
    targetRole,
    setTargetRole,
    isProfileInitialized,
  } = useWorkspace();

  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [storageBytes, setStorageBytes] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("skillax_workspace_v2");
      if (raw) {
        setStorageBytes(new Blob([raw]).size);
      } else {
        setStorageBytes(0);
      }
    } catch {
      setStorageBytes(0);
    }
  }, [profile]);

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Preferences &amp; Data Sovereignty"
        title="Settings &amp; Workspace Controls"
        description="Configure application display preferences, accessibility options, weekly reskilling pace, and client-side storage."
      />

      {/* 1. Appearance & Accessibility */}
      <Panel glow className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-accent-cyan ring-1 ring-cyan-500/30">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Appearance &amp; Accessibility
            </h2>
            <p className="text-sm text-muted-foreground">
              Customize interface color contrast and animation preferences.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-card/60">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-accent-cyan" />
              ) : (
                <Sun className="h-5 w-5 text-warning" />
              )}
              <div>
                <span className="text-sm font-semibold text-foreground block">
                  Color Theme: {theme === "dark" ? "Dark Mode (Career OS)" : "Light Mode"}
                </span>
                <span className="text-sm text-muted-foreground">
                  High-contrast cyber-slate palette with WCAG compliant foreground.
                </span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="ui-button px-3.5 py-1.5 rounded-lg border border-card-border bg-muted/40 hover:bg-muted text-sm font-semibold text-foreground transition-colors"
            >
              Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-card/60">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-chart-3" />
              <div>
                <span className="text-sm font-semibold text-foreground block">
                  Reduced Motion: {reducedMotion ? "Enabled" : "Disabled"}
                </span>
                <span className="text-sm text-muted-foreground">
                  Minimizes pulse glows, radar transitions, and SVG chart animations.
                </span>
              </div>
            </div>

            <button
              onClick={toggleReducedMotion}
              className={`ui-button px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                reducedMotion
                  ? "border-primary bg-action text-primary-foreground"
                  : "border-card-border bg-muted/40 hover:bg-muted text-foreground"
              }`}
            >
              {reducedMotion ? "Active" : "Enable"}
            </button>
          </div>
        </div>
      </Panel>

      {/* 2. Reskilling Pace & Career Target */}
      <Panel className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-success ring-1 ring-emerald-500/30">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Learning Profile &amp; Study Commitments
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure your available weekly study time and active target career.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Target Career Switcher */}
          <div className="p-4 rounded-xl border border-card-border bg-muted/20 space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span>Active Target Career Pathway</span>
            </label>
            <select aria-label="Target career pathway"
              value={targetRole?.id || ""}
              onChange={(e) => setTargetRole(e.target.value)}
              className="ui-field w-full p-2.5 rounded-lg border border-card-border bg-card text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- No Target Designated --</option>
              {ROLES_CATALOG.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.industry})
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground">
              The 4-phase learning pathway dynamically aligns modules with this target occupation.
            </p>
          </div>

          {/* Weekly Hours Commitment */}
          <div className="p-4 rounded-xl border border-card-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-success" />
                <span>Weekly Available Reskilling Hours</span>
              </label>
              <span className="font-mono font-semibold text-primary">
                {profile.weeklyHours || 10} hrs/week
              </span>
            </div>
            <input aria-label="Weekly study hours"
              type="range"
              min="2"
              max="35"
              step="1"
              value={profile.weeklyHours || 10}
              onChange={(e) =>
                updateProfile({ weeklyHours: Number(e.target.value) })
              }
              className="ui-field w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Used in the Progress dashboard to forecast module completion dates and curriculum pacing.
            </p>
          </div>
        </div>
      </Panel>

      {/* 3. Data Sovereignty & Reset */}
      <Panel className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-card-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-destructive ring-1 ring-rose-500/30">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Client-Side Data Sovereignty &amp; Zero-Database Invariant
            </h2>
            <p className="text-sm text-muted-foreground">
              Inspect client-side storage usage and perform an atomic workspace purge.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-card-border bg-muted/20 space-y-1">
              <span className="text-xs uppercase font-mono font-semibold text-muted-foreground">
                Storage Key
              </span>
              <div className="font-mono text-xs font-semibold text-foreground truncate">
                skillax_workspace_v2
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-card-border bg-muted/20 space-y-1">
              <span className="text-xs uppercase font-mono font-semibold text-muted-foreground">
                Payload Size
              </span>
              <div className="font-mono text-xs font-semibold text-accent-cyan">
                {(storageBytes / 1024).toFixed(2)} KB
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-card-border bg-muted/20 space-y-1">
              <span className="text-xs uppercase font-mono font-semibold text-muted-foreground">
                Server Persistence
              </span>
              <div className="text-sm font-semibold text-success flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Zero Database</span>
              </div>
            </div>
          </div>

          {/* Reset Workspace Action Card */}
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-destructive uppercase tracking-wider">
                Atomic Workspace Reset
              </h4>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Permanently purge all client-side preferences, custom rated skills, saved roadmap milestones, and imported workforce observations.
              </p>
            </div>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="ui-button inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow transition-colors shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Workspace</span>
            </button>
          </div>
        </div>
      </Panel>

      {/* Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
