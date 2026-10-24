# Architecture Decision Records (ADRs) — SKILLAX AI Platform

## ADR-001: Strict No-Database Architecture with Client-Side Workspace State
- **Status:** APPROVED
- **Context:** The previous prototype used PostgreSQL and Drizzle ORM to persist anonymous workspace records. The SDC Hackathon requirements and Master Prompt explicitly mandate: "This is a prototype. A database is not required. Do not introduce SQL or NoSQL databases, ORM frameworks or database migrations."
- **Decision:** Re-architect workspace persistence entirely without a database. Use a central React Context (`lib/workspace/WorkspaceContext.tsx`) synced with browser `localStorage` for client preferences, profile drafts, target role selection, and completed milestones. Server-side processing is purely stateless/ephemeral.
- **Consequences:** Eliminates external database infrastructure, connection failures, and migration overhead. The prototype runs instantly in any environment (Antigravity and Replit) with zero backend setup.

---

## ADR-002: Pure Deterministic Career Intelligence Engine
- **Status:** APPROVED
- **Context:** Black-box LLM scoring produces non-repeatable, unexplainable career recommendations that hallucinate suitability scores.
- **Decision:** Career matching, score calculations, scenario adjustments, and roadmap generation must be implemented as 100% deterministic pure functions in TypeScript (`lib/domain/scoring.ts`, `lib/domain/scenarios.ts`). An LLM is never invoked to score or rank career options.
- **Consequences:** For identical user capabilities and market evidence, matching results are provably identical and auditable down to the tenth of a point. Fully covered by automated unit tests.

---

## ADR-003: Ephemeral Gemini CV Extraction with Human Verification & Offline Fallback
- **Status:** APPROVED
- **Context:** CV analysis requires AI to understand natural language resume descriptions, but privacy and security are paramount. Additionally, demonstrations may occur in environments without a configured `GEMINI_API_KEY`.
- **Decision:**
  1. Gemini integration (`@google/genai`) is restricted to server-side route handlers.
  2. Uploaded documents are read into ephemeral memory buffers and immediately zeroed; never persisted to disk.
  3. Extracted skills are returned as proposals; user must review and approve them before they merge into the profile draft.
  4. Provide both an offline keyword extraction fallback and synthetic pre-built demo CVs so the application functions flawlessly even without a live Gemini API key.
- **Consequences:** Maximizes privacy, complies with competition rules, and guarantees presentation resilience.

---

## ADR-004: Strict Decoupling of Evidence Paths
- **Status:** APPROVED
- **Context:** Scientific research activity (e.g. AI preprint counts on Hugging Face or MIT News) is often incorrectly conflated with labor market demand or hiring vacancies.
- **Decision:** Strictly separate Public Research Feeds (`/radar` Research tab) from Workforce Demand Time-Series datasets (`/radar` Workforce tab). Enforce statistical comparability rules on workforce data (same period classification, non-overlapping dates, non-zero denominator). Label all synthetic datasets explicitly.
- **Consequences:** Protects analytical integrity, transparently displays source provenance, and fulfills SDC Domain 1 criteria for explainable workforce intelligence.
