import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name before saving your profile.").max(100),
  occupation: z.string().max(200).default(""),
  industry: z.string().max(100).default("Business & Services"),
  education: z.string().max(200).default(""),
  experience: z.number().int().min(0).max(60).default(0),
  weeklyHours: z.number().int().min(1).max(80).default(10),
  budget: z.number().int().min(0).default(0),
  language: z.string().default("English"),
  professionalSummary: z.string().max(1500).default(""),
  experienceSummary: z.string().max(3000).default(""),
  skills: z.record(z.string(), z.number().int().min(0).max(5)).default({}),
  interests: z.array(z.string()).default([]),
  additionalSkills: z.array(
    z.object({
      name: z.string().max(100),
      level: z.number().int().min(0).max(5),
    })
  ).max(60).default([]),
  targetRoleId: z.string().optional(),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
