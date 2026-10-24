> [!IMPORTANT]
> ## Submission documents and templates
> Download the official submission templates from the [SDC Hackathon Google Drive folder](https://drive.google.com/drive/folders/1xw7c2aN8N-at8hPEULzkcU76e_FFb0Ef) and check the current organizer instructions before submitting.

---

# SKILLAX AI Platform

> SKILLAX helps Malaysian workers, graduates, and career changers explore career matches and turn skill gaps into a reviewable learning roadmap.

---

## Team Information

| Field | Details |
|---|---|
| **Team Name** | SKILLAX is the current project name; confirm the official registered team name. |
| **Team Domain** | Domain 1 — Aiversecity Future-Ready Workforce |
| **SDG Track (1–17)** | Proposed: SDG 8 primary and SDG 4 secondary; confirm the selected track with the team. |
| **Team Leader** | [Add confirmed leader name] |
| **University** | [Confirm institution(s) for all team members] |
| **Number of Members** | [Add confirmed count, 1–5] |

## Links

| Resource | Link |
|---|---|
| GitHub Repository | [https://github.com/ado0330/SCD-prototype2](https://github.com/ado0330/SCD-prototype2) — configured remote; public judge access still needs confirmation. |
| Replit Project | [Add the team's Replit project URL] |
| Live Demo | [Add a public demo URL after deployment and judge-access verification] |
| RunPod Endpoint | [Confirm whether RunPod was used; add endpoint URL if applicable] |
| Slide Deck | [Add slide deck link] |
| Demo Video | [Add the required 5–7 minute demo or pitch video link] |

---

## Overview

### Problem

Workers and career changers must make career and training choices while skill requirements shift. They need a clear way to compare their current skills with possible roles and decide what to learn next. The prototype has not yet measured user outcomes or validated a Malaysian worker cohort.

### Solution

SKILLAX combines a skill profile, deterministic career matching, role-specific gap explanations, and a learning roadmap. Optional Gemini extraction proposes structured profile details from CV input for the user to review; it does not score or rank careers. The app has no database, and its bundled workforce observations and example profiles are synthetic demonstrations.

### Key Features

- **Skill profile and assessment** — enter skill ratings directly or use a guided assessment and synthetic CV examples.
- **Career matches and gap views** — compare a profile with benchmark occupations using explainable deterministic calculations.
- **Trend Radar** — browse research activity from Hugging Face, MIT News, and Crossref. These publication signals are not vacancy or wage data and do not change career scores.
- **Scenario Lab** — compare Moderate and Rapid adoption assumptions using the same career, skill-gap, and roadmap logic.
- **Learning roadmap and progress** — follow four learning phases, mark milestones, and review proposed replanning changes.
- **SDG and workforce views** — explore SDG mappings and clearly labeled synthetic workforce examples.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS |
| Backend | Next.js route handlers for CV extraction and research feeds |
| Database | None; browser workspace state uses localStorage, and request processing is ephemeral. |
| AI / Compute | Optional Google Gemini API via `@google/genai` for CV extraction only; deterministic career logic runs in TypeScript. No RunPod integration was found in the repository. |
| Hosting / Dev | `.replit` configuration is present for port 3000. Replit account use and deployment have not been verified. |

---

## Project Structure

```text
.
├── docs/                         # Architecture, project history, and submission drafts
│   └── submission/               # Editable proposal and technical declaration drafts
├── public/                       # Static assets, including the SKILLAX logo
├── src/
│   ├── app/                      # Next.js pages and API routes
│   ├── components/               # Shared React components
│   └── lib/                      # AI extraction, schemas, domain logic, catalogs, and workspace state
├── submission/                   # Proposal PDF and platform evidence files/placeholders
│   ├── SDC2026_SKILLAX_Preliminary.pdf
│   ├── Replit Proof of Use.pdf
│   └── RunPod Proof of Use.pdf
├── tests/                        # Automated domain and research tests
├── .env.example                  # Optional Gemini environment variable names; no values
├── .gitignore                    # Ignores local secrets and generated files
├── .replit                       # Replit run and deployment configuration
├── LICENSE                       # Apache License 2.0
├── package.json                  # Node.js scripts and dependencies
└── README.md
```

### Architecture

```text
Browser ──► Next.js application (local; Replit deployment is unverified)
                 ├──► Gemini API (optional CV extraction, with user review)
                 └──► Hugging Face / MIT News / Crossref (research metadata)

RunPod: no endpoint or integration is configured in this repository.
```

---

## How to Run

### Option 1 — Run on Replit

The repository includes a `.replit` configuration for the Next.js development and deployment commands on port 3000. The team must import this repository into its Replit account and provide its actual project and deployment URLs; the config file alone does not verify Replit use or a live deployment.

1. Import the GitHub repository into a Replit project.
2. If using live CV extraction, add `GEMINI_API_KEY` to Replit Secrets. `GEMINI_MODEL` is optional and defaults to `gemini-3.5-flash-lite`.
3. Run the app and verify the deployment URL from a clean browser session.

### Option 2 — Run Locally

Requirements: Node.js 18 or later and npm.

```bash
# 1. Clone the repository
git clone https://github.com/ado0330/SCD-prototype2.git
cd SCD-prototype2

# 2. Install dependencies
npm install

# 3. Optional: configure server-side Gemini CV extraction
cp .env.example .env.local
# Add GEMINI_API_KEY to .env.local; never commit this file.

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Gemini is optional; the offline extraction fallback and synthetic CV examples support a no-key demo.

### Run Tests and Build

```bash
npm test
npm run build
```

---

## How We Use Replit *(Required)*

The repository has a `.replit` file that configures the app to run on port 3000. This confirms Replit configuration is present, but the codebase does not establish whether the team used Replit, consumed credits, or deployed the app. Add authentic project or deployment evidence before submission.

📄 Current file: [`submission/Replit Proof of Use.pdf`](submission/Replit%20Proof%20of%20Use.pdf) is marked **EVIDENCE PENDING** and is a placeholder, not proof.

## How We Use RunPod *(Required)*

No RunPod handler, API client, endpoint configuration, or RunPod credentials are referenced by the application. Confirm with the team whether RunPod was used outside this repository. If it was used, add authentic screenshots and the endpoint details; if it was not used, follow the organizer's instructions for declaring non-use.

📄 Current file: [`submission/RunPod Proof of Use.pdf`](submission/RunPod%20Proof%20of%20Use.pdf) is marked **EVIDENCE PENDING** and is a placeholder, not proof.

---

## Challenges & Learnings

- Research activity and labor-market demand require different evidence. The Radar uses publication metadata as research context, while bundled workforce observations remain synthetic demonstrations.
- External feeds can be unavailable or provide incomplete metadata, so the interface reports source and freshness status instead of treating every result as complete.
- A prototype build and passing software tests do not establish usability or improved employment outcomes; those require a defined user evaluation.

## Future Improvements

- [ ] Add a dated, comparable Malaysian vacancy or wage data source with clear licensing and provenance.
- [ ] Test the profile-to-roadmap journey with intended users and measure skill-gap changes over time.
- [ ] Complete a public judge-accessible deployment and attach authentic Replit/RunPod evidence where applicable.
- [ ] Confirm team details, official SDG track, slides, video, signatures, and the organizer's final submission requirements.

## Team

| Name | Role | GitHub |
|---|---|---|
| [Add confirmed member] | [Add role] | [Add profile link] |
| [Add additional members] | [Add roles] | [Add profile links] |

---

## Submission Checklist

- [ ] Confirm official team name, Domain 1 selection, SDG track, leader, university affiliations, and member count.
- [ ] Add and verify the public GitHub, Replit, live demo, RunPod (if applicable), slide deck, and video links.
- [ ] Replace `submission/Replit Proof of Use.pdf` with authentic evidence.
- [ ] Confirm RunPod use; replace its placeholder with authentic evidence or follow organizer instructions for non-use.
- [ ] Complete and review the preliminary proposal; update its filename with the official team name.
- [ ] Complete the technical tools declaration PDF. An editable draft is available in `docs/submission/`; no declaration PDF is currently in `submission/`.
- [ ] Verify the app runs from the README instructions and the demo link is judge-accessible.
- [ ] Confirm contributor ownership and Apache 2.0 terms before public release.
- [ ] Ensure no API keys or secrets are committed.

## License

This project is licensed under the [Apache License 2.0](LICENSE). Confirm contributor ownership and third-party attribution before public distribution.
