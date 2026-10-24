# Task Checklist — SKILLAX AI Platform

Status definitions: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`.

---

## Phase 0 — Foundation & Continuity

- [x] **TASK-001**: Establish persistent project-memory documentation (`AGENTS.md`, `docs/PROJECT_CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`, `docs/PROGRESS_LOG.md`, `docs/DECISIONS.md`, `docs/HANDOFF.md`) and initialize Git repository.
  - *Status:* DONE
  - *Files:* `AGENTS.md`, `docs/*`
  - *Acceptance:* Complete memory structure exists, Git repo initialized.

- [x] **TASK-002**: Initialize Next.js project shell with TypeScript, Tailwind CSS, Lucide icons, and Zod dependencies.
  - *Status:* DONE
  - *Files:* `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `app/layout.tsx`, `app/globals.css`
  - *Acceptance:* Next.js project builds cleanly and runs locally on port 3000.

- [x] **TASK-003**: Implement core domain static catalogs (19 skills, 10 occupations, 17 SDGs, learning resources, fallback research signals, initial workforce data, synthetic cohorts).
  - *Status:* DONE
  - *Files:* `lib/data/skills.ts`, `lib/data/roles.ts`, `lib/data/sdgs.ts`, `lib/data/learningResources.ts`, `lib/data/fallbackSignals.ts`, `lib/data/initialWorkforce.ts`, `lib/data/syntheticWorkers.ts`, `lib/data/sampleCvs.ts`, `lib/domain/types.ts`
  - *Acceptance:* All 19 skills, 10 O*NET roles, 17 SDGs accurately match reverse-engineering spec.

- [x] **TASK-004**: Implement pure deterministic mathematical domain scoring engine (`scoring.ts`, `scenarios.ts`, `gaps.ts`, `roadmap.ts`, `workforce.ts`) with automated unit tests.
  - *Status:* DONE
  - *Files:* `lib/domain/*`, `tests/scoring.test.ts`
  - *Acceptance:* Unit tests verify: 4/5-component baseline formulas, rapid/slower scenario modifiers, workforce scaling, gap calculation, and repeatable ranking.

---

## Phase 1 — Competition-Critical Working Journey (Domain 1 Capabilities)

- [x] **TASK-005**: Implement client-side Workspace State Provider (`lib/workspace/WorkspaceContext.tsx` & `useWorkspace.ts`) with demonstration persistence (`localStorage`) and no-database isolation.
  - *Status:* DONE
  - *Files:* `lib/workspace/WorkspaceContext.tsx`, `lib/workspace/useWorkspace.ts`, `lib/schemas/profile.ts`, `app/layout.tsx`
  - *Acceptance:* Profile, skills, active scenario, simulation boost, roadmap, and milestone completion state cleanly synchronizes and resets.

- [x] **TASK-006**: Build AppShell global navigation layout (desktop sidebar, mobile drawer, topbar with live scenario badge, sync indicator, replanning chip, theme toggle).
  - *Status:* DONE
  - *Files:* `components/AppShell.tsx`, `components/PageHeader.tsx`, `components/Panel.tsx`, `app/layout.tsx`
  - *Acceptance:* Responsive layout adheres to "Career OS" theme tokens, smoothly renders on desktop & mobile.

- [x] **TASK-007**: Implement Profile Editor (`/profile`) with 19 skill sliders (0–5), category counters, interest tags, demographic details, and profile routing guard (F-002).
  - *Status:* DONE
  - *Files:* `app/profile/page.tsx`, `components/LevelDots.tsx`, `components/ProfileGate.tsx`
  - *Acceptance:* User can edit and save name, occupation, 19 skills, interests; saving updates global workspace.

- [x] **TASK-008**: Implement Consented CV Extraction API & Review Modal (Gemini `@google/genai` integration + offline synthetic CV demo presets + keyword fallback).
  - *Status:* DONE
  - *Files:* `app/api/cv/analyze/route.ts`, `lib/ai/geminiClient.ts`, `lib/ai/cvExtractor.ts`, `lib/ai/keywordExtractor.ts`, `components/CvUploadModal.tsx`, `lib/data/sampleCvs.ts`, `app/profile/page.tsx`
  - *Acceptance:* User can upload PDF or paste text, or click "Sample CV", view staged suggestions, and merge into draft with explicit approval. Zero disk persistence.

- [x] **TASK-009**: Implement Trend Radar (`/radar`) featuring Research Activity (live Hugging Face/MIT RSS signals + fallback) and Workforce Demand trend analytics.
  - *Status:* DONE
  - *Files:* `app/radar/page.tsx`, `app/api/research/route.ts`, `lib/domain/workforce.ts`, `components/ManageDataModal.tsx`
  - *Acceptance:* Displays publication dates, sources, skill tags, and workforce time-series with comparability checks.

- [x] **TASK-010**: Implement Career Matches Directory (`/careers`) and Detail View (`/careers/[id]`) with 4/5-part score ring, score decomposition bar chart, and proficiency gap comparison.
  - *Status:* DONE
  - *Files:* `app/careers/page.tsx`, `app/careers/[id]/page.tsx`, `components/ScoreRing.tsx`, `components/BarCharts.tsx`, `components/SdgBadge.tsx`
  - *Acceptance:* 10 roles ranked deterministically; clicking role displays full mathematical audit, gap dual-bars, and "Set as Target" action.

- [x] **TASK-011**: Implement 4-Phase Learning Roadmap (`/roadmap`) with estimated hours, learning resource links, and interactive milestone completion checkoffs.
  - *Status:* DONE
  - *Files:* `app/roadmap/page.tsx`, `components/ExportModal.tsx`, `lib/domain/roadmap.ts`
  - *Acceptance:* Generates Phase 1 (Foundational), Phase 2 (Technical), Phase 3 (Capstone), Phase 4 (Portfolio); preserves completed milestones across regeneration.

- [x] **TASK-012**: Implement Scenario Lab (`/scenarios`) with Slower, Moderate, Rapid AI adoption toggles, simulation boost slider (-100 to +100), and live score comparison chart.
  - *Status:* DONE
  - *Files:* `app/scenarios/page.tsx`, `lib/domain/scenarios.ts`, `lib/domain/scoring.ts`
  - *Acceptance:* Adjusting scenarios or boost immediately recalculates scores and visibly affects rankings.

- [x] **TASK-013**: Implement SDG Impact Matrix (`/sdgs`) linking all 17 UN Sustainable Development Goals to occupations and user capabilities.
  - *Status:* DONE
  - *Files:* `app/sdgs/page.tsx`, `components/SdgBadge.tsx`
  - *Acceptance:* Interactive 17-SDG grid with official colors, luminance-checked text, and occupational linkages.

---

## Phase 2 — Supporting Workflows & Full Experience

- [x] **TASK-014**: Implement Intelligence Dashboard (`/`) briefing with top match card, 19-skill polygonal radar chart, score decomposition bars, active milestone card, and research digest.
  - *Status:* DONE
  - *Files:* `app/page.tsx`, `components/RadarChart.tsx`
  - *Acceptance:* Executive overview renders all key intelligence metrics.

- [x] **TASK-015**: Implement Conversational Assessment Wizard (`/assessment`) translating 5 everyday scenarios into skill ratings.
  - *Status:* DONE
  - *Files:* `app/assessment/page.tsx`
  - *Acceptance:* 5-question multi-step wizard maps answers into 0–5 skill ratings.

- [x] **TASK-016**: Implement Progress Tracking (`/progress`) with completion score ring, weekly pace projection, and phase-level effort charts.
  - *Status:* DONE
  - *Files:* `app/progress/page.tsx`
  - *Acceptance:* Visualizes completed hours, remaining hours, and milestones.

- [x] **TASK-017**: Implement Replanning & Audit Trail (`/updates`) with proposal review (Approve/Reject) and immutable recalculation log.
  - *Status:* DONE
  - *Files:* `app/updates/page.tsx`, `lib/workspace/WorkspaceContext.tsx`
  - *Acceptance:* Human-in-the-loop approval prevents silent roadmap updates.

- [x] **TASK-018**: Implement Workforce View (`/employer`) for synthetic cohorts (Aina, Daniel, Kumar), capability averages, and requirement coverage matrix.
  - *Status:* DONE
  - *Files:* `app/employer/page.tsx`
  - *Acceptance:* Aggregate planning view clearly disclaims individual candidate screening.

- [ ] **TASK-019**: Implement Methodology & Transparency (`/methodology`) and Settings (`/settings`) with workspace reset dialog.
  - *Status:* TODO
  - *Files:* `app/methodology/page.tsx`, `app/settings/page.tsx`, `components/ResetModal.tsx`
  - *Acceptance:* Formula disclosures, source catalogs, theme options, and atomic reset functionality.

- [ ] **TASK-020**: Implement Welcome Landing page (`/welcome`) and Export Plan dialog (JSON & Print/Save as PDF).
  - *Status:* TODO
  - *Files:* `app/welcome/page.tsx`, `components/ExportModal.tsx`
  - *Acceptance:* Landing presentation and print-ready CSS for roadmaps.

---

## Phase 3 — Hardening, Verification & Replit Readiness

- [ ] **TASK-021**: Run end-to-end typecheck, build validation, and automated unit tests.
  - *Status:* TODO
  - *Files:* Workspace
  - *Acceptance:* `npm run build` succeeds with zero errors; all tests pass.

- [ ] **TASK-022**: Prepare Replit deployment configuration (`.replit`, `replit.nix` or standard Node workflow) and synchronize canonical Git commits.
  - *Status:* TODO
  - *Files:* `.replit`, `README.md`, `docs/HANDOFF.md`
  - *Acceptance:* Ready for one-click Replit import and public demonstration.
