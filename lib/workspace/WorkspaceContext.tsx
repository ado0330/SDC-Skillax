"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  AIScenario,
  CareerMatch,
  Milestone,
  ResearchSignal,
  Role,
  UserProfile,
  WorkforceObservation,
} from "../domain/types";
import { ROLES_CATALOG, ROLES_BY_ID } from "../data/roles";
import { FALLBACK_RESEARCH_SIGNALS } from "../data/fallbackSignals";
import { INITIAL_WORKFORCE_OBSERVATIONS } from "../data/initialWorkforce";
import { SAMPLE_CVS } from "../data/sampleCvs";
import { rankCareerRoles } from "../domain/scoring";
import { generateLearningRoadmap } from "../domain/roadmap";

const STORAGE_KEY = "skillax_workspace_v2";

export interface RecommendationProposal {
  id: string;
  timestamp: string;
  reason: string;
  beforeMatches: CareerMatch[];
  afterMatches: CareerMatch[];
  proposedRoadmap: Milestone[];
  status: "Pending Review" | "Approved" | "Rejected";
}

export interface WorkspaceContextType {
  // State
  profile: UserProfile;
  scenario: AIScenario;
  simulationBoost: number;
  researchSignals: ResearchSignal[];
  workforceObservations: WorkforceObservation[];
  completedMilestoneIds: string[];
  roadmap: Milestone[];
  recommendationHistory: RecommendationProposal[];
  theme: "dark" | "light";
  reducedMotion: boolean;
  isHydrated: boolean;

