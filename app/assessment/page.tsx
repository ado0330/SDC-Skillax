"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace/useWorkspace";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { LevelDots } from "@/components/LevelDots";
import { SKILLS_BY_ID } from "@/lib/data/skills";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Table,
  Cpu,
  Bot,
  Users,
  Cloud,
  Layers,
  Sliders,
  Check,
  RefreshCw,
} from "lucide-react";

interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  skillsImpact: Record<string, number>; // skillId -> level (1-5)
}

interface ScenarioQuestion {
  id: number;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  context: string;
  options: ScenarioOption[];
}

const SCENARIOS: ScenarioQuestion[] = [
  {
    id: 1,
    category: "Data Literacy & Reporting",
    icon: Table,
    title: "Managing Data, Spreadsheets & Reporting",
    context: "Think about your daily workflow when dealing with operational numbers, client inventories, or performance metrics.",
    options: [
      {
        id: "1a",
        label: "Manual Entry & Basic Documents",
        description: "I enter text into paper forms or basic documents without structured spreadsheets or statistical analysis.",
        skillsImpact: { excel: 1, analysis: 1 },
      },
      {
        id: "1b",
        label: "Standard Tables & Built-in Formulas",
        description: "I sort tables, apply basic filters, and use fundamental SUM, AVERAGE, and COUNT formulas in Excel or Google Sheets.",
        skillsImpact: { excel: 3, analysis: 2 },
      },
      {
        id: "1c",
        label: "Advanced Spreadsheets & Pivot Dashboards",
        description: "I build dynamic pivot tables, VLOOKUP/XLOOKUP formulas, conditional logic, and monthly executive dashboards.",
        skillsImpact: { excel: 4, analysis: 3, sql: 1 },
      },
      {
        id: "1d",
        label: "Database Queries & Automated Pipelines",
        description: "I write SQL queries to extract relational data, build BI models, and script data transformation in Python.",
        skillsImpact: { excel: 5, analysis: 4, sql: 4, python: 3 },
      },
    ],
  },
  {
    id: 2,
    category: "Process Optimization & Automation",
    icon: Cpu,
    title: "Handling Repetitive Workplace Routines",
    context: "When you notice that a weekly administrative or operational task requires repetitive manual steps...",
    options: [
      {
        id: "2a",
        label: "Manual Execution as Instructed",
        description: "I perform every step by hand following existing operational guidelines without altering the procedure.",
        skillsImpact: { automation: 1, organization: 2 },
      },
      {
        id: "2b",
        label: "Templates & Standard Operating Procedures",
        description: "I create reusable document templates, checklists, and keyboard shortcuts to reduce manual turnaround time.",
        skillsImpact: { automation: 2, organization: 3 },
      },
      {
        id: "2c",
        label: "No-Code Workflows & Trigger Automations",
        description: "I connect apps using Zapier, Make, Power Automate, or spreadsheet macros to send automated alerts and sync records.",
        skillsImpact: { automation: 4, organization: 4, excel: 3 },
      },
      {
        id: "2d",
        label: "Custom API Scripts & RPA Systems",
        description: "I write backend Python scripts, configure RPA bots, and manage webhooks to orchestrate enterprise data flows.",
        skillsImpact: { automation: 5, python: 4, apis: 3 },
      },
    ],
  },
  {
    id: 3,
    category: "Artificial Intelligence & Tool Usage",
    icon: Bot,
    title: "Employing Generative AI & Digital Assistants",
    context: "When integrating modern AI assistants (such as ChatGPT, Google Gemini, Claude, or Copilot) into your work...",
    options: [
      {
        id: "3a",
        label: "Little to No AI Exposure",
        description: "I haven't used AI tools in my day-to-day work, or find their outputs unpredictable and confusing.",
        skillsImpact: { ai: 1, ethics: 1 },
      },
      {
        id: "3b",
        label: "Drafting & Brainstorming Companion",
        description: "I use conversational AI to draft emails, summarize long meeting notes, and brainstorm initial outlines.",
        skillsImpact: { ai: 2, ethics: 2 },
      },
      {
        id: "3c",
        label: "Structured Prompting & Output Verification",
        description: "I write multi-step structured prompts with role constraints, verify citations against primary sources, and protect company privacy.",
        skillsImpact: { ai: 4, ethics: 4 },
      },
      {
        id: "3d",
        label: "LLM API Integration & Guardrails",
        description: "I integrate LLM endpoints into software applications, test temperature parameters, and build ethical governance safeguards.",
        skillsImpact: { ai: 5, ethics: 5, apis: 4, python: 3 },
      },
    ],
  },
  {
    id: 4,
    category: "Communication & Stakeholder Management",
    icon: Users,
    title: "Cross-Functional Collaboration & Project Delivery",
    context: "When delivering an urgent cross-departmental initiative or presenting recommendations to decision makers...",
    options: [
      {
        id: "4a",
        label: "Individual Task Execution",
        description: "I complete my assigned tasks independently and notify my direct supervisor upon task completion.",
        skillsImpact: { communication: 2, organization: 2 },
      },
      {
        id: "4b",
        label: "Team Status Reporting",
        description: "I facilitate daily or weekly updates for my immediate team and communicate task milestones clearly via email and chat.",
        skillsImpact: { communication: 3, organization: 3 },
      },
      {
        id: "4c",
        label: "Cross-Department Project Coordination",
        description: "I lead sprint ceremonies or project milestones, resolve cross-team dependencies, and deliver executive retrospectives.",
        skillsImpact: { communication: 4, organization: 5, teaching: 3 },
      },
      {
        id: "4d",
        label: "Executive Strategic Facilitation & Mentorship",
        description: "I run cross-enterprise capability workshops, mentor emerging professionals, and align C-suite priorities with operations.",
        skillsImpact: { communication: 5, organization: 5, teaching: 5 },
      },
    ],
  },
  {
    id: 5,
    category: "Digital Systems & Infrastructure",
    icon: Cloud,
    title: "Interacting with Cloud Systems & Security",
    context: "When managing digital assets, business applications, and IT security protocols...",
    options: [
      {
        id: "5a",
        label: "Basic Office Applications",
        description: "I work inside desktop office software and company web portals pre-configured by the technical team.",
        skillsImpact: { cloud: 1, security: 1 },
      },
      {
        id: "5b",
        label: "Shared Cloud Folders & Permission Checks",
        description: "I manage shared team drives (Google Workspace, SharePoint), enforce two-factor authentication, and spot phishing emails.",
        skillsImpact: { cloud: 2, security: 3 },
      },
      {
        id: "5c",
        label: "Cloud Service Configuration & Access Control",
        description: "I configure cloud workspaces (AWS/GCP/Azure/SaaS), set role-based access control (RBAC), and review access audits.",
        skillsImpact: { cloud: 4, security: 4, apis: 2 },
      },
      {
        id: "5d",
        label: "Resilient Cloud Architecture & DevOps",
        description: "I manage containerized microservices (Docker/Kubernetes), write Infrastructure-as-Code (Terraform), and configure CI/CD.",
        skillsImpact: { cloud: 5, security: 5, devops: 4 },
      },
    ],
  },
];

