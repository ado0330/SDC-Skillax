import { z } from "zod";

export const CvExtractionOutputSchema = z.object({
  name: z.string().default(""),
  occupation: z.string().default(""),
  industry: z.string().default("Business & Services"),
  education: z.string().default(""),
  experience: z.number().int().min(0).max(60).default(0),
  professionalSummary: z.string().default(""),
  experienceSummary: z.string().default(""),
  skills: z.record(z.string(), z.number().int().min(1).max(5)).default({}),
  interests: z.array(z.string()).default([]),
  additionalSkills: z.array(
    z.object({
      name: z.string(),
      level: z.number().int().min(1).max(5),
    })
  ).default([]),
  extractionMethod: z.enum(["gemini", "keyword_fallback", "synthetic_sample"]),
});

export type CvExtractionOutput = z.infer<typeof CvExtractionOutputSchema>;
