# Project Context — SKILLAX AI Platform

## 1. Executive Summary & Purpose
**SKILLAX AI** is an explainable, deterministic career intelligence and lifelong learning operating system built for the Malaysian workforce under the **SDC Aiversecity Future-Ready Workforce (Domain 1)** challenge.

Traditional AI career advisory systems often suffer from:
1. Hallucinatory and unexplainable black-box recommendations.
2. Inaccurate or fabricated labour market statistics.
3. Silent overwriting of user-curated learning roadmaps.

SKILLAX AI solves this with:
- **Purely deterministic mathematical career matching** across 10 benchmark O*NET occupations.
- **Consented, ephemeral Gemini AI CV extraction** with user verification gates and offline synthetic fallbacks.
- **Strictly separated evidence paths:** Public technical research feeds (Hugging Face & MIT AI News) vs. time-series workforce demand data with statistical comparability rules.
- **Gap-based 4-phase actionable roadmaps** linked to free, public learning hubs with preserved completion states.
- **Scenario sensitivity testing** across Slower, Moderate, and Rapid AI adoption pathways plus hypothetical simulation adjustments.
- **Full alignment to all 17 United Nations Sustainable Development Goals (SDGs)**.
- **Synthetic cohort analytics for workforce planners** without individual screening or hiring selection.

---

## 2. Target Users & Personas
1. **Malaysian Workers & Mid-Career Changers:** Assessing AI impact, mapping skill levels (0–5), and tracking self-paced upskilling.
2. **Recent Graduates & Job Seekers:** Identifying transferable strengths, high-demand gaps, and transition roadmaps.
3. **Workforce Planners & Educational Institutions:** Reviewing aggregate capabilities and training shortfalls across synthetic cohorts (planning only; no candidate screening).

---

## 3. Mandatory Scope & Core Journeys (6 Mandatory Domain 1 Capabilities)
1. **Profile Capture:** Manual proficiency rating across 19 standard skills + consented Gemini CV extraction + offline sample CVs.
2. **Identifiable Evidence:** Live RSS research signals (Hugging Face / MIT) & time-series workforce demand with source/date attribution.
3. **Explainable Matching:** 4- or 5-part mathematical formula decomposing direct skills (50%), transferable alignment (20%), interest fit (15%), research activity (15%), and workforce demand (10%).
4. **Reskilling Pathway:** Ordered 4-phase learning pathway with estimated effort hours, milestone checkoffs, and PDF/JSON export.
5. **SDG Footprint:** Deep mapping of all 10 occupations and 19 skills to UN SDGs 1–17.
6. **Scenario Testing:** Dynamic re-scoring across Slower, Moderate, and Rapid AI adoption with sensitivity boost slider (-100 to +100).

---

## 4. Key Constraints & Non-Negotiables
- **No Database:** Ephemeral server execution + client-side state / localStorage demo persistence. Zero SQL/NoSQL databases.
- **No Hallucinated Scoring:** Career scoring is 100% deterministic code. LLM is never used for calculating match percentages.
- **Human in the Loop:** Extracted CV skills require user approval before merging into draft. Roadmap replanning requires user approval before updating.
- **Synthetic Data for Hackathon:** Use synthetic CVs and synthetic workforce datasets; non-synthetic evidence requires verifiable HTTPS attribution.
- **Replit & GitHub Deployment:** Standalone Next.js app running on Node.js / port 3000.

---

## 5. Reference Documents
- Reverse-Engineering Specification: [`docs/reference/product_reverse_engineering_spec.md`](file:///Users/jasonkhaw/Documents/USM/Hackathon/SDC%20Xiamen/SCD-prototype2/docs/reference/product_reverse_engineering_spec.md)
- Complete 52-Feature Catalog: [`docs/reference/features.json`](file:///Users/jasonkhaw/Documents/USM/Hackathon/SDC%20Xiamen/SCD-prototype2/docs/reference/features.json)
