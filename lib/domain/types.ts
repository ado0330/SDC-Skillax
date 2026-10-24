export type SkillCategory = "Transferable" | "Digital" | "Technical";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  sdgs: number[];
  description?: string;
}

export interface RoleRequirement {
  skillId: string;
  level: number; // 1 to 5
}

export interface Role {
  id: string;
  name: string;
  industry: string;
  description: string;
  requirements: RoleRequirement[];
  sdgs: number[];
  sdgRationale: string;
  sourceUrl: string;
  exposure: number; // 0 to 100 automation exposure
}

export interface SDG {
  id: number;
  name: string;
  shortName: string;
  color: string;
  textColor: string; // WCAG contrast calculated: "#ffffff" or "#000000"
  description: string;
}

export interface LearningResource {
  id: string;
  skillId: string;
  title: string;
  provider: string;
  url: string;
  hours: number;
  level: number;
  objective: string;
  prerequisites?: string;
}

export interface Milestone {
  id: string;
  roleId: string;
  skillId: string;
  title: string;
  phase: 1 | 2 | 3 | 4;
  hours: number;
  provider: string;
  url: string;
  completed: boolean;
  objective: string;
  prerequisites: string;
}

export interface ResearchSignal {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  retrievedAt: string;
  mode: "live" | "cached" | "synthetic";
  observation: string;
  skillIds: string[];
  direction: "Research activity";
}

export interface WorkforceObservation {
  id: string;
  sourceId: string;
  sourceName: string;
  provider: string;
  sourceUrl?: string;
  publishedAt: string;
  periodStart: string;
  periodEnd: string;
  skillId: string;
  skillName: string;
  roleId?: string;
  industry: string;
  geography: string;
  measurementType: string;
  value: number;
  unit: string;
  evidenceType: string;
  datasetVersion: string;
  synthetic: boolean;
  definition: string;
  method: string;
  limitations?: string;
  importedAt: string;
}

export interface SyntheticWorker {
  id: string;
  name: string;
  title: string;
  department: string;
  experience: number;
  skills: Record<string, number>;
  education: string;
  bio: string;
}

export interface UserProfile {
  name: string;
  occupation: string;
  industry: string;
  education: string;
  experience: number;
  weeklyHours: number;
  budget: number;
  language: string;
  professionalSummary: string;
  experienceSummary: string;
  skills: Record<string, number>; // skillId -> level (1-5)
  interests: string[];
  additionalSkills: { name: string; level: number }[];
  targetRoleId?: string;
  updatedAt: string;
}

export type AIScenario = "slower" | "moderate" | "rapid";

export interface ComponentScores {
  skillsScore: number;
  transferableScore: number;
  interestScore: number;
  marketScore: number;
  workforceScore: number | null;
  baselineScore: number;
  overallMatch: number;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  category: SkillCategory;
}

export interface CareerMatch {
  role: Role;
  rank: number;
  overallScore: number;
  components: ComponentScores;
  gaps: SkillGap[];
  missingCount: number;
  estimatedHours: number;
  auditExplanation: string;
  isTarget: boolean;
}
