import { ResearchSignal } from "./types";
import { ResearchSignalSchema } from "../schemas/evidence";

const SKILL_TERMS: Record<string, RegExp> = {
  ai: /\b(ai|artificial intelligence|generative ai|llm|large language model|gpt)\b/i,
  python: /\b(python|pandas|numpy)\b/i,
  ml: /\b(machine learning|deep learning|neural network)\b/i,
  cloud: /\b(cloud|aws|azure|gcp|kubernetes)\b/i,
  sql: /\b(sql|database|relational database)\b/i,
  analysis: /\b(data analysis|data analytics|statistical analysis)\b/i,
  automation: /\b(automation|automated workflow|robotics|orchestration)\b/i,
  iot: /\b(iot|internet of things|sensor|microcontroller|embedded system)\b/i,
  security: /\b(security|cybersecurity|privacy|cryptograph|vulnerability)\b/i,
  ethics: /\b(ethic|fairness|bias|governance|responsible ai)\b/i,
  sustainability: /\b(climate|sustainab|renewable energy|carbon)\b/i,
  agriculture: /\b(agriculture|crop|farming)\b/i,
  maintenance: /\b(maintenance|industrial fault|predictive maintenance)\b/i,
  design: /\b(user research|human-centered design|usability)\b/i,
  teaching: /\b(education|training|facilitation)\b/i,
  communication: /\b(communication|language|speech)\b/i,
};

export function mapSkillsFromEvidence(title: string, summary: string): string[] {
  const text = `${title} ${summary}`;
  return Object.entries(SKILL_TERMS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([id]) => id);
}

/** Returns external research items that overlap a role's catalogued skills.
 * This is contextual evidence only; callers must not feed it into career scores.
 */
export function findResearchSignalsForSkills(skillIds: string[], signals: ResearchSignal[]): ResearchSignal[] {
  const relevantSkills = new Set(skillIds);
  return signals
    .filter((signal) => signal.evidenceType === "external" && /^https?:\/\//i.test(signal.sourceUrl))
    .map((signal) => ({
      signal,
      overlap: signal.skillIds.filter((skillId) => relevantSkills.has(skillId)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || (Date.parse(b.signal.publishedAt ?? "") || 0) - (Date.parse(a.signal.publishedAt ?? "") || 0))
    .map(({ signal }) => signal);
}

function decodeXml(value: string): string {
  const decodeCodePoint = (value: string, radix: number) => {
    const codePoint = parseInt(value, radix);
    return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
      ? String.fromCodePoint(codePoint)
      : "�";
  };
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => decodeCodePoint(code, 16))
    .replace(/&#(\d+);/g, (_, code: string) => decodeCodePoint(code, 10))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function xmlValue(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXml(match[1]) : null;
}

export function parseRssFeed(xml: string, source: string, retrievedAt: string): ResearchSignal[] {
  const entries = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)];
  const signals: ResearchSignal[] = [];
  for (const [, , block] of entries) {
    const title = xmlValue(block, "title");
    const linkTag = block.match(/<link\b([^>]*?)(?:\/>|>([\s\S]*?)<\/link>)/i);
    const href = linkTag?.[1].match(/\bhref=["']([^"']+)["']/i)?.[1];
    const sourceUrl = href || (linkTag?.[2] ? decodeXml(linkTag[2]) : null);
    const summary = xmlValue(block, "description") || xmlValue(block, "summary") || xmlValue(block, "content") || "";
    const dateText = xmlValue(block, "pubDate") || xmlValue(block, "published") || xmlValue(block, "updated");
    const dateValue = dateText ? Date.parse(dateText) : Number.NaN;
    if (!title || !sourceUrl || !/^https?:\/\//i.test(sourceUrl)) continue;
    let hash = 2166136261;
    for (const char of sourceUrl) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    signals.push({
      id: `rss-${(hash >>> 0).toString(16)}`, title, source, sourceUrl: sourceUrl.trim(),
      publishedAt: Number.isFinite(dateValue) ? new Date(dateValue).toISOString() : null,
      retrievedAt,
      mode: "live",
      observation: summary
        ? summary.slice(0, 360)
        : "This RSS feed provides a headline and source link without an excerpt.",
      skillIds: mapSkillsFromEvidence(title, summary), direction: "Research activity",
      trendDirection: "uncertain", evidenceType: "external",
      limitations: "Research coverage is not evidence of job demand, wages, or employment growth. Skill tags are deterministic text matches; trend direction remains uncertain.",
    });
  }
  return deduplicateSignals(signals);
}

export function normalizeSignal(signal: ResearchSignal): ResearchSignal | null {
  const parsed = ResearchSignalSchema.safeParse(signal);
  return parsed.success ? parsed.data : null;
}

export function deduplicateSignals(signals: ResearchSignal[]): ResearchSignal[] {
  const unique = new Map<string, ResearchSignal>();
  for (const signal of signals) {
    const normalized = normalizeSignal(signal);
    if (!normalized) continue;
    const key = normalized.sourceUrl.trim().replace(/#.*$/, "").replace(/\/$/, "").toLowerCase();
    if (!unique.has(key)) unique.set(key, normalized);
  }
  return [...unique.values()];
}

export function isSignalSetStale(retrievedAt: string | null, now = Date.now(), maxAgeMs = 6 * 60 * 60 * 1000): boolean {
  if (!retrievedAt) return true;
  const timestamp = Date.parse(retrievedAt);
  return !Number.isFinite(timestamp) || now - timestamp > maxAgeMs;
}
