import { z } from "zod";

export const ResearchSignalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  source: z.string().min(1),
  sourceUrl: z.string().url().refine((value) => /^https?:\/\//i.test(value)),
  publishedAt: z.string().datetime().nullable(),
  retrievedAt: z.string().datetime(),
  mode: z.enum(["live", "cached", "synthetic"]),
  observation: z.string(),
  skillIds: z.array(z.string()),
  direction: z.literal("Research activity"),
  trendDirection: z.enum(["rising", "falling", "uncertain"]),
  evidenceType: z.enum(["external", "synthetic", "inference"]),
  limitations: z.string(),
});

export type ResearchSignalInput = z.infer<typeof ResearchSignalSchema>;
