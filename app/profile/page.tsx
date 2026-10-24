"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { LevelDots } from "@/components/LevelDots";
import { SKILLS_CATALOG } from "@/lib/data/skills";
import { SAMPLE_CVS } from "@/lib/data/sampleCvs";
import { UserProfile, SkillCategory } from "@/lib/domain/types";
import {
  Save,
  FileText,
  Plus,
  X,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const PROFICIENCY_LABELS = [
  "0: Unrated / None",
  "1: Novice / Basic concepts",
  "2: Elementary / Guided practice",
  "3: Intermediate / Autonomous execution",
  "4: Advanced / Complex problem-solving",
  "5: Expert / Mentorship & architecture",
];

const INDUSTRIES = [
  "Business & Services",
  "Technology",
  "Manufacturing",
  "Sustainability",
  "Health",
  "Agriculture",
  "Finance & Banking",
  "Education",
];

import { CvUploadModal } from "@/components/CvUploadModal";
import { CvExtractionOutput } from "@/lib/schemas/cv";

export default function ProfilePage() {
  const {
    profile,
    updateProfile,
    setSkillLevel,
    addInterest,
    removeInterest,
    loadSyntheticPreset,
  } = useWorkspace();

  // Local draft state for smooth editing
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [interestInput, setInterestInput] = useState("");
  const [customSkillName, setCustomSkillName] = useState("");
  const [customSkillLevel, setCustomSkillLevel] = useState(3);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  // Sync draft whenever global profile changes
  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleApplyCvProposal = (proposal: CvExtractionOutput) => {
    setDraft((prev) => ({
      ...prev,
      name: proposal.name || prev.name,
      occupation: proposal.occupation || prev.occupation,
      industry: proposal.industry || prev.industry,
      education: proposal.education || prev.education,
      experience: proposal.experience || prev.experience,
      professionalSummary: proposal.professionalSummary || prev.professionalSummary,
      skills: {
        ...prev.skills,
        ...proposal.skills,
      },
      interests: Array.from(new Set([...prev.interests, ...proposal.interests])),
      additionalSkills: [
        ...prev.additionalSkills,
        ...proposal.additionalSkills,
      ],
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Group skills by category
  const transferableSkills = SKILLS_CATALOG.filter((s) => s.category === "Transferable");
  const digitalSkills = SKILLS_CATALOG.filter((s) => s.category === "Digital");
  const technicalSkills = SKILLS_CATALOG.filter((s) => s.category === "Technical");

  const getRatedCount = (category: SkillCategory) => {
    const catSkills = SKILLS_CATALOG.filter((s) => s.category === category);
    return catSkills.filter((s) => (draft.skills[s.id] ?? 0) > 0).length;
  };

  const handleSliderChange = (skillId: string, value: number) => {
    setDraft((prev) => {
      const nextSkills = { ...prev.skills };
      if (value <= 0) {
        delete nextSkills[skillId];
      } else {
        nextSkills[skillId] = value;
      }
      return { ...prev, skills: nextSkills };
    });
  };

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (!trimmed) return;
    if (draft.interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setInterestInput("");
      return;
    }
    setDraft((prev) => ({
      ...prev,
      interests: [...prev.interests, trimmed],
    }));
    setInterestInput("");
  };

  const handleRemoveInterest = (tag: string) => {
    setDraft((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (i) => i.toLowerCase() !== tag.toLowerCase()
      ),
    }));
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillName.trim();
    if (!trimmed) return;
    if (draft.additionalSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSkillName("");
      return;
    }
    setDraft((prev) => ({
      ...prev,
      additionalSkills: [
        ...prev.additionalSkills,
        { name: trimmed, level: customSkillLevel },
      ],
    }));
    setCustomSkillName("");
  };

  const handleRemoveCustomSkill = (name: string) => {
    setDraft((prev) => ({
      ...prev,
      additionalSkills: prev.additionalSkills.filter((s) => s.name !== name),
    }));
  };

  const handleSave = () => {
    if (!draft.name || draft.name.trim().length === 0) {
      setErrorMessage("Enter your full name before saving your profile.");
      return;
    }
    setErrorMessage(null);
    updateProfile(draft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Capability Mapping"
        title="Skills Profile & Background"
        description="Map your capability levels (0–5) across 19 standard skills, specify career interests, and record your background to unlock deterministic role matching."
      >
        <button
          type="button"
          onClick={() => setIsCvModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Import CV / Resume</span>
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Profile</span>
        </button>
      </PageHeader>

      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Profile saved successfully. Career matches and roadmaps have been updated.</span>
        </div>
      )}

      {/* Demo Fast-Track Presets */}
      <Panel className="bg-gradient-to-r from-cyan-950/20 via-background to-indigo-950/20 border-cyan-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                One-Click Synthetic Profiles (SDC Demonstration)
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Instantly populate realistic Malaysian worker profiles for zero-typing evaluation.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadSyntheticPreset("sample-aina")}
              className="rounded-md border border-card-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
            >
              Aina (Logistics • 7y)
            </button>
            <button
              onClick={() => loadSyntheticPreset("sample-daniel")}
              className="rounded-md border border-card-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
            >
              Daniel (Data • 2y)
            </button>
            <button
              onClick={() => loadSyntheticPreset("sample-kumar")}
              className="rounded-md border border-card-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
            >
              Kumar (Maintenance • 11y)
            </button>
          </div>
        </div>
      </Panel>

      {/* Grid: Profile Details + Skills Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Background & Constraints */}
        <div className="space-y-6 lg:col-span-1">
          <Panel title="Personal Details" subtitle="Demographics & Career Focus">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Aina binti Abdullah"
                  className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Current Occupation</label>
                <input
                  type="text"
                  value={draft.occupation}
                  onChange={(e) => setDraft({ ...draft, occupation: e.target.value })}
                  placeholder="e.g. Operations Coordinator"
                  className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Industry Domain</label>
                <select
                  value={draft.industry}
                  onChange={(e) => setDraft({ ...draft, industry: e.target.value })}
                  className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Highest Education</label>
                <input
                  type="text"
                  value={draft.education}
                  onChange={(e) => setDraft({ ...draft, education: e.target.value })}
                  placeholder="e.g. Bachelor of Business Administration"
                  className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={draft.experience}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        experience: Math.max(0, Math.min(60, parseInt(e.target.value) || 0)),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Weekly Study (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={80}
                    value={draft.weeklyHours}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        weeklyHours: Math.max(1, Math.min(80, parseInt(e.target.value) || 10)),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Professional Summary</label>
                <textarea
                  value={draft.professionalSummary}
                  onChange={(e) => setDraft({ ...draft, professionalSummary: e.target.value })}
                  rows={3}
                  placeholder="Briefly describe your responsibilities and strengths..."
                  className="mt-1 w-full rounded-md border border-card-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={1500}
                />
              </div>

              {/* Career Interests Tags (F-007) */}
              <div>
                <label className="text-xs font-medium text-foreground">
                  Career Interests & Keywords (15% Match Component)
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="e.g. Data Analytics, Technology"
                    className="flex-1 rounded-md border border-card-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-white hover:bg-secondary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {draft.interests.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {draft.interests.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(tag)}
                          className="hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          {/* Additional Non-Catalogue Skills (F-008) */}
          <Panel
            title="Specialized / Bespoke Skills"
            subtitle="Skills outside standard 19-skill matching catalogue"
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="e.g. Contract Negotiation"
                  className="flex-1 rounded-md border border-card-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                />
                <select
                  value={customSkillLevel}
                  onChange={(e) => setCustomSkillLevel(parseInt(e.target.value) || 3)}
                  className="rounded-md border border-card-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Lvl {lvl}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {draft.additionalSkills.length > 0 ? (
                <div className="space-y-1.5 pt-2 border-t border-card-border">
                  {draft.additionalSkills.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-medium text-foreground">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <LevelDots currentLevel={s.level} size="sm" />
                        <button
                          onClick={() => handleRemoveCustomSkill(s.name)}
                          className="text-muted-foreground hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic pt-1">
                  No additional custom skills recorded yet.
                </p>
              )}
            </div>
          </Panel>
        </div>

        {/* Right Columns: 19 Catalogue Skills Sliders (F-006) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Section 1: Transferable Skills */}
          <Panel
            title="Transferable Competencies"
            subtitle={`${getRatedCount("Transferable")} of ${transferableSkills.length} rated • 20% match weight`}
            icon={<Sparkles className="h-4 w-4" />}
          >
            <div className="space-y-4">
              {transferableSkills.map((skill) => {
                const currentVal = draft.skills[skill.id] ?? 0;
                return (
                  <div key={skill.id} className="rounded-lg border border-card-border/60 bg-card/40 p-3 hover:border-card-border transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className={`text-sm font-semibold ${currentVal > 0 ? "text-cyan-400" : "text-foreground"}`}>
                          {skill.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {currentVal}/5
                        </span>
                        <div className="mt-1">
                          <LevelDots currentLevel={currentVal} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(skill.id, parseInt(e.target.value) || 0)}
                        className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                      />
                      <span className="font-mono text-[11px] text-muted-foreground w-28 text-right truncate">
                        {PROFICIENCY_LABELS[currentVal].split(":")[1]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Section 2: Digital Skills */}
          <Panel
            title="Digital Competencies"
            subtitle={`${getRatedCount("Digital")} of ${digitalSkills.length} rated`}
            icon={<FileText className="h-4 w-4" />}
          >
            <div className="space-y-4">
              {digitalSkills.map((skill) => {
                const currentVal = draft.skills[skill.id] ?? 0;
                return (
                  <div key={skill.id} className="rounded-lg border border-card-border/60 bg-card/40 p-3 hover:border-card-border transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className={`text-sm font-semibold ${currentVal > 0 ? "text-cyan-400" : "text-foreground"}`}>
                          {skill.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {currentVal}/5
                        </span>
                        <div className="mt-1">
                          <LevelDots currentLevel={currentVal} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(skill.id, parseInt(e.target.value) || 0)}
                        className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                      />
                      <span className="font-mono text-[11px] text-muted-foreground w-28 text-right truncate">
                        {PROFICIENCY_LABELS[currentVal].split(":")[1]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Section 3: Technical Skills */}
          <Panel
            title="Technical & Engineering Competencies"
            subtitle={`${getRatedCount("Technical")} of ${technicalSkills.length} rated`}
            icon={<CheckCircle className="h-4 w-4" />}
          >
            <div className="space-y-4">
              {technicalSkills.map((skill) => {
                const currentVal = draft.skills[skill.id] ?? 0;
                return (
                  <div key={skill.id} className="rounded-lg border border-card-border/60 bg-card/40 p-3 hover:border-card-border transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className={`text-sm font-semibold ${currentVal > 0 ? "text-cyan-400" : "text-foreground"}`}>
                          {skill.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {currentVal}/5
                        </span>
                        <div className="mt-1">
                          <LevelDots currentLevel={currentVal} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(skill.id, parseInt(e.target.value) || 0)}
                        className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                      />
                      <span className="font-mono text-[11px] text-muted-foreground w-28 text-right truncate">
                        {PROFICIENCY_LABELS[currentVal].split(":")[1]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setDraft(profile)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard Unsaved Changes</span>
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Skills Profile</span>
            </button>
          </div>
        </div>
      </div>

      <CvUploadModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        onApplyProposal={handleApplyCvProposal}
      />
    </div>
  );
}
