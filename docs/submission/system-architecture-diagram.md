# SKILLAX AI System Architecture

Architecture reconstructed from the repository as reviewed on 24 October 2026. Solid components are present in code; Gemini is conditional on server configuration. There is no database or confirmed public hosting service.

```mermaid
flowchart LR
  subgraph Browser[User browser]
    UI[Next.js and React interface]
    Context[React workspace context]
    LS[(localStorage: skillax_workspace_v2)]
    UI <--> Context
    Context <--> LS
  end

  subgraph AppServer[Next.js server]
    CV[POST /api/cv/analyze]
    Research[GET /api/research]
    Fallback[Keyword extraction fallback]
    Cache[Ephemeral in-memory RSS cache]
  end

  Gemini[Google Gemini API<br/>optional, model from GEMINI_MODEL]
  HFRSS[Hugging Face Blog RSS]
  MITRSS[MIT AI News RSS]
  subgraph InBrowser[Client-side deterministic intelligence]
    Score[Career scores and rankings]
    Gap[Skill-gap calculations]
    Roadmap[Roadmap generation]
  end
  Synthetic[Bundled synthetic workforce observations<br/>or user-imported observations]

  UI -->|CV text or PDF| CV
  CV -->|when key configured| Gemini
  Gemini -->|structured extraction| CV
  CV -->|when key absent or call fails| Fallback
  CV -->|proposal for review| UI
  Context --> Score
  Score --> Gap --> Roadmap
  Synthetic --> Score
  UI --> Research
  Research --> Cache
  Cache --> HFRSS
  Cache --> MITRSS
  Research -->|live research metadata or bundled fallback| UI
```

## Data boundaries

- **Browser persistence:** Profile fields, ratings, scenario, imported workforce observations, saved roadmap, milestone completion and recommendation history are stored in `localStorage`. The app has no database integration.
- **CV path:** The route accepts a PDF up to 10 MB or pasted text. If Gemini is configured, content is sent to Google. The code calls `fileBuffer.fill(0)` after successful file extraction; there is no `finally` cleanup for all error paths, and this is not evidence of provider-side deletion.
- **Research path:** RSS items indicate technical research/news activity, not vacancies, wages or workforce demand. Workforce-series data are synthetic by default or imported by a user.
- **Hosting:** `.replit` contains Replit configuration; no live service URL is verified. Do not treat `localhost:3000` as judge-accessible.

