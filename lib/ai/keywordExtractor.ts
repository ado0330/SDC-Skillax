import { CvExtractionOutput } from "../schemas/cv";
import { SKILLS_CATALOG } from "../data/skills";

const SKILL_KEYWORD_MAP: Record<string, string[]> = {
  communication: ["communication", "stakeholder", "presentation", "briefing", "report writing", "public speaking"],
  organization: ["project coordination", "project management", "scrum", "agile", "jira", "sprint", "scheduling", "coordination"],
  ethics: ["responsible ai", "ethics", "ai governance", "bias", "fairness", "privacy compliance", "pdpa"],
  design: ["user research", "ui/ux", "ux design", "wireframing", "figma", "prototyping", "usability"],
  teaching: ["training", "facilitation", "mentoring", "curriculum", "coaching", "instructor", "workshop"],
  excel: ["excel", "spreadsheets", "pivot table", "vlookup", "power query", "macros", "vba"],
  analysis: ["data analysis", "analytics", "statistics", "statistical", "data modeling", "dashboard", "power bi", "tableau"],
  ai: ["generative ai", "ai literacy", "prompt engineering", "llm", "chatgpt", "gemini", "claude"],
  sustainability: ["sustainability", "esg", "greenhouse gas", "carbon footprint", "lifecycle analysis", "sdg"],
  health: ["health informatics", "healthcare data", "clinical metrics", "biomedical", "ehr", "hipaa"],
  python: ["python", "pandas", "numpy", "django", "fastapi", "flask", "jupyter"],
  sql: ["sql", "postgresql", "mysql", "relational database", "queries", "indexing", "sqlite"],
  ml: ["machine learning", "deep learning", "neural network", "scikit-learn", "tensorflow", "pytorch"],
  automation: ["workflow automation", "rpa", "uipath", "webhook", "ci/cd", "zapier", "automation pipeline"],
  maintenance: ["equipment maintenance", "preventative maintenance", "troubleshooting", "diagnostics", "calibration", "machinery"],
  iot: ["industrial iot", "iot", "sensor", "mqtt", "telemetry", "microcontroller", "arduino", "raspberry pi"],
  cloud: ["cloud computing", "aws", "azure", "google cloud", "docker", "kubernetes", "cloud infrastructure"],
  security: ["cybersecurity", "information security", "vulnerability", "firewall", "iam", "threat modeling"],
  agriculture: ["precision agriculture", "crop monitoring", "soil sensor", "agritech", "fertilizer dispersion", "ndvi"],
};

/**
 * Deterministic keyword text extraction for offline resume parsing.
 */
export function extractSkillsByKeywords(text: string): CvExtractionOutput {
  const lower = text.toLowerCase();
  const detectedSkills: Record<string, number> = {};

  for (const [skillId, keywords] of Object.entries(SKILL_KEYWORD_MAP)) {
    let hitCount = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        hitCount++;
      }
    }
    if (hitCount > 0) {
      // Scale rating: 1 hit = level 2; 2 hits = level 3; >= 3 hits = level 4
      const level = Math.min(4, Math.max(2, hitCount + 1));
      detectedSkills[skillId] = level;
    }
  }

  // Attempt heuristic extraction of name, experience, occupation
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const guessedName = lines.length > 0 ? lines[0].slice(0, 80) : "";

  let guessedExp = 2;
  const expMatch = lower.match(/(\d+)\s*\+?\s*(years?|yrs?)/);
  if (expMatch && expMatch[1]) {
    const val = parseInt(expMatch[1]);
    if (!isNaN(val) && val >= 0 && val <= 60) {
      guessedExp = val;
    }
  }

  return {
    name: guessedName,
    occupation: "Professional",
    industry: "Business & Services",
    education: "Undergraduate Degree",
    experience: guessedExp,
    professionalSummary: lines.slice(1, 4).join(" ").slice(0, 500),
    experienceSummary: text.slice(0, 1000),
    skills: detectedSkills,
    interests: ["Business & Services", "Technology"],
    additionalSkills: [],
    extractionMethod: "keyword_fallback",
  };
}
