import { AIScenario, Role, RoleRequirement } from "./types";

/**
 * Adjusts catalogued role requirements based on the active AI adoption scenario.
 * - Slower: AI literacy requirement is reduced by 1 level (min 1).
 * - Moderate: Baseline requirements unchanged.
 * - Rapid: AI literacy is increased by 1 (max 5), or injected at Level 3 if missing.
 */
export function adjustRoleRequirements(role: Role, scenario: AIScenario): RoleRequirement[] {
  if (scenario === "moderate") {
    return [...role.requirements];
  }

  const requirements = role.requirements.map((r) => ({ ...r }));
  const aiIndex = requirements.findIndex((r) => r.skillId === "ai");

  if (scenario === "slower") {
    if (aiIndex >= 0) {
      requirements[aiIndex] = {
        ...requirements[aiIndex],
        level: Math.max(1, requirements[aiIndex].level - 1),
      };
    }
    return requirements;
  }

  if (scenario === "rapid") {
    if (aiIndex >= 0) {
      requirements[aiIndex] = {
        ...requirements[aiIndex],
        level: Math.min(5, requirements[aiIndex].level + 1),
      };
    } else {
      // Inject AI literacy requirement at level 3
      requirements.push({ skillId: "ai", level: 3 });
    }
    return requirements;
  }

  return requirements;
}

/**
 * Calculates scenario adjustment to marketScore.
 */
export function calculateScenarioEffect(
  scenario: AIScenario,
  technicalShare: number,
  roleExposure: number
): number {
  if (scenario === "rapid") {
    return technicalShare * 20 - roleExposure * 0.1;
  }
  if (scenario === "slower") {
    return -technicalShare * 10 + roleExposure * 0.05;
  }
  return 0;
}
