"use client";

import React, { useState } from "react";
import { Milestone, Role, UserProfile } from "@/lib/domain/types";
import {
  Download,
  Printer,
  X,
  FileJson,
  Check,
  Copy,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: Role | undefined;
  profile: UserProfile;
  roadmap: Milestone[];
  totalHours: number;
}

export function ExportModal({
  isOpen,
  onClose,
  targetRole,
  profile,
  roadmap,
  totalHours,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    platform: "SKILLAX AI Career OS",
    version: "2.0-SDC",
    candidate: {
      name: profile.name,
      occupation: profile.occupation,
      industry: profile.industry,
      experience: profile.experience,
      weeklyHours: profile.weeklyHours,
    },
    targetRole: {
      id: targetRole?.id,
      name: targetRole?.name,
      industry: targetRole?.industry,
      onetUrl: targetRole?.sourceUrl,
    },
    summary: {
      totalMilestones: roadmap.length,
      completedMilestones: roadmap.filter((m) => m.completed).length,
      totalEstimatedHours: totalHours,
    },
    roadmap: roadmap.map((m) => ({
      id: m.id,
      phase: m.phase,
      title: m.title,
      skillId: m.skillId,
      estimatedHours: m.hours,
      provider: m.provider,
      url: m.url,
      completed: m.completed,
      objective: m.objective,
    })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillax-roadmap-${targetRole?.id || "plan"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm print:hidden">
      <div className="panel-card w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-lg">
        <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Export Learning Pathway</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Download structured JSON or print a document for stakeholders.
              </p>
            </div>
          </div>
          <button aria-label="Close dialog" onClick={onClose} className="ui-button ui-button-icon rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadJson}
              className="ui-button ui-button-secondary flex items-center justify-center gap-2 rounded-lg border border-card-border bg-card p-4 hover:border-primary/50 hover:bg-muted/40 transition-all text-sm font-semibold text-foreground"
            >
              <FileJson className="h-5 w-5 text-accent-cyan" />
              <span>Download JSON File</span>
            </button>
            <button
              onClick={handlePrint}
              className="ui-button ui-button-secondary flex items-center justify-center gap-2 rounded-lg border border-card-border bg-card p-4 hover:border-primary/50 hover:bg-muted/40 transition-all text-sm font-semibold text-foreground"
            >
              <Printer className="h-5 w-5 text-primary" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                JSON Preview
              </span>
              <button
                onClick={handleCopyJson}
                className="ui-button inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
              </button>
            </div>
            <pre className="max-h-56 overflow-y-auto rounded-lg border border-card-border bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
              {jsonString}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-card-border px-6 py-4 bg-muted/20">
          <button
            onClick={onClose}
            className="ui-button ui-button-secondary rounded-lg bg-card border border-card-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
