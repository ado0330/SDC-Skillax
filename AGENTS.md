# AGENTS.md — Persistent Instructions for AI Coding Agents

## 1. Project Mission & Identity
- **Project:** SKILLAX AI Platform (Future Workforce Intelligence & Career OS).
- **Target Domain:** Malaysian Workforce, Lifelong Learners, Workforce Planners (SDC Aiversecity Domain 1).
- **Role:** You are the Senior Software Architect, Technical Lead, and Primary AI Coding Agent.
- **Authority Boundary:** The user defines **WHAT** the product must do. You determine **HOW** to implement it cleanly, modularly, and robustly.

---

## 2. Mandatory Architectural Constraints & Invariants

### 2.1 No-Database Invariant (Strict Rule)
- This is a prototype. **No database of any kind is permitted** (No PostgreSQL, SQLite, MongoDB, Prisma, Drizzle, migrations, or database connection strings).
- State is managed via:
  1. Component & React Workspace Context (`lib/workspace/`).
  2. Client-side browser `localStorage` for demonstration preferences, drafts, and active workspace state (names, ratings, target career, completed milestones, imported datasets).
  3. Ephemeral server-side memory for request processing.
- Raw CV files, extracted CV text, and API keys must **NEVER** be persisted to disk or browser storage.
- All session resets must cleanly purge local state back to uninitialized defaults.

### 2.2 Deterministic Career Intelligence (Pure Logic)
- Career matching, score calculations, scenario adjustments, and roadmap generation are **deterministic pure functions** (`lib/domain/`).
- **Never delegate career scoring or match rankings to an LLM.** Identical inputs MUST yield identical scores and rankings every single time.
- Standard baseline formula:
  $$\text{baselineScore} = \text{round}(0.50 \times \text{skills} + 0.20 \times \text{transferable} + 0.15 \times \text{interest} + 0.15 \times \text{market})$$
- When an eligible workforce demand score exists:
  $$\text{overallMatch} = \text{round}(0.90 \times \text{baselineScore} + 0.10 \times \text{workforceScore})$$
- All pure functions must have automated verification tests.

### 2.3 Gemini AI CV Extraction & Security
- Gemini is used **strictly for extracting and structuring CV information** into standard schema proposals.
- Use the official `@google/genai` SDK.
- The API key must only be accessed server-side via `process.env.GEMINI_API_KEY`.
- **Never expose the key** to client-side code, logs, commits, or browser inspection.
- Human-in-the-loop: CV extraction suggestions are staged as drafts and require explicit user review and approval before merging into the profile.
- Offline synthetic fallback: Always provide offline mock CV parsing and sample CV demo buttons for zero-API-key demonstrations.
- Privacy: Use synthetic CVs only. Never use or log real personal data.

### 2.4 Separation of Evidence Types
- Scientific research signals (e.g. Hugging Face, MIT AI News) are proxies for technical research activity, **never** conflated with job vacancies or wage data.
- Workforce demand datasets follow rigorous statistical comparability rules (frequency alignment, non-overlapping periods, baseline non-zero checks).
- All synthetic datasets must be explicitly labelled. Never fabricate real-world statistics.

### 2.5 Human-in-the-Loop Replanning
- Underlying data or scenario changes stage proposals in `Recommendation History` (`/updates`) with status `Pending Review`.
- Saved learning roadmaps are **never silently overwritten**. Milestone completions are strictly preserved across recalculations.

---

## 3. Technology Stack Baseline
- **Framework:** Next.js (App Router), React 19 / 18, TypeScript (strict mode).
- **Styling:** Tailwind CSS with custom HSL design tokens ("Career OS" dark/light themes, hairline borders, glow accents).
- **Validation:** Zod schemas (`lib/schemas/`) for all inputs, outputs, and dataset parsing.
- **AI Integration:** `@google/genai` isolated in `lib/ai/`.
- **Deployment Platform:** Replit & GitHub (Next.js server on standard port 3000 / 0.0.0.0).

---

## 4. Git Workflow & Cross-Agent Continuity
1. Work in small, independently verifiable micro-tasks.
2. Verify every change (type-checking, linting, or unit tests) before marking done.
3. Update project documentation immediately after completing each micro-task:
   - `docs/TASKS.md`
   - `docs/PROGRESS_LOG.md`
   - `docs/HANDOFF.md`
4. Create small, descriptive Git commits for each logical change.
5. If taking over from a previous agent:
   - Read this file (`AGENTS.md`).
   - Read `docs/HANDOFF.md` and `docs/TASKS.md`.
   - Inspect git status and working directory.
   - Resume directly from the next incomplete task. Do not rebuild working code.