export default function AssessmentWizardPage() {
  const router = useRouter();
  const { profile, updateProfile } = useWorkspace();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [adjustedSkills, setAdjustedSkills] = useState<Record<string, number>>({});
  const [isReviewed, setIsReviewed] = useState<boolean>(false);

  // Compute aggregated skills impact from selected answers
  const computedSkills = React.useMemo(() => {
    const skills: Record<string, number> = {};

    Object.entries(selectedAnswers).forEach(([scenarioIdx, optionId]) => {
      const scenario = SCENARIOS[Number(scenarioIdx)];
      if (!scenario) return;
      const option = scenario.options.find((o) => o.id === optionId);
      if (!option) return;

      Object.entries(option.skillsImpact).forEach(([skillId, level]) => {
        skills[skillId] = Math.max(skills[skillId] || 0, level);
      });
    });

    return skills;
  }, [selectedAnswers]);

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStep]: optionId,
    }));
  };

  // Move to review stage
  const handleProceedToReview = () => {
    // Initialize adjusted skills with computed skills
    setAdjustedSkills({ ...computedSkills });
    setIsReviewed(true);
  };

  // Adjust level in review
  const handleSkillLevelChange = (skillId: string, level: number) => {
    setAdjustedSkills((prev) => ({
      ...prev,
      [skillId]: Math.max(0, Math.min(5, level)),
    }));
  };

  // Save to profile
  const handleApplyToProfile = () => {
    const merged = {
      ...profile.skills,
      ...adjustedSkills,
    };
    updateProfile({
      skills: merged,
      name: profile.name || "Assessed Learner",
    });
    router.push("/careers");
  };

  // Fast-track demo answers
  const handleFastTrack = () => {
    setSelectedAnswers({
      0: "1c", // Advanced spreadsheets
      1: "2c", // No-code automation
      2: "3c", // Structured prompting
      3: "4b", // Team reporting
      4: "5b", // Shared cloud
    });
    setAdjustedSkills({
      excel: 4,
      analysis: 3,
      sql: 1,
      automation: 4,
      organization: 4,
      ai: 4,
      ethics: 4,
      communication: 3,
      cloud: 2,
      security: 3,
    });
    setIsReviewed(true);
  };

  const isCurrentQuestionAnswered = selectedAnswers[currentStep] !== undefined;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Conversational Assessment"
        title="5-Scenario Capability Wizard"
        description="Translate practical, everyday workplace habits into standardized 0–5 capability ratings without technical jargon."
      >
        <button
          onClick={handleFastTrack}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Fast-Track Sample</span>
        </button>
      </PageHeader>

      {/* Progress Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            {isReviewed ? "Step 6: Review & Apply" : `Scenario ${currentStep + 1} of ${SCENARIOS.length}`}
          </span>
          <span>
            {isReviewed ? "100% Ready" : `${Math.round(((currentStep + 1) / (SCENARIOS.length + 1)) * 100)}% Completed`}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-card-border overflow-hidden">
          <div
            style={{
              width: isReviewed
                ? "100%"
                : `${((currentStep + 1) / (SCENARIOS.length + 1)) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
          />
        </div>
      </div>

      {!isReviewed ? (
        /* Scenario Question Card */
        <div className="space-y-6">
          {(() => {
            const scenario = SCENARIOS[currentStep];
            const Icon = scenario.icon;

            return (
              <Panel glow className="p-6 sm:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30 shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                      {scenario.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                      {scenario.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      {scenario.context}
                    </p>
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {scenario.options.map((opt) => {
                    const isSelected = selectedAnswers[currentStep] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/40 shadow-md"
                            : "border-card-border bg-card/60 hover:bg-card hover:border-card-border/80"
                        }`}
                      >
                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-card-border shrink-0">
                          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-foreground">
                              {opt.label}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {Object.entries(opt.skillsImpact).map(([sId, lvl]) => {
                                const sk = SKILLS_BY_ID.get(sId);
                                return (
                                  <span
                                    key={sId}
                                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold"
                                  >
                                    {sk?.name || sId} L{lvl}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 border-t border-card-border flex items-center justify-between">
                  <button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border border-card-border transition-colors ${
                      currentStep === 0
                        ? "opacity-40 cursor-not-allowed text-muted-foreground"
                        : "hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep < SCENARIOS.length - 1 ? (
                    <button
                      disabled={!isCurrentQuestionAnswered}
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-lg transition-all ${
                        !isCurrentQuestionAnswered
                          ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                      }`}
                    >
                      <span>Next Scenario</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      disabled={!isCurrentQuestionAnswered}
                      onClick={handleProceedToReview}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-lg transition-all ${
                        !isCurrentQuestionAnswered
                          ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground"
                          : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
                      }`}
                    >
                      <span>Review Staged Ratings</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </Panel>
            );
          })()}
        </div>
      ) : (
        /* Review & Staging Screen */
        <Panel glow className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Stage 2: Human-in-the-Loop Verification
              </span>
              <h2 className="text-2xl font-extrabold text-foreground mt-0.5">
                Staged Diagnostic Ratings
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Based on your scenario responses, the following standard capability ratings have been generated. Review and adjust any rating before applying them to your active profile.
              </p>
            </div>

            <button
              onClick={() => {
                setIsReviewed(false);
                setCurrentStep(0);
              }}
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retake Wizard</span>
            </button>
          </div>

          {/* Staged Skills Table */}
          <div className="rounded-xl border border-card-border overflow-hidden bg-card divide-y divide-card-border/60">
            {Object.entries(adjustedSkills).map(([skillId, stagedLevel]) => {
              const meta = SKILLS_BY_ID.get(skillId);
              const currentLevel = profile.skills[skillId] || 0;
              const delta = stagedLevel - currentLevel;

              return (
                <div
                  key={skillId}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {meta?.name || skillId}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                        {meta?.category || "Technical"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Prior Level: L{currentLevel}</span>
                      <span>→</span>
                      <span>Suggested: L{stagedLevel}</span>
                      {delta !== 0 && (
                        <span
                          className={`font-semibold ${
                            delta > 0 ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          ({delta > 0 ? `+${delta}` : delta})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Level Adjustment Controls */}
                  <div className="flex items-center gap-3">
                    <LevelDots currentLevel={stagedLevel} maxLevel={5} size="sm" />
                    <div className="flex items-center gap-1 border border-card-border rounded-lg bg-card p-0.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => handleSkillLevelChange(skillId, lvl)}
                          className={`h-6 w-6 rounded text-xs font-mono font-semibold transition-colors ${
                            stagedLevel === lvl
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/profile"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel &amp; return to profile
            </Link>

            <button
              onClick={handleApplyToProfile}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.01]"
            >
              <Check className="h-4 w-4" />
              <span>Apply Ratings &amp; Explore Careers</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Panel>
      )}
    </div>
  );
}
