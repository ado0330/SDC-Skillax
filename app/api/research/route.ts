import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_RESEARCH_SIGNALS } from "@/lib/data/fallbackSignals";
import { ResearchSignal } from "@/lib/domain/types";

// In-memory server cache to avoid hammering RSS feeds (60s TTL)
let cachedSignals: ResearchSignal[] = [];
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000;

function inferSkillIds(title: string, desc: string): string[] {
  const text = (title + " " + desc).toLowerCase();
  const skills = new Set<string>();

  if (text.match(/\b(ai|llm|gpt|agent|artificial intelligence|generative|prompt|model|reasoning)\b/)) {
    skills.add("ai");
  }
  if (text.match(/\b(python|coding|algorithm|scripting|software|developer)\b/)) {
    skills.add("python");
  }
  if (text.match(/\b(machine learning|deep learning|neural|rl|reinforcement|training)\b/)) {
    skills.add("ml");
  }
  if (text.match(/\b(cloud|aws|azure|gcp|distributed|cluster|infrastructure)\b/)) {
    skills.add("cloud");
  }
  if (text.match(/\b(database|sql|query|postgres|relational|data)\b/)) {
    skills.add("sql");
    skills.add("analysis");
  }
  if (text.match(/\b(automation|robotics|workflow|orchestration|agentic)\b/)) {
    skills.add("automation");
  }
  if (text.match(/\b(iot|hardware|sensor|microcontroller|embedded|edge)\b/)) {
    skills.add("iot");
  }
  if (text.match(/\b(security|safety|adversarial|crypt|vulnerability|privacy)\b/)) {
    skills.add("security");
  }
  if (text.match(/\b(ethics|fairness|bias|policy|democracy|governance|human)\b/)) {
    skills.add("ethics");
  }
  if (text.match(/\b(climate|green|sustainable|agriculture|energy)\b/)) {
    skills.add("sustainability");
  }

  // Default to AI if no specific match
  if (skills.size === 0) {
    skills.add("ai");
  }

  return Array.from(skills);
}

function parseRssXml(xml: string, sourceName: string, maxItems: number = 5): ResearchSignal[] {
  const signals: ResearchSignal[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (let i = 0; i < Math.min(itemBlocks.length, maxItems); i++) {
    const item = itemBlocks[i];
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const dateMatch = item.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
    const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
    const link = linkMatch ? linkMatch[1].trim() : "";
    const pubDateStr = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
    const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";

    let isoDate: string;
    try {
      isoDate = new Date(pubDateStr).toISOString();
    } catch {
      isoDate = new Date().toISOString();
    }

    if (title && link) {
      const skillIds = inferSkillIds(title, desc);
      signals.push({
        id: `sig-live-${sourceName.toLowerCase().replace(/[^a-z0-9]/g, "")}-${i + 1}`,
        title,
        source: sourceName,
        sourceUrl: link,
        publishedAt: isoDate,
        retrievedAt: new Date().toISOString(),
        mode: "live",
        observation: desc
          ? desc.slice(0, 220) + (desc.length > 220 ? "..." : "")
          : `Live scientific publication from ${sourceName}. Technical research activity indicator; does not measure job vacancies or labor wages.`,
        skillIds,
        direction: "Research activity",
      });
    }
  }

  return signals;
}

export async function GET(req: NextRequest) {
  const now = Date.now();

  // If cached within TTL, serve immediately
  if (now - lastFetchTime < CACHE_TTL_MS && cachedSignals.length > 0) {
    return NextResponse.json({
      success: true,
      signals: cachedSignals,
      fromCache: true,
      cachedAt: new Date(lastFetchTime).toISOString(),
    });
  }

  try {
    // Concurrently fetch real RSS feeds from Hugging Face & MIT AI News
    const [hfRes, mitRes] = await Promise.allSettled([
      fetch("https://huggingface.co/blog/feed.xml", {
        signal: AbortSignal.timeout(4000),
        headers: { "User-Agent": "SKILLAX-AI-ResearchRadar/1.0" },
      }),
      fetch("https://news.mit.edu/rss/topic/artificial-intelligence2", {
        signal: AbortSignal.timeout(4000),
        headers: { "User-Agent": "SKILLAX-AI-ResearchRadar/1.0" },
      }),
    ]);

    const liveSignals: ResearchSignal[] = [];

    // Parse Hugging Face feed if successful
    if (hfRes.status === "fulfilled" && hfRes.value.ok) {
      const xml = await hfRes.value.text();
      const parsed = parseRssXml(xml, "Hugging Face Research", 4);
      liveSignals.push(...parsed);
    }

    // Parse MIT AI News feed if successful
    if (mitRes.status === "fulfilled" && mitRes.value.ok) {
      const xml = await mitRes.value.text();
      const parsed = parseRssXml(xml, "MIT AI News", 4);
      liveSignals.push(...parsed);
    }

    if (liveSignals.length > 0) {
      cachedSignals = liveSignals;
      lastFetchTime = now;
      return NextResponse.json({
        success: true,
        signals: liveSignals,
        fromCache: false,
        sourceCount: liveSignals.length,
        retrievedAt: new Date().toISOString(),
      });
    }

    // Graceful fallback to verified cached papers if both feeds were unreachable
    return NextResponse.json({
      success: true,
      signals: FALLBACK_RESEARCH_SIGNALS,
      fromCache: true,
      cachedAt: new Date().toISOString(),
      notice: "Live RSS feeds temporarily unreachable; serving verified cached publications.",
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      signals: FALLBACK_RESEARCH_SIGNALS,
      fromCache: true,
      notice: "Live RSS error; serving verified cached publications.",
    });
  }
}
