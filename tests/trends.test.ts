import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { deduplicateSignals, findResearchSignalsForSkills, isSignalSetStale, mapSkillsFromEvidence, normalizeCrossrefWorks, parseRssFeed } from "../src/lib/domain/trends";
import { GET } from "../src/app/api/research/route";
import { resetResearchCacheForTests, writeResearchCache } from "../src/lib/server/researchCache";
import { ResearchSignal } from "../src/lib/domain/types";
import { scoreCareerRole } from "../src/lib/domain/scoring";
import { ROLES_BY_ID } from "../src/lib/data/roles";

describe("Trend evidence normalization", () => {
  test("normalizes valid RSS, preserves missing or invalid dates, and leaves direction uncertain", () => {
    const feed = `<rss><channel>
      <item><title>Python and machine learning methods</title><link>https://source.example/item/1</link><pubDate>Mon, 05 Oct 2026 12:00:00 GMT</pubDate><description><![CDATA[Machine learning for Python workflows.]]></description></item>
      <item><title>Unrelated policy note</title><link>https://source.example/item/2</link><pubDate>not a date</pubDate><description>General policy.</description></item>
      <item><title>Missing date article</title><link>https://source.example/item/3</link><description>AI literacy.</description></item>
      <item><title>Bad link</title><link>javascript:alert(1)</link></item>
    </channel></rss>`;
    const results = parseRssFeed(feed, "Example source", "2026-10-24T00:00:00.000Z");
    assert.equal(results.length, 3);
    assert.equal(results[0].publishedAt, "2026-10-05T12:00:00.000Z");
    assert.equal(results[1].publishedAt, null);
    assert.equal(results[2].publishedAt, null);
    assert.deepEqual(results[0].skillIds, ["python", "ml"]);
    assert.deepEqual(results[1].skillIds, []);
    assert.equal(results[1].trendDirection, "uncertain");
    assert.equal(results[0].evidenceType, "external");
  });

  test("labels sources that publish a headline without an excerpt", () => {
    const [signal] = parseRssFeed(
      `<rss><channel><item><title>Headline only</title><link>https://source.example/headline</link></item></channel></rss>`,
      "Example", "2026-10-24T00:00:00.000Z"
    );
    assert.match(signal.observation, /without an excerpt/);
  });

  test("normalizes Crossref metadata for undercovered skill areas without exposing abstracts", () => {
    const results = normalizeCrossrefWorks({ message: { items: [
      { DOI: "10.1234/health.1", URL: "https://doi.org/10.1234/health.1", title: ["Health data analytics for industrial IoT project management"], published: { "date-parts": [[2025, 4, 12]] }, abstract: "Do not display this publisher text." },
      { DOI: "10.1234/old.1", URL: "https://doi.org/10.1234/old.1", title: ["Data analytics"], published: { "date-parts": [[2020]] } },
      { DOI: "10.1234/unrelated.1", URL: "https://doi.org/10.1234/unrelated.1", title: ["A general history of architecture"] },
      { DOI: "10.1234/bad.1", URL: "javascript:alert(1)", title: ["Health data"] },
    ] } }, "2026-10-24T00:00:00.000Z");
    assert.equal(results.length, 2);
    assert.deepEqual(results[0].skillIds, ["analysis", "iot", "health", "organization"]);
    assert.equal(results[0].publishedAt, "2025-04-12T00:00:00.000Z");
    assert.equal(results[1].publishedAt, null, "year-only metadata must not invent a month/day");
    assert.doesNotMatch(results[0].observation, /publisher text/);
  });

  test("normalizes every valid item in a feed so the activity count reflects its source", () => {
    const items = Array.from({ length: 7 }, (_, index) =>
      `<item><title>Item ${index}</title><link>https://source.example/${index}</link></item>`
    ).join("");
    const results = parseRssFeed(`<rss><channel>${items}</channel></rss>`, "Example", "2026-10-24T00:00:00.000Z");
    assert.equal(results.length, 7);
  });

  test("deduplicates canonical URLs and refuses to map unrelated text to AI", () => {
    const common = {
      id: "one", title: "An unrelated topic", source: "Publisher",
      sourceUrl: "https://source.example/a#first", publishedAt: null,
      retrievedAt: "2026-10-24T00:00:00.000Z", mode: "live" as const,
      observation: "A general topic.", skillIds: [], direction: "Research activity" as const,
      trendDirection: "uncertain" as const, evidenceType: "external" as const,
      limitations: "Research only.",
    } satisfies ResearchSignal;
    assert.deepEqual(mapSkillsFromEvidence("Unrelated news", "Nothing technical."), []);
    assert.equal(deduplicateSignals([common, { ...common, id: "two", sourceUrl: "https://source.example/a#second" }]).length, 1);
  });

  test("matches role skill context to cited external evidence without admitting synthetic items", () => {
    const external = parseRssFeed(
      `<rss><channel><item><title>Python skills in practice</title><link>https://source.example/python</link><pubDate>Mon, 05 Oct 2026 12:00:00 GMT</pubDate><description>Python research.</description></item></channel></rss>`,
      "Example", "2026-10-24T00:00:00.000Z"
    );
    const synthetic: ResearchSignal = { ...external[0], id: "synthetic", evidenceType: "synthetic", sourceUrl: "https://source.example/demo" };
    assert.deepEqual(findResearchSignalsForSkills(["python"], [...external, synthetic]).map((signal) => signal.id), [external[0].id]);
    assert.deepEqual(findResearchSignalsForSkills(["unrelated"], external), []);
  });

  test("detects stale, invalid, and fresh retrieval timestamps", () => {
    const now = Date.parse("2026-10-24T12:00:00.000Z");
    assert.equal(isSignalSetStale("2026-10-24T11:00:00.000Z", now), false);
    assert.equal(isSignalSetStale("2026-10-24T01:00:00.000Z", now), true);
    assert.equal(isSignalSetStale("invalid", now), true);
    assert.equal(isSignalSetStale(null, now), true);
  });

  test("feed failures report unavailable instead of successful synthetic fallback", async () => {
    resetResearchCacheForTests();
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response("unavailable", { status: 503 })) as typeof fetch;
    try {
      const response = await GET();
      const body = await response.json();
      assert.equal(response.status, 503);
      assert.equal(body.success, false);
      assert.equal(body.status, "error");
      assert.deepEqual(body.signals, []);
      assert.equal(body.failedSources.length, 3);
    } finally {
      globalThis.fetch = originalFetch;
      resetResearchCacheForTests();
    }
  });

  test("successful refresh caches results and the next request avoids another fetch", async () => {
    resetResearchCacheForTests();
    const originalFetch = globalThis.fetch;
    let calls = 0;
    const feed = `<rss><channel><item><title>Python methods</title><link>https://source.example/python</link><pubDate>Mon, 05 Oct 2026 12:00:00 GMT</pubDate><description>Python research.</description></item></channel></rss>`;
    globalThis.fetch = (async (input) => {
      calls += 1;
      if (String(input).includes("api.crossref.org")) {
        return new Response(JSON.stringify({ message: { items: [{
          DOI: "10.1234/health-data", URL: "https://doi.org/10.1234/health-data",
          title: ["Health data analytics"], published: { "date-parts": [[2026, 5, 1]] },
        }] } }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      return new Response(feed, { status: 200 });
    }) as typeof fetch;
    try {
      const first = await (await GET()).json();
      const second = await (await GET()).json();
      assert.equal(first.status, "live");
      assert.equal(first.signals.length, 2);
      assert.equal(second.status, "cached");
      assert.equal(calls, 3);
    } finally {
      globalThis.fetch = originalFetch;
      resetResearchCacheForTests();
    }
  });

  test("failed refresh with a prior successful result is explicitly stale", async () => {
    resetResearchCacheForTests();
    const oldSignal = parseRssFeed(
      `<rss><channel><item><title>AI research</title><link>https://source.example/old</link></item></channel></rss>`,
      "Example", "2026-10-24T00:00:00.000Z"
    );
    writeResearchCache(oldSignal, new Date(Date.now() - 120_000).toISOString());
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => { throw new Error("network down"); }) as typeof fetch;
    try {
      const response = await GET();
      const body = await response.json();
      assert.equal(body.success, false);
      assert.equal(body.status, "stale");
      assert.equal(body.stale, true);
      assert.equal(body.signals.length, 1);
    } finally {
      globalThis.fetch = originalFetch;
      resetResearchCacheForTests();
    }
  });

  test("research articles do not change deterministic career scores", () => {
    const role = ROLES_BY_ID.get("business-analyst")!;
    const profile = { excel: 4, analysis: 3, sql: 3, communication: 4, ai: 1 };
    const item: ResearchSignal = {
      id: "signal", title: "AI and SQL", source: "Example", sourceUrl: "https://source.example/story",
      publishedAt: null, retrievedAt: "2026-10-24T00:00:00.000Z", mode: "live",
      observation: "AI SQL Python machine learning cloud automation", skillIds: ["ai", "sql", "python", "ml", "cloud", "automation"],
      direction: "Research activity", trendDirection: "uncertain", evidenceType: "external", limitations: "Research is not demand.",
    };
    const baseline = scoreCareerRole(role, profile, ["Data Analytics"], "moderate", 0, [], []);
    const withNewArticle = scoreCareerRole(role, profile, ["Data Analytics"], "moderate", 0, [item], []);
    assert.deepEqual(withNewArticle.components, baseline.components);
  });
});
