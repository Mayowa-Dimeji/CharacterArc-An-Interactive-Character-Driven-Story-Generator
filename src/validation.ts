import { z } from "zod";

export const goalSchema = z.object({
  id: z.string(),
  text: z.string().min(3, "Goal must be at least 3 chars"),
  priority: z.number().min(1).max(5),
});

export const fearSchema = z.object({
  id: z.string(),
  text: z.string().min(3, "Fear must be at least 3 chars"),
  intensity: z.number().min(0).max(1),
});

export const relationshipSchema = z.object({
  id: z.string(),
  name: z.string(),
  stance: z.enum(["ally", "rival", "unknown"]),
  trust: z.number().min(0).max(1),
});

export const characterSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name is required"),
  archetype: z.string().min(2, "Archetype is required"),
  traits: z.array(z.string().min(1)).min(1, "At least one trait"),
  goals: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(3),
        priority: z.number().min(1).max(5),
      })
    )
    .min(1),
  fears: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(3),
        intensity: z.number().min(0).max(1),
      })
    )
    .min(1),

  relationships: z.array(relationshipSchema).default([]),
  worldview: z.string().min(5),
  growth_theme: z.string().min(3),

  history: z.array(z.string()).default([]),
});

export type CharacterForm = z.infer<typeof characterSchema>;
