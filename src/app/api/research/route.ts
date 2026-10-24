import { NextResponse } from "next/server";
import { deduplicateSignals, normalizeCrossrefWorks, parseRssFeed } from "@/lib/domain/trends";
import { markResearchAttempt, readResearchCache, writeResearchCache } from "@/lib/server/researchCache";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 60_000;
const SOURCES = [
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml" },
  { name: "MIT News: Artificial Intelligence", url: "https://news.mit.edu/rss/topic/artificial-intelligence2" },
];
const CROSSREF_QUERY = "health data health informatics industrial IoT smart manufacturing project management data analytics precision agriculture industrial maintenance cybersecurity cloud computing";

export async function GET() {
  const now = Date.now();
  const cache = readResearchCache();
  if (cache.signals.length && cache.lastSuccessAt && now - Date.parse(cache.lastSuccessAt) < CACHE_TTL_MS) {
    return NextResponse.json({ success: true, status: "cached", signals: cache.signals, lastSuccessfulUpdate: cache.lastSuccessAt, lastAttemptAt: cache.lastAttemptAt, stale: false });
  }

  const lastAttemptAt = new Date(now).toISOString();
  markResearchAttempt(lastAttemptAt);
  const results = await Promise.all([
    ...SOURCES.map(async (source) => {
    try {
      const response = await fetch(source.url, {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "SKILLAX-Research-Radar/1.0 (source attribution in UI)" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { source: source.name, signals: parseRssFeed(await response.text(), source.name, lastAttemptAt!) };
    } catch (error) {
      return { source: source.name, error: error instanceof Error ? error.message : "Feed unavailable", signals: [] };
    }
    }),
    (async () => {
      const source = "Crossref scholarly metadata";
      try {
        const url = new URL("https://api.crossref.org/works");
        url.searchParams.set("query.bibliographic", CROSSREF_QUERY);
        url.searchParams.set("rows", "100");
        url.searchParams.set("select", "DOI,title,URL,published,published-print,published-online");
        const response = await fetch(url, {
          signal: AbortSignal.timeout(5000),
          headers: { "User-Agent": "SKILLAX-Research-Radar/1.0" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { source, signals: normalizeCrossrefWorks(await response.json(), lastAttemptAt!) };
      } catch (error) {
        return { source, error: error instanceof Error ? error.message : "Crossref unavailable", signals: [] };
      }
    })(),
  ]);

  const signals = deduplicateSignals(results.flatMap((result) => result.signals));
  if (signals.length) {
    writeResearchCache(signals, lastAttemptAt);
    return NextResponse.json({
      success: true, status: "live", signals, lastSuccessfulUpdate: lastAttemptAt,
      lastAttemptAt, stale: false,
      failedSources: results.filter((result) => "error" in result).map((result) => ({ source: result.source, error: result.error })),
    });
  }

  const failedSources = results.map(({ source, ...result }) => ({
    source,
    error: "error" in result ? result.error : "Feed returned no valid entries",
  }));
  if (cache.signals.length && cache.lastSuccessAt) {
    return NextResponse.json({ success: false, status: "stale", signals: cache.signals, lastSuccessfulUpdate: cache.lastSuccessAt, lastAttemptAt, stale: true, failedSources });
  }
  return NextResponse.json({ success: false, status: "error", signals: [], lastSuccessfulUpdate: null, lastAttemptAt, stale: false, failedSources }, { status: 503 });
}
