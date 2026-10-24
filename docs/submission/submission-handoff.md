# Submission Handoff — SKILLAX AI Platform

**Prepared:** 24 October 2026  
**Purpose:** Team review of the Phase 1 Preliminary Project Proposal and Technical Tools Declaration drafts.

## Deliverables

1. [`preliminary-proposal-draft.md`](preliminary-proposal-draft.md) — requested proposal fields and limits, evidence-based problem context, proposed SDG measures, system diagram, and unanswered declarations.
2. [`technical-tools-declaration-draft.md`](technical-tools-declaration-draft.md) — verified stack, APIs, AI model configuration, datasets, cloud/deployment status, privacy, risks and checklists.
3. [`evidence-and-verification-checklist.md`](evidence-and-verification-checklist.md) — repository findings, unverified items, official handbook requirements and source register.
4. [`system-architecture-diagram.md`](system-architecture-diagram.md) — standalone Mermaid architecture and data-boundary notes.
5. [`SDC2026_SKILLAX_Preliminary_Proposal_DRAFT.docx`](SDC2026_SKILLAX_Preliminary_Proposal_DRAFT.docx) — filled copy of the supplied official proposal template.
6. [`SDC2026_SKILLAX_Technical_Tools_Declaration_DRAFT.docx`](SDC2026_SKILLAX_Technical_Tools_Declaration_DRAFT.docx) — filled copy of the supplied official declaration template.
7. This handoff.

The root [`submission/`](../../submission/) folder now contains the current nine-page proposal PDF and two one-page PDFs marked **EVIDENCE PENDING**. These placeholders are there to make missing items visible and are not valid Replit/RunPod proof. Replace them with genuine team evidence before submission. The official team name, leader/roster, final SDG choice, public demo and pitch links are still unconfirmed.

The two supplied DOCX templates were filled while preserving their package parts other than `word/document.xml`, then rendered and visually reviewed. Project continuity files `docs/TASKS.md`, `docs/PROGRESS_LOG.md` and `docs/HANDOFF.md` are also updated as required by the repository's `AGENTS.md`. No application code or configuration was changed, and no application tests were run for this documentation-only task.

**Follow-up:** TASK-029 later moved the application directories to `src/app/`, `src/components/`, and `src/lib/` to meet the requested repository layout. The root README and TypeScript/Tailwind configuration were updated; the test suite and production build passed after the move.

## Repository evidence reviewed

Reviewed `README.md`, `AGENTS.md`, `docs/TASKS.md`, `docs/PROGRESS_LOG.md`, `docs/HANDOFF.md`, `package.json`, `package-lock.json`, `.env.example`, `.gitignore`, `.replit`, route/page file list, Git remote/log/status, and relevant code in `src/app/api/`, `src/lib/ai/`, `src/lib/domain/`, `src/lib/data/`, `src/lib/workspace/`, and the CV upload interface.

The implementation is a Next.js 14 / React 18 TypeScript app. User workspace data lives in browser localStorage; no database service was found. Career scores and pathways are deterministic functions. Gemini extraction is a server-side integration configured through an environment variable and defaults to `gemini-3.5-flash-lite`; a live call was not verified. Hugging Face and MIT RSS feeds are fetched as research-activity signals. The default workforce observations are synthetic. The repository includes Replit configuration but no confirmed public deployment URL.

Project records report 8/8 domain tests and a 19-route build on 24 October 2026. These are historical record claims, not tests rerun during this document task. They do not establish user testing, live API success, or judge accessibility.

## Source material and external research

Read the supplied SDC Official Handbook, Official Terms & Conditions, Official Participant Handbook, and Domain 1 Problem Statement/Marking Rubric, along with the proposal and Technical Tools Declaration DOCX templates supplied by the user. The filled DOCX files are editable review drafts, not signed or submission-ready PDFs.

External primary sources used for claims and technical terms are listed in the evidence checklist: WEF's 2025 skills outlook; TalentCorp Malaysia's workforce impact study; UN SDG 4 and SDG 8 target pages; Google Gemini model and API terms pages; and O*NET's license documentation. In particular, the latest WEF figure used is 39% expected skill change by 2030 (published 7 January 2025), rather than the superseded 2023 figure. TalentCorp's 620,000/~18% figure is presented as a projection within analysed sectors, not as a measured gap among SKILLAX users.

## Important corrections and assumptions avoided

- Did not claim public deployment, successful live Gemini service, completion of workshops, sponsor-resource use, user testing, impact results, or verified repository visibility.
- Did not treat the configured O*NET links as proof that a dataset/API was downloaded or used.
- Did not state that CVs are never sent externally: a configured Gemini route sends CV content to Google, and Google's data treatment differs by service tier.
- Did not treat buffer clearing after a successful route call as proof of deletion on every error path or at Google/hosting providers.
- Flagged the unsupported “TalentCorp / MDEC Synthetic Working Group” provider string in the synthetic workforce records.
- Did not assert that all source code was created during the hackathon or that there are no employment/IP conflicts.

## Must resolve before signing or final upload

1. Fill official team name, leader/contact, roster, institution(s), workshop status and signatures.
2. Confirm the proposed SDG selection, pilot target, answers, and remaining placeholders with the team; check for revised committee instructions and recount bounded answers after edits.
3. Disclose prior work and owners; obtain the organizer approval required by the Official Handbook for pre-existing materials.
4. Confirm actual team-wide AI tool use and each tool's purpose/extent; review the responsibility statement.
5. Confirm Gemini key/account tier, whether the live route works, sponsor credits/resources and data/privacy terms.
6. Confirm Replit was used and collect required evidence. The Participant Handbook requires Replit use and proof in the technical declaration; a configuration file alone is insufficient.
7. Deploy the prototype and verify the live URL as a judge would access it.
8. Confirm GitHub repository is public and matches the demo; root `LICENSE` now contains Apache 2.0 text, but all contributors must approve ownership and license terms before public release.
9. Resolve O*NET attribution and remove or substantiate the synthetic dataset's unsupported provider attribution.
10. Recount all word-limited answers after team edits, and complete the remaining Phase 1 deliverables (product requirement document, pitch deck, prototype link, repository link and 5–7 minute pitching video).

The root README now follows the requested submission outline and marks unverified details as placeholders. `.env.example` contains empty configuration names only; `.env.local` remains ignored. The project uses the root-level Next.js `src/app/` convention, so source directories were not moved into a redundant `src/` folder.

