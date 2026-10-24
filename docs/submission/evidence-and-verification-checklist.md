# Evidence & Verification Checklist

**Audit date:** 24 October 2026  
**Scope:** SKILLAX repository, supplied SDC PDFs, requested submission fields, and public primary/official sources.  
**Status key:** Verified in code; verified in documentation; verified by prior project record; team confirmation required; planned/not implemented; unknown.

## 1. Repository findings

| Topic | Finding | Status / action |
|---|---|---|
| Framework and routes | Next.js App Router, React 18 and TypeScript. Application pages are in `app/`; API handlers are `/api/cv/analyze` and `/api/research`. | Verified in code and package files. |
| Dependencies | `package.json` has version ranges; `package-lock.json` resolves versions. Direct dependency license metadata was read from the lockfile. | Verified in package files; not a full legal review of all transitive dependencies. |
| Career scoring | Pure TypeScript functions calculate skill, transferable, interest and research-activity components. Baseline weights are 50/20/15/15. Eligible workforce data can contribute 10% to an overall score. | Verified in `lib/domain/scoring.ts`. The workforce input is synthetic by default and can be user-imported. |
| AI integration | `@google/genai` is imported server-side. Code defaults to model ID `gemini-3.5-flash-lite`, overridable by `GEMINI_MODEL`; the key is read from `process.env.GEMINI_API_KEY`. Keyword fallback exists. | Integration/configuration verified in code. A successful request with the current key/account was not tested. No key value was read or disclosed. |
| CV flow | The route accepts text/PDF, requires two checkboxes, sends content to extraction, and returns a proposal. The interface stages suggestions for review. | Verified in code. File buffer is cleared after successful extraction, not in a `finally` block. The code does not establish provider-side deletion or zero-copy processing. |
| Browser persistence | Workspace serializes profile, scenario, research signals, workforce data, milestone IDs, roadmap, recommendation history and preferences to `localStorage` key `skillax_workspace_v2`; reset removes that key. | Verified in `lib/workspace/WorkspaceContext.tsx`. No database connector/configuration found in reviewed files. |
| Research feeds | Server route requests Hugging Face Blog RSS and MIT AI News RSS, caches in process for 60 seconds, and falls back to bundled signals. | Verified in `app/api/research/route.ts`. These are technical research/news signals, not labor-market data. |
| Workforce reference data | Bundled `initialWorkforce.ts` observations set `synthetic: true`. | Verified in code. Its provider string “TalentCorp / MDEC Synthetic Working Group” is unsupported by the repository and must be removed or substantiated before submission. Do not cite the synthetic series as real Malaysian data. |
| Other data | Synthetic worker profiles and CV examples are bundled; learning resources are static URLs; role and skill catalogs are project files. | Verified in code. No model-training dataset or live job/course database API found. Check attributions for any text or mappings actually copied from external references. |
| Deployment | `.replit` defines commands and port 3000; local scripts use port 3000. | Configuration verified. Replit account usage, deployed service, plan, region and public URL are unknown. No Vercel setup or live URL was found. |
| Repository | Git remote is `https://github.com/ado0330/SCD-prototype2`; current branch is `main`. | Remote configuration verified. Public visibility and judge access were not verified. |
| Build and tests | Project records report 8/8 domain tests passing and a 19-route build on 24 October 2026. | Prior project documentation only; tests/build were not rerun for this document task. These checks do not prove user testing, deployment or live Gemini behavior. |
| Project-document inconsistencies | Current `lib/ai/cvExtractor.ts` defaults to Gemini 3.5 Flash-Lite; `README.md`, `docs/ARCHITECTURE.md` and `app/methodology/page.tsx` still contain Gemini 2.5 Flash claims. | Prefer current code for implementation facts; update stale project copy before demo/submission. |
| Domain 1 trend requirement | Domain 1 brief expects an updatable AI and job-market signal source; hard-coded lists alone do not count. | Research RSS is updatable but only measures research/news activity. Workforce defaults are synthetic and there is no live vacancy/wage feed. This is a gap against the brief; disclose it and plan a lawful, dated job-market source or explain the limitation to judges. |
| License file | [Check repository before submission.] | Participant Handbook Section 10.2 requires an Apache License 2.0 `LICENSE` file. The reviewed file listing did not identify a root `LICENSE`; team must confirm and add the required file with contributor/ownership approval. |

## 2. Required team confirmations

