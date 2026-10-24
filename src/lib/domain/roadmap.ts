import { AIScenario, Milestone, Role, RoleRequirement } from "./types";
import { adjustRoleRequirements } from "./scenarios";
import { LEARNING_RESOURCES_BY_SKILL } from "../data/learningResources";
import { SKILLS_BY_ID } from "../data/skills";

const TECH_ACCELERATED_SKILLS = new Set(["ai", "ml", "automation", "python"]);

/**
 * Generates an ordered 4-phase learning roadmap for a target career role.
 * Preserves completed milestone flags from existing progress.
 */
export function generateLearningRoadmap(
  role: Role,
  profileSkills: Record<string, number>,
  scenario: AIScenario = "moderate",
  existingCompletedIds: Set<string> = new Set()
): Milestone[] {
  const requirements = adjustRoleRequirements(role, scenario);
  const milestones: Milestone[] = [];

  // Filter for unmet requirements (gaps)
  const gaps = requirements.filter((req) => {
    const current = profileSkills[req.skillId] ?? 0;
    return current < req.level;
  });

  // Assign Phase 1 (Foundational: current < 2) vs Phase 2 (Applied: current >= 2)
  for (const req of gaps) {
    const current = profileSkills[req.skillId] ?? 0;
    const required = req.level;
    const phase: 1 | 2 = current < 2 ? 1 : 2;
    const resource = LEARNING_RESOURCES_BY_SKILL.get(req.skillId);
    const skillMeta = SKILLS_BY_ID.get(req.skillId);

    const baseHours = resource?.hours ?? 20;
    const hours = Math.max(2, Math.ceil(baseHours * (1 - current / required)));

    const milestoneId = `${role.id}-${req.skillId}`;
    const isCompleted = existingCompletedIds.has(milestoneId);

    milestones.push({
      id: milestoneId,
      roleId: role.id,
      skillId: req.skillId,
      title: resource?.title ?? `Mastering ${skillMeta?.name ?? req.skillId}`,
      phase,
      hours,
      provider: resource?.provider ?? "Open Online Learning Hub",
      url: resource?.url ?? "https://www.coursera.org",
      completed: isCompleted,
      objective:
        resource?.objective ??
        `Bridge proficiency shortfall from level ${current} to target level ${required}.`,
      prerequisites:
        current === 0
          ? "No prerequisites; beginner level introductory module."
          : `Current foundation: Level ${current}/5. Ready for applied exercises.`,
    });
  }

  // Sort Phase 1 and Phase 2 items:
  // 1. By phase ascending (1 then 2)
  // 2. Scenario prioritization
  milestones.sort((a, b) => {
    if (a.phase !== b.phase) {
      return a.phase - b.phase;
    }

    if (scenario === "rapid") {
      const aTech = TECH_ACCELERATED_SKILLS.has(a.skillId) ? 1 : 0;
      const bTech = TECH_ACCELERATED_SKILLS.has(b.skillId) ? 1 : 0;
      if (aTech !== bTech) return bTech - aTech; // tech first
    } else if (scenario === "slower") {
      const aTech = TECH_ACCELERATED_SKILLS.has(a.skillId) ? 1 : 0;
      const bTech = TECH_ACCELERATED_SKILLS.has(b.skillId) ? 1 : 0;
      if (aTech !== bTech) return aTech - bTech; // non-tech first
    }

    return b.hours - a.hours; // larger gaps first
  });

  // Phase 3: Applied Capstone Project (Fixed 10 hours)
  const capstoneId = `${role.id}-capstone-p3`;
  milestones.push({
    id: capstoneId,
    roleId: role.id,
    skillId: "capstone",
    title: `${role.name} End-to-End Capstone Project`,
    phase: 3,
    hours: 10,
    provider: "SKILLAX Guided Practice Lab",
    url: role.sourceUrl,
    completed: existingCompletedIds.has(capstoneId),
    objective: `Synthesize acquired capabilities into a realistic ${role.industry} portfolio deliverable aligned with O*NET performance standards.`,
    prerequisites: "Completion of Phase 1 and Phase 2 prerequisite coursework.",
  });

  // Phase 4: Career Transition & Portfolio Readiness (Fixed 6 hours)
  const portfolioId = `${role.id}-portfolio-p4`;
  milestones.push({
    id: portfolioId,
    roleId: role.id,
    skillId: "portfolio",
    title: `Professional Transition Portfolio & Case Study Showcase`,
    phase: 4,
    hours: 6,
    provider: "SKILLAX Career Transition Hub",
    url: role.sourceUrl,
    completed: existingCompletedIds.has(portfolioId),
    objective: `Document project repositories, create interactive demonstration walk-throughs, and prepare transition case studies for stakeholder review.`,
    prerequisites: "Completion of the Phase 3 Capstone Project.",
  });

  return milestones;
}
