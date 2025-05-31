
import { Exercise } from '@/types/reformer';

export const countRealExercises = (exercises: Exercise[]): number => {
  return exercises.filter(ex => ex.category !== 'callout').length;
};

export const calculateTotalDuration = (exercises: Exercise[]): number => {
  return exercises
    .filter(ex => ex.category !== 'callout')
    .reduce((sum, ex) => sum + (ex.duration || 0), 0);
};

export const validateExerciseForSave = (exercise: Exercise): boolean => {
  return !!(exercise.id && exercise.name && exercise.category !== 'callout');
};

export const getExerciseDisplayName = (exercise: Exercise): string => {
  if (exercise.category === 'callout') {
    return exercise.name;
  }
  return `${exercise.name} (${exercise.duration}min)`;
};

export const createSectionExercise = (name: string): Exercise => ({
  id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: name || 'New Section',
  category: 'callout',
  difficulty: 'beginner',
  intensityLevel: 'low',
  duration: 0,
  muscleGroups: [],
  equipment: [],
  springs: 'none',
  isPregnancySafe: true,
  description: 'Section divider',
  cues: [],
  notes: '',
  image: '',
  videoUrl: '',
  setup: '',
  repsOrDuration: '',
  tempo: '',
  targetAreas: [],
  breathingCues: [],
  teachingFocus: [],
  modifications: [],
  progressions: [],
  regressions: [],
  transitions: [],
  contraindications: [],
  calloutColor: 'blue'
});
