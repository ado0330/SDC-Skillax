# Technical Architecture — SKILLAX AI Platform

## 1. Architectural Philosophy
SKILLAX AI is architected as a **modular, database-free, deterministic Single-Page / Server-Rendered hybrid Web Application** built on Next.js. It decouples mathematical domain logic from presentation and server boundaries, ensuring pure reproducibility, easy unit testing, and friction-free deployment on both local Antigravity environments and Replit.

---

## 2. Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| **Framework** | Next.js (App Router, React 19 / 18, TypeScript) | Unified API routes and UI, fast builds, zero-config deployment. |
| **Styling** | Tailwind CSS + CSS Variables | High-density "Career OS" design system, dark/light themes, custom chart tokens. |
| **Validation** | Zod (`zod`) | Runtime schema validation for API inputs, CSV/JSON datasets, and Gemini outputs. |
| **AI Integration** | `@google/genai` | Official Google GenAI SDK for Gemini 2.5/Flash CV extraction. |
| **Icons & Charts** | `lucide-react`, Custom SVG components | Lightweight, no heavy canvas/D3 dependencies, pixel-perfect responsiveness. |
| **Persistence** | React State + `localStorage` | Complies with strict No-Database constraint while supporting demo sessions. |

---

## 3. Directory & Module Boundaries

```
├── AGENTS.md                  # Persistent instructions for AI coding agents
├── docs/                      # Persistent project memory & references
│   ├── PROJECT_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── TASKS.md
│   ├── PROGRESS_LOG.md
│   ├── DECISIONS.md
│   ├── HANDOFF.md
│   └── reference/             # Reverse-engineering spec & features.json
├── lib/
│   ├── domain/                # Pure deterministic business logic (zero UI/API dependencies)
│   │   ├── scoring.ts         # 4- and 5-component career matching math
│   │   ├── scenarios.ts       # Slower, Moderate, Rapid scenario modifiers
│   │   ├── gaps.ts            # Shortfall calculation and ordering
│   │   ├── roadmap.ts         # 4-phase gap-based pathway generator
│   │   ├── workforce.ts       # Comparability, trend thresholding, series linking
│   │   └── types.ts           # Core domain entity types
│   ├── schemas/               # Zod validation schemas
│   │   ├── profile.ts         # User profile, skills, constraints
│   │   ├── cv.ts              # CV extraction input/output contracts
│   │   ├── workforce.ts       # Workforce dataset schema
│   │   └── evidence.ts        # Research signal schemas
│   ├── data/                  # Static catalogues and synthetic seeds
│   │   ├── skills.ts          # 19 standard skills with categories & SDGs
│   │   ├── roles.ts           # 10 catalogued occupations with requirements & O*NET
│   │   ├── sdgs.ts            # 17 UN SDGs with brand colors and definitions
│   │   ├── learningResources.ts # Curated free public learning resources
│   │   ├── fallbackSignals.ts # Seed research signals (Hugging Face / MIT)
│   │   ├── initialWorkforce.ts # Synthetic workforce baseline observations
│   │   ├── syntheticWorkers.ts # 3 demo cohort profiles (Aina, Daniel, Kumar)
│   │   └── sampleCvs.ts       # Synthetic CV presets for one-click intake
│   ├── ai/                    # Gemini integration (server-only)
│   │   ├── geminiClient.ts    # Initializer with API key check
│   │   ├── cvExtractor.ts     # Ephemeral CV parsing & schema normalization
│   │   └── keywordExtractor.ts # Deterministic offline text intake fallback
│   └── workspace/             # Client-side state & persistence
│       ├── WorkspaceContext.tsx # Central React Context providing state & mutations
│       └── useWorkspace.ts    # Easy ergonomic hook
├── app/                       # Next.js App Router
│   ├── api/                   # Stateless server endpoints
│   │   ├── cv/analyze/route.ts # Ephemeral PDF/text CV extraction
│   │   ├── research/route.ts  # RSS feed retrieval & caching
│   │   └── workforce/parse/route.ts # Ingest & validate custom datasets
│   ├── layout.tsx             # Root layout with fonts, theme, & WorkspaceProvider
│   ├── page.tsx               # Intelligence Dashboard (/)
│   ├── welcome/page.tsx       # Landing & overview (/welcome)
│   ├── profile/page.tsx       # Skills profile editor (/profile)
│   ├── assessment/page.tsx    # 5-step conversational wizard (/assessment)
│   ├── radar/page.tsx         # Trend Radar & Workforce demand (/radar)
│   ├── careers/
│   │   ├── page.tsx           # Career matches directory (/careers)
│   │   └── [id]/page.tsx      # Detailed career match & audit (/careers/:id)
│   ├── scenarios/page.tsx     # Scenario testing lab (/scenarios)
│   ├── sdgs/page.tsx          # 17 UN SDGs matrix (/sdgs)
│   ├── roadmap/page.tsx       # 4-phase learning pathway (/roadmap)
│   ├── progress/page.tsx      # Milestone progress & effort analytics (/progress)
│   ├── updates/page.tsx       # Replanning review & audit log (/updates)
│   ├── employer/page.tsx      # Cohort capability & shortfall view (/employer)
│   ├── methodology/page.tsx   # Algorithmic disclosures & formulas (/methodology)
│   └── settings/page.tsx      # Theme toggle & workspace reset (/settings)
└── components/                # Reusable UI presentation components
    ├── AppShell.tsx           # Global sidebar, topbar, mobile drawer
    ├── PageHeader.tsx         # Category eyebrow, title, action slot
    ├── Panel.tsx              # Card panel with border and optional glow
    ├── ScoreRing.tsx          # Animated SVG score circular ring
    ├── LevelDots.tsx          # 5-pill proficiency indicator
    ├── RadarChart.tsx         # SVG polygonal radar chart for 19 skills
    ├── BarCharts.tsx          # Grouped and stacked horizontal/vertical bars
    ├── SdgBadge.tsx           # UN SDG badge with WCAG luminance text
    └── Modals/                # Dialogs: CV Intake, Export Plan, Reset, etc.
```

