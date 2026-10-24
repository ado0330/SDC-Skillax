import { WorkforceObservation } from "./types";

export type TrendDirection = "Rising" | "Declining" | "Stable" | "Insufficient Data";

export interface AnalyzedWorkforceSeries {
  seriesKey: string;
  sourceId: string;
  sourceName: string;
  skillId: string;
  roleId?: string;
  industry: string;
  geography: string;
  measurementType: string;
  unit: string;
  periodClass: string;
  synthetic: boolean;
  observations: WorkforceObservation[];
  previousValue: number | null;
  latestValue: number | null;
  previousPeriodEnd: string | null;
  latestPeriodEnd: string | null;
  percentageChange: number | null;
  direction: TrendDirection;
  isComparable: boolean;
  comparabilityReason: string;
}

/**
 * Classifies date duration into period classes: annual, quarterly, monthly, daily, or custom.
 */
export function classifyPeriod(periodStart: string, periodEnd: string): string {
  if (periodStart === periodEnd) {
    return "daily";
  }

  const start = new Date(periodStart);
  const end = new Date(periodEnd);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "custom";
  }

  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays >= 350 && diffDays <= 370) {
    return "annual";
  }
  if (diffDays >= 85 && diffDays <= 95) {
    return "quarterly";
  }
  if (diffDays >= 27 && diffDays <= 32) {
    return "monthly";
  }

  return "custom";
}

/**
 * Generates the deterministic comparability grouping key for a workforce observation.
 */
export function getSeriesKey(obs: WorkforceObservation): string {
  const pClass = classifyPeriod(obs.periodStart, obs.periodEnd);
  return [
    obs.sourceId,
    obs.skillId,
    obs.roleId ?? "all",
    obs.industry,
    obs.geography,
    obs.measurementType,
    obs.unit,
    obs.definition.trim().toLowerCase(),
    obs.method.trim().toLowerCase(),
    obs.synthetic ? "synth" : "real",
    pClass,
  ].join("::");
}

/**
 * Analyzes an array of workforce observations into comparable grouped series.
 */
