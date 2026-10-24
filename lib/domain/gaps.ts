import { RoleRequirement, SkillGap } from "./types";
import { SKILLS_BY_ID } from "../data/skills";

/**
 * Calculates skill gaps between profile skill levels and role requirements.
 */
export function calculateSkillGaps(
  profileSkills: Record<string, number>,
  requirements: RoleRequirement[]
): SkillGap[] {
  return requirements.map((req) => {
    const currentLevel = profileSkills[req.skillId] ?? 0;
    const requiredLevel = req.level;
    const gap = Math.max(0, requiredLevel - currentLevel);
    const skillMeta = SKILLS_BY_ID.get(req.skillId);

    return {
      skillId: req.skillId,
      skillName: skillMeta?.name ?? req.skillId,
      currentLevel,
      requiredLevel,
      gap,
      category: skillMeta?.category ?? "Technical",
    };
  });
}