---

## 4. Data Flow Architecture

### 4.1 Career Match Calculation Flow
```
User Profile (Skills 0-5, Interests)
     +
Scenario Settings (Slower / Moderate / Rapid, Boost)
     +
Active Research Signals (HF / MIT mentions)
     +
Eligible Workforce Series (Time-series trend)
     │
     ▼
[lib/domain/scoring.ts] (Pure Function)
     │
     ├── Direct Skills Alignment (50%)
     ├── Transferable Category Alignment (20%)
     ├── Industry & Role Interest Fit (15%)
     ├── Research Activity Index (15%)
     └── Optional Workforce Trend Indicator (10% scale)
     │
     ▼
Match Results [10 Occupations Ranked]
     ├── Scores (0-100) & Subcomponent Breakdowns
     ├── Shortfall Gaps & Missing Skills
     └── Estimated Learning Hours
```

### 4.2 Consented CV Extraction Flow
```
User Uploads Synthetic PDF / Pastes Text
     │
     ▼
Consent Check (Both tickboxes required)
     │
     ▼
POST /api/cv/analyze (Ephemeral Memory Buffer Only)
     │
     ├── [Mode: Gemini] -> @google/genai structured JSON extraction
     └── [Mode: Fallback/Offline] -> Deterministic keyword rules / synthetic preset
     │
     ▼
Server zeros memory buffer (No disk/db persistence)
     │
     ▼
Client receives extraction proposal
     │
     ▼
Human-in-the-Loop Review Dialog (User edits / rejects / confirms)
     │
     ▼
Merged into Active Profile Draft (Client State)
```

---

## 5. Security & Verification Strategy
- **API Secrets:** Server-side `process.env.GEMINI_API_KEY` only; `.env.local` git-ignored.
- **Input Sanitization:** All string inputs trimmed; numeric bounds strictly enforced.
- **Unit Tests:** Dedicated test suite for `lib/domain/` pure math functions.
