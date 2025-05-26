
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  duration: number; // in minutes
  springs: SpringSetting;
  difficulty: DifficultyLevel;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  description?: string;
  transitions?: string[];
  contraindications?: string[];
}

export interface ClassPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  totalDuration: number;
  createdAt: Date;
  notes?: string;
}

export type ExerciseCategory = 
  | 'warm-up'
  | 'standing'
  | 'supine'
  | 'prone'
  | 'sitting'
  | 'side-lying'
  | 'kneeling'
  | 'cool-down';

export type SpringSetting = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'mixed';

export type DifficultyLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced';

export type MuscleGroup = 
  | 'core'
  | 'legs'
  | 'arms'
  | 'back'
  | 'glutes'
  | 'shoulders'
  | 'full-body';

export type Equipment = 
  | 'straps'
  | 'weights'
  | 'magic-circle'
  | 'theraband'
  | 'none';