  // Derived
  isProfileInitialized: boolean;
  matches: CareerMatch[];
  targetRole: Role | undefined;
  topMatch: CareerMatch | undefined;
  pendingProposal: RecommendationProposal | undefined;

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  setTargetRole: (roleId: string) => void;
  setScenario: (scenario: AIScenario) => void;
  setSimulationBoost: (boost: number) => void;
  toggleMilestone: (milestoneId: string) => void;
  regenerateRoadmap: () => void;
  setResearchSignals: (signals: ResearchSignal[]) => void;
  importWorkforceObservations: (newObs: WorkforceObservation[]) => void;
  resetWorkforceObservations: () => void;
  approveProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
  stageReplanningProposal: (reason?: string) => void;
  toggleTheme: () => void;
  toggleReducedMotion: () => void;
  resetWorkspace: () => void;
  loadSyntheticPreset: (presetId: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  occupation: "",
  industry: "Business & Services",
  education: "",
  experience: 3,
  weeklyHours: 10,
  budget: 0,
  language: "English",
  professionalSummary: "",
  experienceSummary: "",
  skills: {},
  interests: [],
  additionalSkills: [],
  updatedAt: new Date().toISOString(),
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [scenario, setScenarioState] = useState<AIScenario>("moderate");
  const [simulationBoost, setSimulationBoostState] = useState<number>(0);
  const [researchSignals, setResearchSignals] = useState<ResearchSignal[]>(
    FALLBACK_RESEARCH_SIGNALS
  );
  const [workforceObservations, setWorkforceObservations] = useState<WorkforceObservation[]>(
    INITIAL_WORKFORCE_OBSERVATIONS
  );
  const [completedMilestoneIds, setCompletedMilestoneIds] = useState<string[]>([]);
  const [savedRoadmap, setSavedRoadmap] = useState<Milestone[]>([]);
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationProposal[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // 1. Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.profile) setProfile(data.profile);
        if (data.scenario) setScenarioState(data.scenario);
        if (typeof data.simulationBoost === "number") setSimulationBoostState(data.simulationBoost);
        if (data.researchSignals) setResearchSignals(data.researchSignals);
        if (data.workforceObservations) setWorkforceObservations(data.workforceObservations);
        if (data.completedMilestoneIds) setCompletedMilestoneIds(data.completedMilestoneIds);
        if (data.savedRoadmap) setSavedRoadmap(data.savedRoadmap);
        if (data.recommendationHistory) setRecommendationHistory(data.recommendationHistory);
        if (data.theme) setTheme(data.theme);
        if (typeof data.reducedMotion === "boolean") setReducedMotion(data.reducedMotion);
      }
    } catch {
      // Ignore parse errors, fallback to initial state
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist to localStorage whenever state changes (client-side only, non-sensitive)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
        profile,
        scenario,
        simulationBoost,
        researchSignals,
        workforceObservations,
        completedMilestoneIds,
        savedRoadmap,
        recommendationHistory,
        theme,
        reducedMotion,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage limits or quota fallback
    }
  }, [
    isHydrated,
    profile,
    scenario,
    simulationBoost,
    researchSignals,
    workforceObservations,
    completedMilestoneIds,
    savedRoadmap,
    recommendationHistory,
    theme,
    reducedMotion,
  ]);

  // 3. Synchronize Theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 4. Pure Deterministic Matches Calculation
  const matches = useMemo(() => {
    return rankCareerRoles(
      ROLES_CATALOG,
      profile.skills,
      profile.interests,
      profile.targetRoleId,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations
    );
  }, [
    profile.skills,
    profile.interests,
    profile.targetRoleId,
    scenario,
    simulationBoost,
    researchSignals,
    workforceObservations,
  ]);

  const isProfileInitialized = Boolean(profile.name && profile.name.trim().length > 0);
  const topMatch = matches[0];
  const targetRole = useMemo(() => {
    if (profile.targetRoleId) {
      return ROLES_BY_ID.get(profile.targetRoleId);
    }
    return topMatch?.role ?? ROLES_CATALOG[0];
  }, [profile.targetRoleId, topMatch]);

  // 5. Active Roadmap (derived or saved with completed state)
  const activeRoadmap = useMemo(() => {
    if (savedRoadmap.length > 0) {
      // Sync completed checkmarks
      const completedSet = new Set(completedMilestoneIds);
      return savedRoadmap.map((m) => ({
        ...m,
        completed: completedSet.has(m.id),
      }));
    }
    if (!targetRole) return [];
    return generateLearningRoadmap(
      targetRole,
      profile.skills,
      scenario,
      new Set(completedMilestoneIds)
    );
  }, [savedRoadmap, targetRole, profile.skills, scenario, completedMilestoneIds]);

  // 6. Action Handlers
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setSkillLevel = useCallback((skillId: string, level: number) => {
    setProfile((prev) => {
      const nextSkills = { ...prev.skills };
      if (level <= 0) {
        delete nextSkills[skillId];
      } else {
        nextSkills[skillId] = Math.min(5, Math.max(1, Math.round(level)));
      }
      return {
        ...prev,
        skills: nextSkills,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const addInterest = useCallback((interest: string) => {
    const trimmed = interest.trim();
    if (!trimmed) return;
    setProfile((prev) => {
      if (prev.interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        interests: [...prev.interests, trimmed],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const removeInterest = useCallback((interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (i) => i.toLowerCase() !== interest.trim().toLowerCase()
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setTargetRole = useCallback((roleId: string) => {
    setProfile((prev) => ({
      ...prev,
      targetRoleId: roleId,
      updatedAt: new Date().toISOString(),
    }));

    // Generate fresh roadmap for target role
    const role = ROLES_BY_ID.get(roleId);
    if (role) {
      const freshRoadmap = generateLearningRoadmap(
        role,
        profile.skills,
        scenario,
        new Set(completedMilestoneIds)
      );
      setSavedRoadmap(freshRoadmap);
    }
  }, [profile.skills, scenario, completedMilestoneIds]);

  const setScenario = useCallback((nextScenario: AIScenario) => {
    setScenarioState(nextScenario);
  }, []);

  const setSimulationBoost = useCallback((boost: number) => {
    setSimulationBoostState(Math.max(-100, Math.min(100, Math.round(boost))));
  }, []);

  const toggleMilestone = useCallback((milestoneId: string) => {
    setCompletedMilestoneIds((prev) => {
      if (prev.includes(milestoneId)) {
        return prev.filter((id) => id !== milestoneId);
      } else {
        return [...prev, milestoneId];
      }
    });
  }, []);

  const regenerateRoadmap = useCallback(() => {
    if (!targetRole) return;
    const fresh = generateLearningRoadmap(
      targetRole,
      profile.skills,
      scenario,
      new Set(completedMilestoneIds)
    );
    setSavedRoadmap(fresh);
  }, [targetRole, profile.skills, scenario, completedMilestoneIds]);

  const importWorkforceObservations = useCallback((newObs: WorkforceObservation[]) => {
    setWorkforceObservations((prev) => [...prev, ...newObs]);
  }, []);

  const resetWorkforceObservations = useCallback(() => {
    setWorkforceObservations(INITIAL_WORKFORCE_OBSERVATIONS);
  }, []);

  const pendingProposal = useMemo(() => {
    return recommendationHistory.find((p) => p.status === "Pending Review");
  }, [recommendationHistory]);

  const approveProposal = useCallback((proposalId: string) => {
    setRecommendationHistory((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "Approved" } : p
      )
    );
    const proposal = recommendationHistory.find((p) => p.id === proposalId);
    if (proposal && proposal.proposedRoadmap.length > 0) {
      setSavedRoadmap(proposal.proposedRoadmap);
    }
  }, [recommendationHistory]);

  const rejectProposal = useCallback((proposalId: string) => {
    setRecommendationHistory((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "Rejected" } : p
      )
    );
  }, []);

  const stageReplanningProposal = useCallback((reason?: string) => {
    const focus = targetRole || (matches.length > 0 ? matches[0].role : ROLES_CATALOG[0]);
    const freshMatches = rankCareerRoles(
      ROLES_CATALOG,
      profile.skills,
      profile.interests,
      undefined,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations
    );
    const proposedRoadmap = generateLearningRoadmap(
      focus,
      profile.skills,
      scenario,
      new Set(completedMilestoneIds)
    );
    const newProposal: RecommendationProposal = {
      id: `prop-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reason: reason || "Scenario parameters or external workforce demand observations updated.",
      beforeMatches: matches,
      afterMatches: freshMatches,
      proposedRoadmap,
      status: "Pending Review",
    };
    setRecommendationHistory((prev) => [newProposal, ...prev]);
  }, [targetRole, matches, profile.skills, profile.interests, scenario, simulationBoost, researchSignals, workforceObservations, completedMilestoneIds]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev);
  }, []);

  const resetWorkspace = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
    setScenarioState("moderate");
    setSimulationBoostState(0);
    setResearchSignals(FALLBACK_RESEARCH_SIGNALS);
    setWorkforceObservations(INITIAL_WORKFORCE_OBSERVATIONS);
    setCompletedMilestoneIds([]);
    setSavedRoadmap([]);
    setRecommendationHistory([]);
  }, []);

  const loadSyntheticPreset = useCallback((presetId: string) => {
    const sample = SAMPLE_CVS.find((s) => s.id === presetId);
    if (!sample) return;

    const newProfile: UserProfile = {
      name: sample.name,
      occupation: sample.occupation,
      industry: sample.industry,
      education: sample.education,
      experience: sample.experience,
      weeklyHours: 12,
      budget: 0,
      language: "English",
      professionalSummary: sample.professionalSummary,
      experienceSummary: sample.experienceSummary,
      skills: { ...sample.skills },
      interests: [...sample.interests],
      additionalSkills: [...sample.additionalSkills],
      updatedAt: new Date().toISOString(),
    };

    setProfile(newProfile);

    // Auto-calculate fresh initial roadmap for top match
    const freshMatches = rankCareerRoles(
      ROLES_CATALOG,
      newProfile.skills,
      newProfile.interests,
      undefined,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations
    );
    const topRole = freshMatches[0]?.role ?? ROLES_CATALOG[0];
    newProfile.targetRoleId = topRole.id;
    const initialRoadmap = generateLearningRoadmap(
      topRole,
      newProfile.skills,
      scenario,
      new Set()
    );
    setSavedRoadmap(initialRoadmap);
  }, [scenario, simulationBoost, researchSignals, workforceObservations]);

  const value = useMemo<WorkspaceContextType>(
    () => ({
      profile,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations,
      completedMilestoneIds,
      roadmap: activeRoadmap,
      recommendationHistory,
      theme,
      reducedMotion,
      isHydrated,
      isProfileInitialized,
      matches,
      targetRole,
      topMatch,
      pendingProposal,
      updateProfile,
      setSkillLevel,
      addInterest,
      removeInterest,
      setTargetRole,
      setScenario,
      setSimulationBoost,
      toggleMilestone,
      regenerateRoadmap,
      setResearchSignals,
      importWorkforceObservations,
      resetWorkforceObservations,
      approveProposal,
      rejectProposal,
      stageReplanningProposal,
      toggleTheme,
      toggleReducedMotion,
      resetWorkspace,
      loadSyntheticPreset,
    }),
    [
      profile,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations,
      completedMilestoneIds,
      activeRoadmap,
      recommendationHistory,
      theme,
      reducedMotion,
      isHydrated,
      isProfileInitialized,
      matches,
      targetRole,
      topMatch,
      pendingProposal,
      updateProfile,
      setSkillLevel,
      addInterest,
      removeInterest,
      setTargetRole,
      setScenario,
      setSimulationBoost,
      toggleMilestone,
      regenerateRoadmap,
      setResearchSignals,
      importWorkforceObservations,
      resetWorkforceObservations,
      approveProposal,
      rejectProposal,
      toggleTheme,
      toggleReducedMotion,
      resetWorkspace,
      loadSyntheticPreset,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
