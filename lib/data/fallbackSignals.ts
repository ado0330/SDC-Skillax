import { ResearchSignal } from "../domain/types";

// No synthetic items are presented as source-backed publications. When both
// public feeds fail and no server cache exists, the Radar shows an empty state.
export const FALLBACK_RESEARCH_SIGNALS: ResearchSignal[] = [];
