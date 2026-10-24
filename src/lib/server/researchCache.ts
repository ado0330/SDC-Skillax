import { ResearchSignal } from "../domain/types";

let cachedSignals: ResearchSignal[] = [];
let lastSuccessAt: string | null = null;
let lastAttemptAt: string | null = null;

export function readResearchCache() {
  return { signals: cachedSignals, lastSuccessAt, lastAttemptAt };
}

export function writeResearchCache(signals: ResearchSignal[], successAt: string) {
  cachedSignals = signals;
  lastSuccessAt = successAt;
}

export function markResearchAttempt(attemptAt: string) {
  lastAttemptAt = attemptAt;
}

export function resetResearchCacheForTests() {
  cachedSignals = [];
  lastSuccessAt = null;
  lastAttemptAt = null;
}
