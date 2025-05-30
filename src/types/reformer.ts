
export type ExerciseCategory =
  | 'supine'
  | 'prone'
  | 'sitting'
  | 'side-lying'
  | 'kneeling'
  | 'standing'
  | 'warm-up'
  | 'cool-down'
  | 'callout'
  | 'other';

export type SpringSetting = 'light' | 'medium' | 'heavy' | 'mixed' | 'none';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type IntensityLevel = 'low' | 'medium' | 'high';

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
  | 'upper-abs'
  | 'obliques'
  | 'transverse-abdominis'
  | 'traps'
  | 'deltoids'
  | 'biceps'
  | 'triceps'
  | 'lats'
  | 'chest'
  | 'rhomboids'
  | 'erector-spinae'
  | 'hip-flexors'
  | 'adductors'
  | 'abductors'
  | 'pelvic-floor'
  | 'deep-stabilizers'
  | 'spinal-extensors'
  | 'neck'
  | 'forearms'
  | 'wrists'
  | 'ankles'
  | 'feet'
  | 'hip-abductors'
  | 'hip-adductors'
  | 'rotator-cuff'
  | 'serratus-anterior'
  | 'psoas'
  | 'iliotibial-band'
  | 'thoracic-spine'
  | 'lumbar-spine'
  | 'cervical-spine'
  | 'diaphragm'
  | 'intercostals';

export type Equipment =
  | 'reformer'
  | 'mat'
  | 'magic-circle'
  | 'weights'
  | 'resistance-band'
  | 'foam-roller'
  | 'pilates-ball'
  | 'bosu-ball'
  | 'chair'
  | 'cadillac'
  | 'straps'
  | 'theraband'
  | 'soft-ball'
  | 'short-box'
  | 'long-box'
  | 'jump-board'
  | 'platform-extender'
  | 'tower'
  | 'pole'
  | 'none'
  | 'other';

export type TeachingFocus =
  | 'alignment'
  | 'core-engagement'
  | 'breath'
  | 'precision'
  | 'control'
  | 'flow'
  | 'stability'
  | 'mobility'
  | 'balance'
  | 'strength'
  | 'coordination';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  duration: number;
  springs: SpringSetting;
  difficulty: DifficultyLevel;
  intensityLevel: 'low' | 'medium' | 'high';
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  description: string;
  image: string;
  videoUrl: string;
  notes: string;
  cues: string[];
  setup: string;
  repsOrDuration: string;
  tempo: string;
  targetAreas: string[];
  breathingCues: string[];
  teachingFocus: TeachingFocus[];
  modifications: string[];
  progressions: string[];
  regressions: string[];
  transitions: string[];
  contraindications: string[];
  isPregnancySafe: boolean;
  isCustom?: boolean;
  isSystemExercise?: boolean;
  isCustomized?: boolean;
  calloutColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassPlan {
  id: string;
  name: string;
  description?: string;
  duration: number;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  notes?: string;
  difficultyLevel?: DifficultyLevel;
  isPublic?: boolean;
  shareToken?: string;
  userId?: string;
  viewCount?: number;
  copyCount?: number;
  imageUrl?: string;
}

export interface CustomCallout {
  id: string;
  text: string;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  duration: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}
