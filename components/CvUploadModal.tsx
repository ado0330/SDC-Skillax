"use client";

import React, { useState, useRef } from "react";
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
  FileCheck2,
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
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "samples">("upload");
  const [consentAI, setConsentAI] = useState(false);
  const [consentSynthetic, setConsentSynthetic] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("sample-aina");
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Staged review proposal
  const [stagedProposal, setStagedProposal] = useState<CvExtractionOutput | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File must be 10 MB or smaller.");
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleAnalyze = async () => {
    if (!consentAI || !consentSynthetic) {
      setErrorMessage("Please confirm both consent checkboxes before proceeding.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      let res: Response;

      if (activeTab === "upload") {
        if (!selectedFile) {
          setErrorMessage("Please select a resume file (.pdf, .txt, .md) to upload.");
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("consentAI", "true");
        formData.append("consentSynthetic", "true");

        res = await fetch("/api/cv/analyze", {
          method: "POST",
          body: formData,
        });
      } else if (activeTab === "paste") {
        if (!pastedText.trim()) {
          setErrorMessage("Please paste your resume text to analyze.");
          setIsLoading(false);
          return;
        }

        res = await fetch("/api/cv/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: pastedText,
            consentAI,
            consentSynthetic,
          }),
        });
      } else {
        // samples
        res = await fetch("/api/cv/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sampleId: selectedSampleId,
            consentAI,
            consentSynthetic,
          }),
        });
      }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="panel-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-lg border-card-border bg-card">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-accent-cyan ring-1 ring-cyan-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {stagedProposal ? "Review Extracted Profile" : "AI Resume / CV Analyzer"}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stagedProposal
                  ? "Human-in-the-Loop review: Inspect and adjust extracted details before updating your profile."
                  : "Google Gemini 3.5 Flash Lite scans your CV to extract your experience, skills, and industry background."}
              </p>
            </div>
          </div>
          <button aria-label="Close dialog"
            onClick={onClose}
            className="ui-button ui-button-icon rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {stagedProposal ? (
            /* STAGE 2: Human-in-the-Loop Review */
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm">
                <div>
                  <span className="font-semibold text-sm text-foreground block">
                    {stagedProposal.name || "Candidate"}
                  </span>
                  <p className="text-muted-foreground mt-0.5">
                    {stagedProposal.occupation} • {stagedProposal.experience} years exp • {stagedProposal.industry}
                  </p>
                  {stagedProposal.education && (
                    <p className="text-muted-foreground text-sm mt-0.5">
                      Education: {stagedProposal.education}
                    </p>
                  )}
                  {stagedProposal.professionalSummary && (
                    <p className="text-muted-foreground text-sm mt-2 italic bg-background/40 p-2 rounded">
                      &quot;{stagedProposal.professionalSummary}&quot;
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 font-mono text-xs font-semibold text-accent-cyan uppercase shrink-0">
                  {stagedProposal.extractionMethod.replace("_", " ")}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Detected Skills ({Object.keys(stagedProposal.skills).length} Mapped)
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    Adjust any level before merging
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(stagedProposal.skills).map(([skillId, level]) => {
                    const skill = SKILLS_BY_ID.get(skillId);
                    return (
                      <div
                        key={skillId}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-card-border bg-card p-2.5 text-sm"
                      >
                        <div>
                          <span className="font-semibold text-foreground">
                            {skill?.name || skillId}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({skill?.category})
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <LevelDots currentLevel={level} size="sm" />
                          <select aria-label={`Suggested level for ${skill?.name || skillId}`}
                            value={level}
                            onChange={(e) =>
                              updateStagedSkill(skillId, parseInt(e.target.value) || 0)
                            }
                            className="ui-field rounded border border-card-border bg-background px-1.5 py-0.5 text-sm text-foreground"
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
                    Suggested Career Interests
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stagedProposal.interests.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-sm text-primary font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STAGE 1: Intake Options (Upload File, Paste Text, or Synthetic Samples) */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex rounded-xl border border-card-border bg-muted/60 p-1 text-sm">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`ui-button flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === "upload"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Upload File (.pdf, .txt)
                </button>
                <button
                  onClick={() => setActiveTab("paste")}
                  className={`ui-button flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === "paste"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setActiveTab("samples")}
                  className={`ui-button flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === "samples"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Synthetic Presets
                </button>
              </div>

              {/* Tab 1: Upload File */}
              {activeTab === "upload" && (
                <div className="space-y-3">
                  <input aria-label="Select synthetic CV file"
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.txt,.md,.doc,.docx"
                    onChange={handleFileChange}
                    className="ui-field hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-card-border hover:border-cyan-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all bg-muted/20 hover:bg-muted/40 group"
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileCheck2 className="h-10 w-10 text-accent-cyan" />
                        <div>
                          <span className="text-sm font-semibold text-foreground block">
                            {selectedFile.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB • Ready for AI extraction
                          </span>
                        </div>
                        <span className="text-sm text-accent-cyan font-medium underline mt-1">
                          Click to select a different file
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground group-hover:text-accent-cyan transition-colors" />
                        <div>
                          <span className="text-sm font-semibold text-foreground block">
                            Click to browse or drop your CV / Resume here
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Supports PDF, Plain Text (.txt), and Markdown (.md) up to 10 MB
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Paste Text */}
              {activeTab === "paste" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Paste Resume Content (Fictional / Synthetic Only)
                  </label>
                  <textarea aria-label="Paste resume text, work experience, bullet points, or skills list here..."
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste resume text, work experience, bullet points, or skills list here..."
                    className="ui-field w-full rounded-xl border border-card-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              {/* Tab 3: Synthetic Samples */}
              {activeTab === "samples" && (
                <div className="space-y-2.5">
                  <p className="text-sm text-muted-foreground">
                    Select a curated synthetic Malaysian profile to test instant extraction without uploading a file:
                  </p>
                  <div className="space-y-2">
                    {SAMPLE_CVS.map((sample) => (
                      <label
                        key={sample.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
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
                          className="ui-field mt-1 accent-primary"
                        />
                        <div>
                          <div className="font-semibold text-sm text-foreground">
                            {sample.label}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {sample.occupation} • {sample.education}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {sample.professionalSummary}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Mandatory Consent Checkboxes (E-007) */}
              <div className="rounded-xl border border-card-border bg-muted/40 p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent-cyan" />
                  <span>Privacy &amp; Demonstration Consents</span>
                </div>
                <label className="flex items-start gap-2.5 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAI}
                    onChange={(e) => setConsentAI(e.target.checked)}
                    className="ui-field mt-0.5 accent-primary"
                  />
                  <span>
                    I consent to ephemeral AI processing of this document text for capability extraction.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentSynthetic}
                    onChange={(e) => setConsentSynthetic(e.target.checked)}
                    className="ui-field mt-0.5 accent-primary"
                  />
                  <span>
                    I acknowledge that raw resume files are never persisted to disk or external databases.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-card-border px-6 py-4 flex items-center justify-between bg-muted/20">
          <button
            onClick={onClose}
            className="ui-button rounded-lg border border-card-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>

          {stagedProposal ? (
            <button
              onClick={handleApply}
              className="ui-button inline-flex items-center gap-2 rounded-xl bg-action px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-action-hover shadow transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Apply to Profile &amp; Recalculate</span>
            </button>
          ) : (
            <button
              disabled={isLoading || !consentAI || !consentSynthetic}
              onClick={handleAnalyze}
              className={`ui-button inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold shadow transition-all ${
                isLoading || !consentAI || !consentSynthetic
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-action text-primary-foreground hover:bg-action-hover"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scanning with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Document with AI</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
