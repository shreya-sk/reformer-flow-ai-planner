
import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string().min(2, "Exercise name must be at least 2 characters"),
  category: z.enum([
    'supine', 'prone', 'sitting', 'side-lying', 'kneeling', 'standing', 
    'warm-up', 'cool-down', 'callout', 'other'
  ]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  springs: z.enum(['light', 'medium', 'heavy', 'mixed', 'none']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  intensityLevel: z.enum(['low', 'medium', 'high']),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  notes: z.string().optional(),
  cues: z.array(z.string()).optional(),
  setup: z.string().optional(),
  repsOrDuration: z.string().optional(),
  tempo: z.string().optional(),
  targetAreas: z.array(z.string()).optional(),
  breathingCues: z.array(z.string()).optional(),
  teachingFocus: z.array(z.string()).optional(),
  modifications: z.array(z.string()).optional(),
  progressions: z.array(z.string()).optional(),
  regressions: z.array(z.string()).optional(),
  transitions: z.array(z.string()).optional(),
  contraindications: z.array(z.string()).optional(),
  isPregnancySafe: z.boolean().optional(),
});