- [ ] Official team name, leader name/contact, all registered members, exact institution affiliations and member count (1–5 per Official Handbook §4.2.3).
- [ ] Each member's student eligibility and agreement to participate; do not infer from the workspace path.
- [ ] Whether all members completed the named workshops in the proposal checklist; keep unchecked until individually confirmed.
- [ ] Whether any code, designs, models, templates, research or other materials predate the official hacking period; identify authors/owners and dates. Official Handbook §7.4.1 and §8.2.1 requires disclosure and organizer approval for pre-existing materials. Git history alone does not resolve this.
- [ ] Any university, employer, internship, consulting or sponsor IP restrictions that affect submitted contributions.
- [ ] Complete team-wide AI-assisted development list: Antigravity is reported in the task context; confirm users, version/edition, purpose and extent. Include other tools used by members. This Codex session drafted these submission documents; distinguish this from prior app-code development.
- [ ] Whether Gemini was actually called during development/demo, which Google project/billing tier applies, whether any SDC sponsor credits were used, and whether the current model/key combination succeeds. Never put a key in the documents.
- [ ] Whether Replit was actually used. Participant Handbook §15.21 requires project use of Replit; §10.6 requires proof of use in the declaration. A `.replit` file alone is not proof. Add the evidence requested by the official form (for example a live URL or team-provided screenshot/account evidence).
- [ ] Public judge-accessible application URL; confirm through a clean browser and record the exact URL. `localhost:3000` is not a live prototype URL.
- [ ] GitHub repository is public and accessible to judges and matches the demo (Participant Handbook §10.2–10.5). Check the submitted branch/commit and provide the repository URL.
- [ ] Root Apache 2.0 `LICENSE` exists and is authorized by all owners; required by Participant Handbook §10.2. No root LICENSE was identified during this audit.
- [ ] Whether sponsor-provided APIs, credits, cloud, datasets or other technical resources were used. Select Yes/No and list actual use; the official handbook's mention of a sponsor community does not establish project use.
- [ ] Whether O*NET data/text was actually reused, which version/content, and required attribution. Current code has occupation links/codes but no evidence of a downloaded database or live API. Confirm attribution/license and disclose modifications if applicable.
- [ ] Correct or substantiate the unsupported “TalentCorp / MDEC Synthetic Working Group” provider field in synthetic workforce observations before declaring data provenance.
- [ ] Confirm all sample workers/CVs are fictional and all user/demo data shown at presentation are synthetic or used with proper consent.
- [ ] Review Google Gemini API terms for the actual account tier before accepting real CVs. Current Google documentation states that content sent through unpaid services may be used to improve Google services and may be reviewed by humans; paid service terms differ. The current UI's “ephemeral” language does not guarantee deletion by Google.
- [ ] Final signatures, dates and authorization for every declaration.

## 3. Submission and template verification

- The four supplied PDFs are the Official Handbook, Official Terms & Conditions, Official Participant Handbook and Domain 1 Problem Statement/Marking Rubric. They do not include standalone copies of the two fill-in templates.
- Participant Handbook §10.8 points to a separate official Drive folder containing submission templates: https://drive.google.com/drive/folders/1xw7c2aN8N-at8hPEULzkcU76e_FFb0Ef . The folder could not be opened through the available browser tool, and its templates were not among the four supplied PDFs. The drafts follow the field order and limits in the user's pasted request; compare against the actual downloaded templates before final transfer.
- The Participant Handbook's Phase 1 rundown lists six deliverables: product requirement document, pitch slides, live/functional prototype link, technical & tools declaration, GitHub repository link, and 5–7 minute pitch video. This task prepares the two documents only; other deliverables remain outside this package.
- Official Participant Handbook says public repository access matters, Apache 2.0 license file is required, and Replit usage must be proved. Treat these as submission blockers until satisfied.

## 4. External evidence register

| Claim supported | Source and publication date | URL (accessed 24 October 2026) |
|---|---|---|
| Employers expect 39% of workers' core skills to change by 2030; global employer survey estimate, not Malaysia-specific. | World Economic Forum, *Future of Jobs Report 2025*, 7 January 2025. | https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/ |
| TalentCorp study scope: 949 roles across 10 sectors, about 620,000 employees/~18% of analysed-sector workforce projected significantly affected; 84 high-impact roles have transition pathways. | Talent Corporation Malaysia, Impact Study launched 18 November 2024; current study page also records metrics. | https://www.talentcorp.com.my/resources/press-releases/talentcorp-launches-landmark-study-on-workforce-impact-of-ai-digitalisation-and-green-economy/ and https://www.talentcorp.com.my/impact-study/ |
| Exact UN target wording and SDG alignment: Target 4.4 (relevant skills) and Target 8.2 (productivity/technology). | United Nations Department of Economic and Social Affairs, SDG 4 and SDG 8 pages; live pages, no single publication date. | https://sdgs.un.org/goals/goal4 and https://sdgs.un.org/goals/goal8 |
| Configured Gemini model ID, supported inputs and stable status. | Google AI for Developers, Gemini 3.5 Flash-Lite model page; page states model update July 2026. | https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite |
| Gemini free/unpaid vs paid service data handling. | Google Gemini API Additional Terms, live terms; access date 24 October 2026. | https://ai.google.dev/gemini-api/terms |
| O*NET license/attribution, if O*NET content has actually been adapted. | O*NET Resource Center, license agreements; current database page identifies release 31.0 (August 2026). | https://www.onetcenter.org/license_agreements.html and https://www.onetcenter.org/database.html |

## 5. Risk and completion summary

**Drafts are not ready for signature or final upload.** Administrative details, prior-work/ownership disclosures, tool and sponsor confirmation, real Replit-use proof, public links, repository access, Apache license file, data attribution and Gemini privacy/account review remain open. The SDG alignment and external workforce figures are documented, but no baseline for actual SKILLAX user skill gaps or impact has been measured. The percentage target in the proposal is a proposed pilot target, not a claim of achieved impact.

