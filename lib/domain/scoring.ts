import {
  AIScenario,
  CareerMatch,
  ComponentScores,
  ResearchSignal,
  Role,
  WorkforceObservation,
} from "./types";
import { adjustRoleRequirements, calculateScenarioEffect } from "./scenarios";
import { calculateSkillGaps } from "./gaps";
import {
  analyzeWorkforceSeries,
  findEligibleWorkforceSeriesForRole,
} from "./workforce";
import { LEARNING_RESOURCES_BY_SKILL } from "../data/learningResources";

const TRANSFERABLE_SKILLS = new Set([
  "communication",
  "organization",
  "ethics",
  "design",
  "teaching",
]);

const TECHNICAL_SKILLS = new Set([
  "ai",
  "ml",
  "automation",
  "iot",
  "cloud",
  "security",
  "python",
]);

function clamp(min: number, max: number, value: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculates deterministic career match scores for a single role.
 */
export function scoreCareerRole(
  role: Role,
  profileSkills: Record<string, number>,
  interests: string[],
  scenario: AIScenario = "moderate",
  simulationBoost: number = 0,
  researchSignals: ResearchSignal[] = [],
  workforceObservations: WorkforceObservation[] = []
): {
  components: ComponentScores;
  estimatedHours: number;
  auditExplanation: string;
} {
  // 1. Adjust role requirements for active AI adoption scenario
  const requirements = adjustRoleRequirements(role, scenario);

  if (requirements.length === 0) {
    return {
      components: {
        skillsScore: 0,
        transferableScore: 0,
        interestScore: 25,
        marketScore: 40,
        workforceScore: null,
        baselineScore: 10,
        overallMatch: 10,
      },
      estimatedHours: 16,
      auditExplanation: "No requirements catalogued for this occupation.",
    };
  }

  // 2. Direct Skills Alignment (skillsScore - 50% weight)
  let skillsSum = 0;
  for (const req of requirements) {
    const userLevel = profileSkills[req.skillId] ?? 0;
    skillsSum += Math.min(userLevel / req.level, 1.0);
  }
  const skillsScore = Number(((100 * skillsSum) / requirements.length).toFixed(1));

  // 3. Transferable Skills Alignment (transferableScore - 20% weight)
  const transferableReqs = requirements.filter((r) =>
    TRANSFERABLE_SKILLS.has(r.skillId)
  );
  let transferableScore: number;
  if (transferableReqs.length > 0) {
    let transSum = 0;
    for (const req of transferableReqs) {
      const userLevel = profileSkills[req.skillId] ?? 0;
      transSum += Math.min(userLevel / req.level, 1.0);
    }
    transferableScore = Number(
      ((100 * transSum) / transferableReqs.length).toFixed(1)
    );
  } else {
    const commLevel = profileSkills["communication"] ?? 0;
    transferableScore = Number(
      Math.min(100, 100 * (commLevel / 5)).toFixed(1)
    );
  }

  // 4. Sectoral & Role Interest Alignment (interestScore - 15% weight)
  const trimmedInterests = interests
    .map((i) => i.trim().toLowerCase())
    .filter(Boolean);
  let interestMatch = false;
  const roleIndustry = role.industry.toLowerCase();
  const roleTitle = role.name.toLowerCase();

  for (const tag of trimmedInterests) {
    if (roleIndustry.includes(tag) || tag.includes(roleIndustry) || roleTitle.includes(tag)) {
      interestMatch = true;
      break;
    }
  }
  const interestScore = interestMatch ? 100 : 25;

  // 5. Research Market Activity Index (marketScore - 15% weight)
  let evidenceSum = 0;
  for (const req of requirements) {
    const matchingSignals = researchSignals.filter((sig) =>
      sig.skillIds.includes(req.skillId)
    );
    evidenceSum += Math.min(5, matchingSignals.length);
  }
  const evidence = evidenceSum / requirements.length;

  const technicalReqCount = requirements.filter((r) =>
    TECHNICAL_SKILLS.has(r.skillId)
  ).length;
  const technicalShare = technicalReqCount / requirements.length;

  const scenarioEffect = calculateScenarioEffect(
    scenario,
    technicalShare,
    role.exposure
  );
  const simulationAdjustment = simulationBoost * technicalShare * 0.4;

  const rawMarket =
    40 + evidence * 8 + scenarioEffect + simulationAdjustment;
  const marketScore = Number(clamp(0, 100, rawMarket).toFixed(1));

  // 6. Baseline Score (weighted sum of 4 core components)
  const baselineScore = Math.round(
    0.5 * skillsScore +
      0.2 * transferableScore +
      0.15 * interestScore +
      0.15 * marketScore
  );

  // 7. Optional Workforce Demand Indicator (workforceScore - 10% weight)
  let workforceScore: number | null = null;
  let overallMatch = baselineScore;

  if (workforceObservations.length > 0) {
    const seriesList = analyzeWorkforceSeries(workforceObservations);
    const eligibleSeries = findEligibleWorkforceSeriesForRole(
      role.id,
      role.industry,
      requirements.map((r) => r.skillId),
      seriesList
    );

    if (eligibleSeries && eligibleSeries.percentageChange !== null) {
      const rawWf = 50 + eligibleSeries.percentageChange / 2;
      workforceScore = Math.round(clamp(0, 100, rawWf));
      overallMatch = Math.round(baselineScore * 0.9 + workforceScore * 0.1);
    }
  }

  // 8. Estimated Learning Hours
  // milestone_hours = max(2, ceil(resource.hours * (1 - current / required))) + 16 (for Phase 3 and 4)
  let gapHoursSum = 0;
  for (const req of requirements) {
    const current = profileSkills[req.skillId] ?? 0;
    if (current < req.level) {
      const resource = LEARNING_RESOURCES_BY_SKILL.get(req.skillId);
      const baseHours = resource?.hours ?? 20;
      const hours = Math.max(
        2,
        Math.ceil(baseHours * (1 - current / req.level))
      );
      gapHoursSum += hours;
    }
  }
  const estimatedHours = gapHoursSum + 16;

  // 9. Mathematical Audit Explanation
  const wfExplanation =
    workforceScore !== null
      ? ` + (Workforce Demand: ${workforceScore} × 10% = ${(workforceScore * 0.1).toFixed(1)}) = ${overallMatch}%`
      : ` = ${overallMatch}% (No eligible comparable workforce series detected; baseline scoring applied).`;

  const auditExplanation = `Deterministic Score Decomposition: Direct Skills (${skillsScore} × 50% = ${(skillsScore * 0.5).toFixed(1)}) + Transferable (${transferableScore} × 20% = ${(transferableScore * 0.2).toFixed(1)}) + Interest (${interestScore} × 15% = ${(interestScore * 0.15).toFixed(1)}) + Research Market (${marketScore} × 15% = ${(marketScore * 0.15).toFixed(1)}) -> Baseline: ${baselineScore}%${wfExplanation}`;

  return {
    components: {
      skillsScore,
      transferableScore,
      interestScore,
      marketScore,
      workforceScore,
      baselineScore,
      overallMatch,
    },
    estimatedHours,
    auditExplanation,
  };
}

/**
 * Evaluates and ranks all catalogued roles for a given profile and context.
 */
export function rankCareerRoles(
  roles: Role[],
  profileSkills: Record<string, number>,
  interests: string[],
  targetRoleId?: string,
  scenario: AIScenario = "moderate",
  simulationBoost: number = 0,
  researchSignals: ResearchSignal[] = [],
  workforceObservations: WorkforceObservation[] = []
): CareerMatch[] {
  const matches: CareerMatch[] = roles.map((role) => {
    const adjustedReqs = adjustRoleRequirements(role, scenario);
    const gaps = calculateSkillGaps(profileSkills, adjustedReqs);
    const missingCount = gaps.filter((g) => g.gap > 0).length;

    const { components, estimatedHours, auditExplanation } = scoreCareerRole(
      role,
      profileSkills,
      interests,
      scenario,
      simulationBoost,
      researchSignals,
      workforceObservations
    );

    return {
      role,
      rank: 0,
      overallScore: components.overallMatch,
      components,
      gaps,
      missingCount,
      estimatedHours,
      auditExplanation,
      isTarget: role.id === targetRoleId,
    };
  });

  // Sort descending by overallScore, then by fewer missing skills, then name
  matches.sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    if (a.missingCount !== b.missingCount) {
      return a.missingCount - b.missingCount;
    }
    return a.role.name.localeCompare(b.role.name);
  });

  // Assign 1-indexed ranks
  return matches.map((m, idx) => ({
    ...m,
    rank: idx + 1,
  }));
}
