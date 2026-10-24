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
| **Team Name** | Bombaklat |
| **Team Domain** | Domain 1 — Aiversecity Future-Ready Workforce |
| **SDG Track (1–17)** | Proposed: SDG 8 primary and SDG 4 secondary; confirm the selected track with the team. |
| **Team Leader** | Cecilia Se |
| **University** | Universiti Sains Malaysia |
| **Number of Members** | 4 |

## Links

| Resource | Link |
|---|---|
| GitHub Repository | [https://github.com/ado0330/SDC-Skillax](https://github.com/ado0330/SDC-Skillax) |
| Live Demo | https://skillaxai.replit.app |
| RunPod Endpoint | Not used; the project does not use a GPU workload, so RunPod was not needed. |
| Slide Deck | https://drive.google.com/file/d/1U-VG6lmdYK92JnCCAD5cjefa9p3d205G/view?usp=sharing |
| Demo Video | https://youtu.be/yY6k2AoyiRk?si=sys0_k6u-l-j6hi_ |

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
| AI / Compute | Optional Google Gemini API via `@google/genai` for CV extraction only; deterministic career logic runs in TypeScript. No GPU workload or RunPod integration is used. |
| Hosting / Dev | `.replit` configures the Next.js app for port 3000. Replit use is documented in the included proof PDF; add the project/live deployment URL when ready. |

---

## Project Structure

```text
.
├── docs/                         # Architecture, project history, and task documentation
│   └── submission/               # Proposal and technical declaration drafts/evidence notes
├── public/                       # Static assets, including the SKILLAX logo
├── src/
│   ├── app/                      # Next.js pages, global styles, and API routes
│   ├── components/               # Shared React components and dialogs
│   └── lib/                      # AI, domain logic, data catalogs, schemas, server cache, and workspace state
├── submission/                   # Required submission PDFs
│   ├── SDC2026_TeamBombaklat_Preliminary.pdf
│   ├── SDC2026_TeamBombaklat_TechDeclaration.pdf
│   └── SDC2026_TeamBombaklat_POU.pdf
├── tests/                        # Automated domain and research tests
├── .env.example                  # Optional Gemini environment variable names; no values
├── .gitignore                    # Ignores local secrets and generated files
├── .replit                       # Replit run and deployment configuration
├── package.json                  # Node.js dependencies and scripts
├── package-lock.json             # Locked npm dependency versions
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── LICENSE                       # Apache License 2.0
└── README.md
```

### Architecture

```text
Browser ──► Next.js application (local / Replit)
                 ├──► Gemini API (optional CV extraction, with user review)
                 └──► Hugging Face / MIT News / Crossref (research metadata)

RunPod: not used; this project has no GPU workload.
```

---

## How to Run

### Option 1 — Run on Replit

The team has used Replit to run this project, and the repository includes a `.replit` configuration for the Next.js app on port 3000. The proof of use is in `submission/SDC2026_TeamBombaklat_POU.pdf`.

1. Import the GitHub repository into a Replit project.
2. If using live CV extraction, add `GEMINI_API_KEY` to Replit Secrets. `GEMINI_MODEL` is optional and defaults to `gemini-3.5-flash-lite`.
3. Run the app and verify the deployment URL from a clean browser session.

### Option 2 — Run Locally

Requirements: Node.js 18 or later and npm.

```bash
# 1. Clone the repository
git clone https://github.com/ado0330/SDC-Skillax.git
cd SDC-Skillax

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

Replit was used to deploy the SKILLAX AI Platform prototype and make the website accessible for demonstration and review. The platform also supported iterative refinement by allowing the team to review the deployed application and identify potential improvements. Replit served as a development and deployment resource; the core career-matching and skills-analysis logic was implemented within the project itself.

📄 Proof of use: [`submission/SDC2026_TeamBombaklat_POU.pdf`](submission/SDC2026_TeamBombaklat_POU.pdf).

## How We Use RunPod *(Required)*

The project does not use a GPU workload, so RunPod was not needed or used. There is no RunPod handler, endpoint, or integration in the application. The team will follow the organizer's instructions for declaring non-use.

No RunPod proof-of-use document is applicable because RunPod was not used.

---

## Challenges & Learnings

- Research activity and labor-market demand require different evidence. The Radar uses publication metadata as research context, while bundled workforce observations remain synthetic demonstrations.
- External feeds can be unavailable or provide incomplete metadata, so the interface reports source and freshness status instead of treating every result as complete.
- A prototype build and passing software tests do not establish usability or improved employment outcomes; those require a defined user evaluation.

## Future Improvements

- [ ] Add a dated, comparable Malaysian vacancy or wage data source with clear licensing and provenance.
- [ ] Test the profile-to-roadmap journey with intended users and measure skill-gap changes over time.
- [ ] Add the public Replit project/live demo URL and confirm judge access.
- [ ] Finish and add the slide deck and demo video links.
- [ ] Confirm team details, official SDG track, slides, video, signatures, and the organizer's final submission requirements.

## Team

| Name | Role | GitHub |
|---|---|---|
| Cecilia Se | Team Lead | [@Cecilia-1231](https://github.com/Cecilia-1231) |
| Khaw Zhi Xin | Backend Developer | [@ado0330](https://github.com/ado0330) |
| Chong Chai Yee | Frontend Developer | [@chaiyee](https://github.com/chaiyee) |
| Kung Ker Mian | Documentation & Media Lead | [@kungkungmian](https://github.com/kungkungmian) |

---

## Submission Checklist

- [x] Confirm team name, Domain 1 selection, team leader, university, and member count.
- [x] Confirm the official SDG track.
- [x] Add the Replit project and live demo URLs when available.
- [x] Include Replit proof of use at `submission/SDC2026_TeamBombaklat_POU.pdf`.
- [x] Record RunPod as not used because the project has no GPU workload; follow organizer instructions for non-use.
- [x] Add the slide deck and demo video links when they are ready.
- [x] Complete and review the preliminary proposal; update its filename with the official team name.
- [x] Review and finalize `submission/SDC2026_TeamBombaklat_TechDeclaration.pdf` against the completed project and official submission requirements.
- [x] Verify the app runs from the README instructions and the demo link is judge-accessible.
- [x] Confirm contributor ownership and Apache 2.0 terms before public release.
- [x] Ensure no API keys or secrets are committed.

## License

This project is licensed under the [Apache License 2.0](LICENSE). Confirm contributor ownership and third-party attribution before public distribution.
