# SKILLAX AI Platform

SKILLAX is a Malaysian workforce career exploration prototype that compares a learner's skills with benchmark roles and turns gaps into reviewable learning steps.

## Team Information

| Field | Information |
|---|---|
| Team name | **SKILLAX** is the project name; confirm the official registered team name. |
| Team domain | Domain 1 — Aiversecity Future-Ready Workforce |
| SDG track | Proposed primary: SDG 8; proposed secondary: SDG 4. Confirm the official track with the team. |
| Team leader | [Add full name] |
| University | [Confirm each member's institution] |
| Number of members | [Add confirmed count, 1–5] |

## Links

| Resource | Link / status |
|---|---|
| GitHub repository | [https://github.com/ado0330/SCD-prototype2](https://github.com/ado0330/SCD-prototype2) — configured Git remote; public access must be confirmed. |
| Replit project | [Add the team's Replit project URL] |
| Live demo | [Add a public, judge-accessible URL; localhost is not a live demo] |
| RunPod endpoint | [Add if used; otherwise state “Not used” after team confirmation] |
| Pitch slides | [Add link] |
| Pitch video | [Add link to the required 5–7 minute video] |

## Overview

The application includes a skill profile and assessment, deterministic career matches, skill gap views, a learning roadmap, progress tracking, scenario comparisons, an SDG view, a workforce planning view, and recommendation review history. The Trend Radar presents research publication activity from Hugging Face, MIT News, and Crossref. These research signals are not job vacancies or wage data and do not affect career rankings. Bundled workforce observations and example worker profiles are synthetic demonstrations.

Gemini is optional and used server-side only to extract structured suggestions from CV input. Suggestions require user review; a local keyword fallback and synthetic sample CVs support demonstrations without an API key. Do not enter real personal CV data in a demo unless the team has reviewed the applicable service and privacy terms.

## Overall Project Structure

```text
src/app/              Next.js App Router pages and API routes
src/components/       Shared React interface components
src/lib/              AI extraction, catalogs, schemas, domain logic, workspace state
public/              Static assets
tests/               Automated domain and route tests
docs/                Architecture, progress, and submission preparation records
docs/submission/     Editable proposal and technical declaration drafts
submission/          Preliminary proposal PDF and platform-evidence placeholders
```

The app, shared components, and domain libraries are grouped under `src/`. Next.js App Router routing remains in `src/app/`.

## How We Used Replit & RunPod

- **Replit:** The repository contains a `.replit` configuration for running and deploying the Next.js application on port 3000. This verifies configuration; team account use and deployment remain unverified. Add authentic project/account evidence to `submission/Replit Proof of Use.pdf`.

- **RunPod:** No configuration or endpoint was identified in the repository audit. Confirm whether the team used RunPod. If so, replace `submission/RunPod Proof of Use.pdf` with authentic evidence; otherwise follow the organizer's instructions for reporting non-use.

## How to Run the Project

Requirements: Node.js 18 or newer and npm.

```bash
npm install
cp .env.example .env.local   # optional; add a Gemini key only in your local environment
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Most features work without Gemini credentials using the offline demo flows. To run the automated checks, use `npm test`; to create a production build, use `npm run build`.

## Submission Package Status

The files in `submission/` are working drafts. The proposal PDF filename uses SKILLAX as a working team name until the official team name is confirmed; the PDF has unresolved team details and requires team review. The Replit and RunPod PDFs are explicitly marked as awaiting authentic evidence; they are not proof of platform use. Before submission, confirm team information, public links, signatures, platform use, and organizer requirements. Editable document drafts and the evidence checklist are in [`docs/submission/`](docs/submission/).

## License & Attribution

The project license is Apache License 2.0; see [`LICENSE`](LICENSE). Confirm contributor ownership and third-party content attribution before publishing. Research items remain attributed to their providers. O*NET references and United Nations SDG materials retain their respective source terms.
