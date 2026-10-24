import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { ROLES_CATALOG, ROLES_BY_ID } from "../src/lib/data/roles";
import { FALLBACK_RESEARCH_SIGNALS } from "../src/lib/data/fallbackSignals";
import { INITIAL_WORKFORCE_OBSERVATIONS } from "../src/lib/data/initialWorkforce";
import { scoreCareerRole, rankCareerRoles } from "../src/lib/domain/scoring";
import { adjustRoleRequirements, calculateScenarioEffect } from "../src/lib/domain/scenarios";
import { calculateSkillGaps } from "../src/lib/domain/gaps";
import { generateLearningRoadmap } from "../src/lib/domain/roadmap";
import {
  classifyPeriod,
  analyzeWorkforceSeries,
  findEligibleWorkforceSeriesForRole,
} from "../src/lib/domain/workforce";
import { WorkforceObservation } from "../src/lib/domain/types";

describe("Domain Intelligence Tests — SKILLAX AI", () => {
  const sampleProfileSkills = {
    excel: 4,
    analysis: 3,
    sql: 3,
    communication: 4,
    organization: 4,
    python: 2,
    ai: 1,
  };

  const sampleInterests = ["Business & Services", "Data Analytics"];

  test("Deterministic Repeatability: identical inputs yield identical rankings", () => {
    const run1 = rankCareerRoles(
      ROLES_CATALOG,
      sampleProfileSkills,
      sampleInterests,
      undefined,
      "moderate",
      0,
      FALLBACK_RESEARCH_SIGNALS,
      INITIAL_WORKFORCE_OBSERVATIONS
    );

    const run2 = rankCareerRoles(
      ROLES_CATALOG,
      sampleProfileSkills,
      sampleInterests,
      undefined,
      "moderate",
      0,
      FALLBACK_RESEARCH_SIGNALS,
      INITIAL_WORKFORCE_OBSERVATIONS
    );

    assert.equal(run1.length, 10);
    assert.equal(run2.length, 10);

    for (let i = 0; i < 10; i++) {
      assert.equal(run1[i].role.id, run2[i].role.id);
      assert.equal(run1[i].overallScore, run2[i].overallScore);
      assert.equal(run1[i].rank, run2[i].rank);
      assert.equal(run1[i].components.skillsScore, run2[i].components.skillsScore);
    }
  });

  test("Scenario Adjustments: Slower vs Moderate vs Rapid on AI literacy", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;
    assert.ok(role);

    // Baseline requires excel 4, analysis 4, sql 3, communication 4, ai 3
    const modReqs = adjustRoleRequirements(role, "moderate");
    const aiMod = modReqs.find((r) => r.skillId === "ai");
    assert.equal(aiMod?.level, 3);

    const slowReqs = adjustRoleRequirements(role, "slower");
    const aiSlow = slowReqs.find((r) => r.skillId === "ai");
    assert.equal(aiSlow?.level, 2, "Slower scenario should reduce AI literacy requirement by 1");

    const rapidReqs = adjustRoleRequirements(role, "rapid");
    const aiRapid = rapidReqs.find((r) => r.skillId === "ai");
    assert.equal(aiRapid?.level, 4, "Rapid scenario should increase AI literacy requirement by 1");

    // Test role without AI literacy: Precision Agriculture (agriculture 4, iot 3, analysis 3, sustainability 3)
    const agriRole = ROLES_BY_ID.get("agriculture-specialist")!;
    assert.ok(agriRole);
    assert.equal(agriRole.requirements.some((r) => r.skillId === "ai"), false);

    const rapidAgri = adjustRoleRequirements(agriRole, "rapid");
    const aiInjected = rapidAgri.find((r) => r.skillId === "ai");
    assert.ok(aiInjected, "Rapid scenario should inject AI literacy into role lacking it");
    assert.equal(aiInjected.level, 3, "Injected AI literacy should be Level 3");
  });

  test("Moderate and Rapid comparisons reuse the same profile and produce reproducible scenario-only changes", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;
    const moderateA = scoreCareerRole(role, sampleProfileSkills, sampleInterests, "moderate", 0, [], []);
    const moderateB = scoreCareerRole(role, sampleProfileSkills, sampleInterests, "moderate", 0, [], []);
    const rapid = scoreCareerRole(role, sampleProfileSkills, sampleInterests, "rapid", 0, [], []);

    assert.deepEqual(moderateA, moderateB);
    assert.equal(rapid.components.interestScore, moderateA.components.interestScore);
    assert.equal(rapid.components.transferableScore, moderateA.components.transferableScore);
    assert.notEqual(rapid.components.marketScore, moderateA.components.marketScore);
    assert.notEqual(rapid.components.skillsScore, moderateA.components.skillsScore);
    assert.match(rapid.auditExplanation, /Scenario Market Index/);
  });

  test("Mathematical 4-Component Baseline & 5-Component Workforce Integration", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;
    assert.ok(role);

    // 1. Without workforce data -> baselineScore equals overallMatch
    const resultWithoutWf = scoreCareerRole(
      role,
      sampleProfileSkills,
      sampleInterests,
      "moderate",
      0,
      FALLBACK_RESEARCH_SIGNALS,
      []
    );

    assert.equal(resultWithoutWf.components.workforceScore, null);
    assert.equal(
      resultWithoutWf.components.overallMatch,
      resultWithoutWf.components.baselineScore
    );
    assert.ok(resultWithoutWf.components.baselineScore >= 0 && resultWithoutWf.components.baselineScore <= 100);

    // 2. With workforce observations containing matching series for business-analyst
    const resultWithWf = scoreCareerRole(
      role,
      sampleProfileSkills,
      sampleInterests,
      "moderate",
      0,
      FALLBACK_RESEARCH_SIGNALS,
      INITIAL_WORKFORCE_OBSERVATIONS
    );

    assert.ok(resultWithWf.components.workforceScore !== null);
    const expectedMatch = Math.round(
      resultWithWf.components.baselineScore * 0.9 +
        resultWithWf.components.workforceScore * 0.1
    );
    assert.equal(resultWithWf.components.overallMatch, expectedMatch);
  });

  test("Simulation Boost Slider modifies marketScore bidirectionally", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;
    assert.ok(role);

    const normal = scoreCareerRole(role, sampleProfileSkills, sampleInterests, "moderate", 0, FALLBACK_RESEARCH_SIGNALS, []);
    const boosted = scoreCareerRole(role, sampleProfileSkills, sampleInterests, "moderate", 50, FALLBACK_RESEARCH_SIGNALS, []);
    const reduced = scoreCareerRole(role, sampleProfileSkills, sampleInterests, "moderate", -50, FALLBACK_RESEARCH_SIGNALS, []);

    assert.ok(
      boosted.components.marketScore > normal.components.marketScore,
      "Positive boost should increase research market score"
    );
    assert.ok(
      reduced.components.marketScore < normal.components.marketScore,
      "Negative boost should decrease research market score"
    );
  });

  test("Skill Gaps calculation correctly maps current, required, and shortfall", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;
    const gaps = calculateSkillGaps(sampleProfileSkills, role.requirements);

    // Sample profile: excel: 4, analysis: 3, sql: 3, communication: 4, ai: 1
    // Role requirements: excel: 4, analysis: 4, sql: 3, communication: 4, ai: 3
    const excelGap = gaps.find((g) => g.skillId === "excel");
    assert.equal(excelGap?.gap, 0, "Excel requirement level 4 met with profile level 4");

    const analysisGap = gaps.find((g) => g.skillId === "analysis");
    assert.equal(analysisGap?.gap, 1, "Analysis profile 3 vs required 4 has gap 1");

    const aiGap = gaps.find((g) => g.skillId === "ai");
    assert.equal(aiGap?.gap, 2, "AI profile 1 vs required 3 has gap 2");
  });

  test("Roadmap Generation: Phase 1 & 2 gap splitting, fixed Phase 3 & 4, and completion preservation", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;

    // Profile has AI at level 1 (gap -> Phase 1 since current < 2)
    // Profile has analysis at level 3 (gap -> Phase 2 since current >= 2)
    const existingCompleted = new Set([`${role.id}-ai`]);

    const roadmap = generateLearningRoadmap(
      role,
      sampleProfileSkills,
      "moderate",
      existingCompleted
    );

    assert.ok(roadmap.length >= 4, "Roadmap should have gap milestones plus Phase 3 and Phase 4");

    const aiMilestone = roadmap.find((m) => m.skillId === "ai");
    assert.ok(aiMilestone);
    assert.equal(aiMilestone.phase, 1, "Level 1 skill gap must be Phase 1 (Foundational)");
    assert.equal(aiMilestone.completed, true, "Existing completed milestone must remain completed upon regeneration");

    const analysisMilestone = roadmap.find((m) => m.skillId === "analysis");
    assert.ok(analysisMilestone);
    assert.equal(analysisMilestone.phase, 2, "Level 3 skill gap must be Phase 2 (Applied)");

    const p3 = roadmap.find((m) => m.phase === 3);
    assert.ok(p3);
    assert.equal(p3.hours, 10, "Phase 3 Capstone must be 10 hours");

    const p4 = roadmap.find((m) => m.phase === 4);
    assert.ok(p4);
    assert.equal(p4.hours, 6, "Phase 4 Portfolio must be 6 hours");
  });

  test("Workforce Comparability & Trend Analysis", () => {
    // 1. Period classification
    assert.equal(classifyPeriod("2026-01-01", "2026-03-31"), "quarterly");
    assert.equal(classifyPeriod("2025-01-01", "2025-12-31"), "annual");
    assert.equal(classifyPeriod("2026-02-01", "2026-02-28"), "monthly");
    assert.equal(classifyPeriod("2026-03-01", "2026-03-01"), "daily");

    // 2. Overlapping observations reject comparability
    const overlappingObs: WorkforceObservation[] = [
      {
        ...INITIAL_WORKFORCE_OBSERVATIONS[0],
        periodStart: "2025-10-01",
        periodEnd: "2026-01-15", // overlaps next period
      },
      {
        ...INITIAL_WORKFORCE_OBSERVATIONS[1],
        periodStart: "2026-01-01",
        periodEnd: "2026-03-31",
      },
    ];

    const analyzedOverlap = analyzeWorkforceSeries(overlappingObs);
    assert.equal(analyzedOverlap[0].isComparable, false);
    assert.equal(analyzedOverlap[0].direction, "Insufficient Data");

    // 3. Valid comparable series: 80 -> 90 = +12.5% ("Rising")
    const analyzedValid = analyzeWorkforceSeries(INITIAL_WORKFORCE_OBSERVATIONS.slice(0, 2));
    assert.equal(analyzedValid[0].isComparable, true);
    assert.equal(analyzedValid[0].direction, "Rising");
    assert.equal(analyzedValid[0].percentageChange, 12.5);
  });

  test("CV Extraction: Deterministic keyword parsing and schema compliance", async () => {
    const { extractSkillsByKeywords } = await import("../src/lib/ai/keywordExtractor");
    const { CvExtractionOutputSchema } = await import("../src/lib/schemas/cv");

    const sampleCvText = `
    Aina binti Abdullah
    Operations Coordinator with 7 years of experience.
    Proficient in Microsoft Excel pivot tables, agile project coordination, sprint delivery, and data analysis.
    `;

    const extracted = extractSkillsByKeywords(sampleCvText);
    assert.ok(extracted.skills["excel"] >= 2, "Excel keyword should be extracted");
    assert.ok(extracted.skills["organization"] >= 2, "Project coordination should be extracted");
    assert.ok(extracted.skills["analysis"] >= 2, "Data analysis should be extracted");
    assert.equal(extracted.experience, 7, "Should extract 7 years experience");

    // Verify Zod schema compliance
    const validated = CvExtractionOutputSchema.parse(extracted);
    assert.equal(validated.extractionMethod, "keyword_fallback");
  });
});

