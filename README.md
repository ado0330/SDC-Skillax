# SKILLAX AI Platform — Future Workforce Intelligence & Career OS

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-8%2F8%20Passing-brightgreen?style=flat)](tests/scoring.test.ts)
[![Hackathon](https://img.shields.io/badge/SDC%20Aiversecity-Domain%201%3A%20Future%20of%20Work-cyan?style=flat)](https://sdg.un.org/)

> **A high-precision, explainable AI platform bridging capability profiling, dynamic macroeconomic scenario shocks, and deterministic reskilling pathways for the Malaysian workforce.**

---

## 1. Executive Summary & Hackathon Mission

Built for the **SDC Aiversecity Hackathon (Domain 1: Future of Work & Lifelong Learning)**, **SKILLAX AI** tackles the urgent challenge of rapid AI workplace transformation across Malaysia and Southeast Asia. 

Rather than relying on ungrounded generative LLM advice that hallucinates suitability percentages, SKILLAX AI employs a **pure mathematical deterministic scoring engine** coupled with:
1. **19 Standardized Competencies:** 5 Transferable, 5 Digital, 9 Technical.
2. **10 National Priority Benchmark Occupations:** Fully mapped to US Department of Labor O*NET SOC classifications and UN SDGs.
3. **Dynamic Scenario Lab:** Simulating career sensitivity under Slower, Moderate, or Rapid technological adoption speeds.
4. **4-Phase Structured Learning Pathways:** Foundational Literacy, Applied Technical Competencies, Capstones, and Production Portfolios.
5. **17 UN Sustainable Development Goals (SDG) Matrix:** Tracking direct contributions to sustainable economic growth.
6. **Enterprise Workforce View:** Aggregate capability analytics and requirement coverage matrices for organizational planners.

---

## 2. Core Architectural Invariants

| Invariant | Architectural Enforcement |
| :--- | :--- |
| **Strict No-Database Rule** | **Zero database connections** (no SQL, Prisma, Drizzle, SQLite, or migrations). All state is kept ephemeral in RAM or stored client-side in browser `localStorage` (`skillax_workspace_v2`). Sessions can be purged atomically via Settings. |
| **Deterministic Intelligence** | Career matching and scenario scores are pure mathematical functions in `lib/domain/`. Identical inputs yield identical rankings every single time with zero LLM hallucination. |
| **Consented Ephemeral AI** | Google Gemini 2.5 Flash SDK (`@google/genai`) extracts structured profiles server-side. Memory buffers are zeroed immediately; raw CV files and text are **never written to disk**. Staged review allows human-in-the-loop editing. |
| **Evidence Separation** | Hugging Face and MIT News RSS items show publication activity only. They never affect career scores or stand in for vacancies, wages, or workforce demand. |
| **Human-in-the-Loop Replanning** | Recalculations triggered by data updates stage proposals in `/updates` with status `Pending Review`. Saved roadmaps are never silently overwritten; completed milestone IDs are strictly preserved. |

---

## 3. Mathematical Scoring Engine

### Baseline 4-Component Model
$$\text{baselineScore} = \text{round}(0.50 \times \text{skills} + 0.20 \times \text{transferable} + 0.15 \times \text{interest} + 0.15 \times \text{market})$$

### Empirical Workforce Demand Integration (5-Component Model)
$$\text{overallMatch} = \text{round}(0.90 \times \text{baselineScore} + 0.10 \times \text{workforceScore})$$

### Scenario Shocks & Simulation
- **Slower Adoption:** AI requirements reduced by 1 level; market adjusted by $-10 \times \text{technicalShare} + 0.05 \times \text{exposure}$.
- **Rapid Adoption:** AI requirements increased by +1 level (or injected at Level 3); market adjusted by $+20 \times \text{technicalShare} - 0.10 \times \text{exposure}$.
- **Simulation Boost:** Bidirectional delta slider from -100 to +100 points.

---

## 4. Application Route Map (19 Routes)

```text
├── / (Dashboard)               → Executive briefing, 19-skill polygonal radar chart, top match card
├── /welcome                    → Public overview, architectural invariants, evaluator tour
├── /profile                    → Capability profile editor, 19 skill self-ratings, CV extraction modal
├── /assessment                 → 5-scenario conversational diagnostic wizard with staged review
├── /careers                    → 10 benchmark occupations directory, filter by industry
├── /careers/[id]               → Mathematical audit view, gap breakdown, O*NET SOC links
├── /radar                      → Trend Radar: Research activity (Hugging Face/MIT) & Workforce demand
├── /scenarios                  → Scenario Lab: Slower vs Rapid adoption toggles, simulation boost slider
├── /sdgs                       → Interactive 17 UN SDG grid, mapped occupations, capability audit
├── /roadmap                    → 4-phase structured curriculum, milestone checkoffs, export dialog
├── /progress                   → Progress dashboard, completion ScoreRing, weekly study pace simulator
├── /updates                    → Human-in-the-loop replanning review (Approve/Reject), proposal history
├── /employer                   → Enterprise workforce planning, synthetic cohort analytics, coverage matrix
├── /methodology                → Algorithmic formula disclosures, evidence separation, O*NET mappings
├── /settings                   → Dark/Light themes, reduced motion, atomic workspace purge
├── /api/cv/analyze             → Stateless ephemeral Gemini CV extraction handler with keyword fallback
└── /api/research               → Hugging Face Blog and MIT AI News RSS; server-side 60-second cache
```

### Trend evidence and refresh behavior

The Radar fetches the [Hugging Face Blog RSS](https://huggingface.co/blog/feed.xml) and [MIT AI News artificial intelligence RSS](https://news.mit.edu/rss/topic/artificial-intelligence2) on explicit user refresh and normalizes every valid feed item. The page shows results in compact pages while the activity count reflects all normalized items. Each item is attributed and linked; publication dates are shown when supplied and otherwise labelled unavailable. Some sources provide no excerpt, which the Radar says explicitly rather than inventing a summary. The server caches successful results for 60 seconds. Evidence older than six hours is marked stale; a failed refresh preserves the user’s last stored items and says they may be stale. If no successful result exists, the route reports an error and the Radar stays usable with an empty state. There is no synthetic article fallback.

Titles and short feed summaries are displayed with source links; no full article is republished. Related skills are conservative deterministic keyword matches. Article direction is always uncertain and cannot change career scores. MIT News describes its RSS as being for syndication and sets republication conditions in its [terms of use](https://news.mit.edu/terms-of-use); Hugging Face's [terms of service](https://huggingface.co/terms-of-service) govern use of its service content. This prototype links to original pages and uses only compact metadata/snippets. Feed providers may change formats or access terms.

The Scenario Lab compares Moderate and Rapid assumptions using the same profile, existing career ranking and roadmap functions. It shows changed role skill requirements/gaps and links relevant external research by matching the feeds' deterministic skill tags to the selected role's catalogued requirements. Those links are context only: research items do not change scores, role demand, or roadmap priorities.

---

## 5. Getting Started & Local Development

### Prerequisites
- Node.js `18.x` or higher (tested on Node `v20.x` and `v26.x`)
- npm `9.x` or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/ado0330/SCD-prototype2.git
cd SCD-prototype2

# Install dependencies
npm install

# (Optional) Copy environment template for Gemini API key
cp .env.example .env.local
```

> **Note:** The Gemini API key is optional for demonstrations. SKILLAX AI includes instant synthetic presets (Aina, Daniel, Kumar) and deterministic offline keyword extraction.

### Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Unit Tests
```bash
npm test
```
Executes the pure mathematical test suite verifying deterministic repeatability, scenario modifiers, workforce trend logic, and CV schema extraction.

### Production Build
```bash
npm run build
npm start
```

---

## 6. One-Click Replit Deployment

This repository includes a preconfigured `.replit` deployment manifest:
1. Import this repository directly into Replit.
2. Replit will automatically detect the configuration and execute `npm run dev -- -H 0.0.0.0 -p 3000`.
3. In Replit Secrets, optionally add `GEMINI_API_KEY` for live generative resume analysis.

---

## 7. Fast-Track Evaluator Tour

For hackathon judges and evaluators, we recommend the following 5-minute evaluation flow:

1. **Start on the Welcome Page (`/welcome`)**: Review the architectural invariants and click **Aina (Operations)** or **Daniel (Data)** to load an instant synthetic profile.
2. **Inspect the Intelligence Dashboard (`/`)**: View the 19-skill polygonal radar chart overlayed with target career requirements.
3. **Explore Career Matches (`/careers/[id]`)**: Click into any occupation (e.g. *Business Intelligence Analyst*) to inspect the formula decomposition bars.
4. **Stress-Test in the Scenario Lab (`/scenarios`)**: Toggle between *Slower*, *Moderate*, and *Rapid* adoption speeds to observe instant rank and score recalculations.
5. **Inspect the UN SDG Matrix (`/sdgs`)**: Click *SDG 8* or *SDG 9* to explore associated green-tech occupations and required skills.
6. **Track Learning Progress (`/roadmap` & `/progress`)**: Check off milestone modules and use the weekly study pace slider to project graduation timelines.
7. **Audit Replanning Proposals (`/updates`)**: Click *"Simulate Replanning Trigger"* to review before/after ranking shifts with explicit Approve/Reject human approval.
8. **Inspect Enterprise Analytics (`/employer`)**: Review cohort benchmarks across all 3 synthetic workers and the 10-role requirement coverage matrix.

---

## 8. License & Attribution

Developed for the **SDC Aiversecity Hackathon (Domain 1)**.
All occupational benchmarks reference standard task definitions from the **US Department of Labor O*NET database**.
United Nations Sustainable Development Goals content and iconography adhere to official UN Brand Guidelines.
