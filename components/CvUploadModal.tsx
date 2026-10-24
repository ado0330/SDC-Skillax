"use client";

import React, { useState } from "react";
import { SAMPLE_CVS } from "@/lib/data/sampleCvs";
import { SKILLS_BY_ID } from "@/lib/data/skills";
import { CvExtractionOutput } from "@/lib/schemas/cv";
import { LevelDots } from "./LevelDots";
import {
  FileText,
  Upload,
  Sparkles,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  Loader2,
  FileCode,
} from "lucide-react";

interface CvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProposal: (proposal: CvExtractionOutput) => void;
}

export function CvUploadModal({
  isOpen,
  onClose,
  onApplyProposal,
}: CvUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"samples" | "paste" | "upload">("samples");
  const [consentAI, setConsentAI] = useState(false);
  const [consentSynthetic, setConsentSynthetic] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("sample-aina");
  const [pastedText, setPastedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Staged review proposal
  const [stagedProposal, setStagedProposal] = useState<CvExtractionOutput | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!consentAI || !consentSynthetic) {
      setErrorMessage("Please confirm both consent checkboxes before proceeding.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      let payload: Record<string, any> = {
        consentAI,
        consentSynthetic,
      };

      if (activeTab === "samples") {
        payload.sampleId = selectedSampleId;
      } else {
        if (!pastedText.trim()) {
          setErrorMessage("Please provide resume text to analyze.");
          setIsLoading(false);
          return;
        }
        payload.text = pastedText;
      }

      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Extraction failed");
      }

      setStagedProposal(data.proposal);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (stagedProposal) {
      onApplyProposal(stagedProposal);
      onClose();
    }
  };

  const updateStagedSkill = (skillId: string, level: number) => {
    if (!stagedProposal) return;
    const nextSkills = { ...stagedProposal.skills };
    if (level <= 0) {
      delete nextSkills[skillId];
    } else {
      nextSkills[skillId] = level;
    }
    setStagedProposal({
      ...stagedProposal,
      skills: nextSkills,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="panel-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-card-border">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {stagedProposal ? "Review Staged CV Suggestions" : "Consented CV & Resume Intake"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stagedProposal
                  ? "Human-in-the-Loop review: Verify and adjust extracted skills before merging into draft."
                  : "Ephemeral analysis with zero database persistence. Model suggestions require your approval."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {stagedProposal ? (
            /* STAGE 2: Human-in-the-Loop Review */
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs">
                <div>
                  <span className="font-semibold text-foreground">
                    Extracted Candidate: {stagedProposal.name || "Candidate"}
                  </span>
                  <p className="text-muted-foreground mt-0.5">
                    {stagedProposal.occupation} • {stagedProposal.experience} years experience • {stagedProposal.industry}
                  </p>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 font-mono text-[11px] font-semibold text-cyan-300 uppercase">
                  {stagedProposal.extractionMethod.replace("_", " ")}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Proposed Skill Ratings ({Object.keys(stagedProposal.skills).length} Detected)
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(stagedProposal.skills).map(([skillId, level]) => {
                    const skill = SKILLS_BY_ID.get(skillId);
                    return (
                      <div
                        key={skillId}
                        className="flex items-center justify-between rounded-lg border border-card-border bg-card p-2.5 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-foreground">
                            {skill?.name || skillId}
                          </span>
                          <span className="ml-2 text-[11px] text-muted-foreground">
                            ({skill?.category})
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <LevelDots currentLevel={level} size="sm" />
                          <select
                            value={level}
                            onChange={(e) =>
                              updateStagedSkill(skillId, parseInt(e.target.value) || 0)
                            }
                            className="rounded border border-card-border bg-background px-1.5 py-0.5 text-xs text-foreground"
                          >
                            <option value={0}>Remove</option>
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <option key={lvl} value={lvl}>
                                Level {lvl}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {stagedProposal.interests.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Suggested Interests
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stagedProposal.interests.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STAGE 1: Intake Options */
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex rounded-lg border border-card-border bg-muted p-1 text-xs">
                <button
                  onClick={() => setActiveTab("samples")}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                    activeTab === "samples"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Synthetic Presets (Offline)
                </button>
                <button
                  onClick={() => setActiveTab("paste")}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                    activeTab === "paste"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Paste Plain Text
                </button>
              </div>

              {activeTab === "samples" ? (
                <div className="space-y-2.5">
                  <p className="text-xs text-muted-foreground">
                    Select a curated synthetic Malaysian profile to test instant deterministic extraction without requiring an external file or live Gemini API key:
                  </p>
                  <div className="space-y-2">
                    {SAMPLE_CVS.map((sample) => (
                      <label
                        key={sample.id}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          selectedSampleId === sample.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-card-border bg-card/60 hover:bg-card"
                        }`}
                      >
                        <input
                          type="radio"
                          name="sampleCv"
                          checked={selectedSampleId === sample.id}
                          onChange={() => setSelectedSampleId(sample.id)}
                          className="mt-1 accent-primary"
                        />
                        <div>
                          <div className="font-semibold text-xs text-foreground">
                            {sample.label}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {sample.occupation} • {sample.education}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-1">
                            {sample.professionalSummary}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">
                    Paste Resume Content (Fictional / Synthetic Only)
                  </label>
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste resume text, skills list, or job experience here..."
                    className="w-full rounded-md border border-card-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              {/* Mandatory Consent Checkboxes (E-007) */}
              <div className="rounded-lg border border-card-border bg-muted/40 p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>Privacy & Demonstration Consents</span>
                </div>
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAI}
                    onChange={(e) => setConsentAI(e.target.checked)}
                    className="mt-0.5 accent-primary"
                  />
                  <span>
                    I consent to ephemeral AI processing of this document text for capability extraction.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentSynthetic}
                    onChange={(e) => setConsentSynthetic(e.target.checked)}
                    className="mt-0.5 accent-primary"
                  />
                  <span>
                    I confirm this is synthetic/fictional text containing no real personal or confidential data.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-card-border px-6 py-4 bg-muted/20">
          <button
            onClick={() => {
              if (stagedProposal) {
                setStagedProposal(null);
              } else {
                onClose();
              }
            }}
            className="rounded-lg border border-card-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {stagedProposal ? "Back to Intake" : "Cancel"}
          </button>

          {stagedProposal ? (
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Apply Suggestions to Profile</span>
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={!consentAI || !consentSynthetic || isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing Capabilities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Extract Capabilities</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
