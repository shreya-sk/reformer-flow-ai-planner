
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  duration?: number; // in minutes - optional for flexible timing
  repsOrDuration?: string; // "10 reps" or "30 sec" - more flexible
  springs: SpringSetting;
  difficulty: DifficultyLevel;
  intensityLevel: IntensityLevel;
  muscleGroups: MuscleGroup[];
  targetAreas?: string[]; // more specific than muscle groups
  equipment: Equipment[];
  description?: string;
  image?: string;
  videoUrl?: string;
  animationPreview?: string; // GIF or static image
  notes?: string;
  cues?: string[]; // AI generated, anatomical but client friendly
  tempo?: string; // optional tempo instructions
  transitions?: string[];
  contraindications?: string[];
  progressions?: string[]; // harder variations
  regressions?: string[]; // easier/assisted versions
  isPregnancySafe?: boolean;
  teachingFocus?: TeachingFocus[]; // alignment, breath, flow, etc.
  
  // Custom exercise metadata
  isCustom?: boolean;
  createdBy?: string; // user attribution for custom exercises
  
  // Set grouping (optional)
  parentSetId?: string; // for nested sets like "Hands in Straps"
  setOrder?: number;
  setName?: string;
  
  // Auto-generated insights
  usageFrequency?: number;
  lastUsed?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  sections?: ClassSection[];
  totalDuration: number;
  createdAt: Date;
  notes?: string;
}

export interface ClassSection {
  id: string;
  name: string;
  exercises: Exercise[];
  isCollapsed?: boolean;
}

export type ExerciseCategory = 
  | 'warm-up'
  | 'standing'
  | 'supine'
  | 'prone'
  | 'sitting'
  | 'side-lying'
  | 'kneeling'
  | 'cool-down'
  | 'callout'; // Keep callout for organizational structure

export type SpringSetting = string; // Now supports multiple springs like "1.5,2" or "red,yellow"

export type DifficultyLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced';

export type IntensityLevel = 
  | 'low'
  | 'medium' 
  | 'high';

export type MuscleGroup = 
  | 'core'
  | 'legs'
  | 'arms'
  | 'back'
  | 'glutes'
  | 'shoulders'
  | 'full-body'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'lower-abs'
  | 'obliques'
  | 'traps'
  | 'deltoids'
  | 'biceps'
  | 'triceps'
  | 'lats'
  | 'chest'
  | 'hip-flexors';

export type Equipment = 
  | 'straps'
  | 'weights'
  | 'magic-circle'
  | 'theraband'
  | 'none';

export type TeachingFocus =
  | 'alignment'
  | 'breath'
  | 'flow'
  | 'stability'
  | 'balance'
  | 'strength'
  | 'mobility'
  | 'coordination';