export function analyzeWorkforceSeries(
  observations: WorkforceObservation[]
): AnalyzedWorkforceSeries[] {
  const groups = new Map<string, WorkforceObservation[]>();

  for (const obs of observations) {
    const key = getSeriesKey(obs);
    const existing = groups.get(key) ?? [];
    existing.push(obs);
    groups.set(key, existing);
  }

  const results: AnalyzedWorkforceSeries[] = [];

  for (const [key, obsList] of groups.entries()) {
    // Sort chronological by periodEnd ascending
    const sorted = [...obsList].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
    const sample = sorted[0];
    const pClass = classifyPeriod(sample.periodStart, sample.periodEnd);

    if (sorted.length < 2) {
      results.push({
        seriesKey: key,
        sourceId: sample.sourceId,
        sourceName: sample.sourceName,
        skillId: sample.skillId,
        roleId: sample.roleId,
        industry: sample.industry,
        geography: sample.geography,
        measurementType: sample.measurementType,
        unit: sample.unit,
        periodClass: pClass,
        synthetic: sample.synthetic,
        observations: sorted,
        previousValue: null,
        latestValue: sorted[sorted.length - 1].value,
        previousPeriodEnd: null,
        latestPeriodEnd: sorted[sorted.length - 1].periodEnd,
        percentageChange: null,
        direction: "Insufficient Data",
        isComparable: false,
        comparabilityReason: "Series contains fewer than 2 observations.",
      });
      continue;
    }

    const previous = sorted[sorted.length - 2];
    const latest = sorted[sorted.length - 1];

    // Non-overlapping check: previous.periodEnd <= latest.periodStart
    if (previous.periodEnd > latest.periodStart) {
      results.push({
        seriesKey: key,
        sourceId: sample.sourceId,
        sourceName: sample.sourceName,
        skillId: sample.skillId,
        roleId: sample.roleId,
        industry: sample.industry,
        geography: sample.geography,
        measurementType: sample.measurementType,
        unit: sample.unit,
        periodClass: pClass,
        synthetic: sample.synthetic,
        observations: sorted,
        previousValue: previous.value,
        latestValue: latest.value,
        previousPeriodEnd: previous.periodEnd,
        latestPeriodEnd: latest.periodEnd,
        percentageChange: null,
        direction: "Insufficient Data",
        isComparable: false,
        comparabilityReason: "Adjacent observation periods overlap.",
      });
      continue;
    }

    if (previous.value <= 0) {
      results.push({
        seriesKey: key,
        sourceId: sample.sourceId,
        sourceName: sample.sourceName,
        skillId: sample.skillId,
        roleId: sample.roleId,
        industry: sample.industry,
        geography: sample.geography,
        measurementType: sample.measurementType,
        unit: sample.unit,
        periodClass: pClass,
        synthetic: sample.synthetic,
        observations: sorted,
        previousValue: previous.value,
        latestValue: latest.value,
        previousPeriodEnd: previous.periodEnd,
        latestPeriodEnd: latest.periodEnd,
        percentageChange: null,
        direction: "Insufficient Data",
        isComparable: false,
        comparabilityReason: "Base observation value is zero or negative.",
      });
      continue;
    }

    const percentageChange = Number(
      (((latest.value - previous.value) / previous.value) * 100).toFixed(2)
    );

    let direction: TrendDirection = "Stable";
    if (percentageChange > 5.0) {
      direction = "Rising";
    } else if (percentageChange < -5.0) {
      direction = "Declining";
    }

    results.push({
      seriesKey: key,
      sourceId: sample.sourceId,
      sourceName: sample.sourceName,
      skillId: sample.skillId,
      roleId: sample.roleId,
      industry: sample.industry,
      geography: sample.geography,
      measurementType: sample.measurementType,
      unit: sample.unit,
      periodClass: pClass,
      synthetic: sample.synthetic,
      observations: sorted,
      previousValue: previous.value,
      latestValue: latest.value,
      previousPeriodEnd: previous.periodEnd,
      latestPeriodEnd: latest.periodEnd,
      percentageChange,
      direction,
      isComparable: true,
      comparabilityReason: "Strict statistical comparability criteria met.",
    });
  }

  return results;
}

/**
 * Finds the single best eligible workforce series for a given occupation.
 * Evaluates role requirements and industry; breaks ties by latest period, non-synthetic preference, and key.
 */
export function findEligibleWorkforceSeriesForRole(
  roleId: string,
  roleIndustry: string,
  requiredSkillIds: string[],
  seriesList: AnalyzedWorkforceSeries[]
): AnalyzedWorkforceSeries | null {
  const eligible = seriesList.filter(
    (s) =>
      s.isComparable &&
      s.percentageChange !== null &&
      (s.roleId === roleId ||
        requiredSkillIds.includes(s.skillId) ||
        s.industry.toLowerCase() === roleIndustry.toLowerCase())
  );

  if (eligible.length === 0) {
    return null;
  }

  // Priority tie-breaking:
  // 1. Direct roleId match first
  // 2. Latest periodEnd descending
  // 3. Non-synthetic preference (!a.synthetic vs !b.synthetic)
  // 4. Deterministic key sort
  eligible.sort((a, b) => {
    const aDirect = a.roleId === roleId ? 1 : 0;
    const bDirect = b.roleId === roleId ? 1 : 0;
    if (aDirect !== bDirect) return bDirect - aDirect;

    const aEnd = a.latestPeriodEnd ?? "";
    const bEnd = b.latestPeriodEnd ?? "";
    if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);

    if (a.synthetic !== b.synthetic) {
      return a.synthetic ? 1 : -1; // non-synthetic first
    }

    return a.seriesKey.localeCompare(b.seriesKey);
  });

  return eligible[0];
}
