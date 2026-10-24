import { getGeminiClient } from "./geminiClient";
import { extractSkillsByKeywords } from "./keywordExtractor";
import { CvExtractionOutput, CvExtractionOutputSchema } from "../schemas/cv";
import { SKILLS_CATALOG } from "../data/skills";

const SKILLS_PROMPT_REFERENCE = SKILLS_CATALOG.map(
  (s) => `- ${s.id} (${s.name}, ${s.category}): ${s.description}`
).join("\n");

const EXTRACTION_SYSTEM_INSTRUCTION = `
You are an expert career advisory intelligence agent for SKILLAX AI, analyzing synthetic resumes for the Malaysian workforce.
Your task is to extract and structure candidate capabilities into standardized JSON.

The platform recognizes exactly 19 standard matching catalogue skills (rated from discrete level 1 to 5):
${SKILLS_PROMPT_REFERENCE}

Proficiency Rubric:
- Level 1: Novice / Aware of foundational concepts.
- Level 2: Elementary / Practical usage under supervision or guided course.
- Level 3: Intermediate / Autonomous execution on real-world tasks.
- Level 4: Advanced / Complex problem-solving, architectural design.
- Level 5: Expert / Mentorship, cross-functional leadership, published mastery.

Output format MUST be a single valid JSON object with these keys:
{
  "name": "Full Name",
  "occupation": "Current or recent job title",
  "industry": "Business & Services | Technology | Manufacturing | Sustainability | Health | Agriculture",
  "education": "Highest degree, institution, and year",
  "experience": 0 to 60 (integer years of professional experience),
  "professionalSummary": "Concise 2-sentence summary of professional strengths",
  "skills": {
    "skill_id": 1 to 5 (only include skills with evidence in the resume)
  },
  "interests": ["Array of career interest sectors or domains"],
  "additionalSkills": [
    {"name": "Specialized skill not in the 19 standard catalogue", "level": 1 to 5}
  ]
}

DO NOT include markdown wrappers like \`\`\`json. Output raw JSON only.
`;

/**
 * Extracts structured capability proposals from CV text using Gemini 2.5 Flash,
 * with deterministic keyword fallback.
 */
export async function extractCvData(cvText: string): Promise<CvExtractionOutput> {
  const gemini = getGeminiClient();

  if (!gemini) {
    // Zero-config / offline fallback
    return extractSkillsByKeywords(cvText);
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: EXTRACTION_SYSTEM_INSTRUCTION },
            { text: `Resume Content to Analyze:\n${cvText}` },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1, // low temperature for deterministic structure
      },
    });

    const candidateText = response.text?.trim() || "";
    // Clean potential markdown blocks
    const cleanedText = candidateText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsedJson = JSON.parse(cleanedText);
    const validated = CvExtractionOutputSchema.parse({
      ...parsedJson,
      extractionMethod: "gemini",
    });

    return validated;
  } catch (error) {
    console.warn("Gemini CV extraction failed or timed out, falling back to keyword extractor:", error);
    return extractSkillsByKeywords(cvText);
  }
}
