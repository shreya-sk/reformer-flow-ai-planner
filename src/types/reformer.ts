export type ExerciseCategory =
  | 'supine'
  | 'prone'
  | 'sitting'
  | 'side-lying'
  | 'kneeling'
  | 'standing'
  | 'other';

export type SpringSetting = 'light' | 'medium' | 'heavy' | 'mixed';

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
  | ' кадаillac'
  | 'other';

export type TeachingFocus =
  | 'alignment'
  | 'core-engagement'
  | 'breath'
  | 'precision'
  | 'control'
  | 'flow'
  | 'stability'
  | 'mobility';

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
}
