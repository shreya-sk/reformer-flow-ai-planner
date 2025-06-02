
import { Exercise } from '@/types/reformer';

export const createSectionBreak = (text: string, color: string = '#e5e7eb'): Exercise => {
  return {
    id: `section-${Date.now()}`,
    name: text,
    category: 'callout',
    position: 'other',
    primaryMuscle: 'core',
    difficulty: 'beginner',
    intensityLevel: 'low',
    duration: 1,
    muscleGroups: [],
    equipment: [],
    springs: 'none',
    isPregnancySafe: true,
    description: '',
    image: '',
    videoUrl: '',
    notes: '',
    cues: [],
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
    calloutColor: color,
    isCustom: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const createSectionExercise = (text: string, color: string = '#e5e7eb'): Exercise => {
  return createSectionBreak(text, color);
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const calculateClassDuration = (exercises: Exercise[]): number => {
  return exercises.reduce((total, exercise) => total + exercise.duration, 0);
};

export const calculateTotalDuration = (exercises: Exercise[]): number => {
  return calculateClassDuration(exercises);
};

export const countRealExercises = (exercises: Exercise[]): number => {
  return exercises.filter(exercise => exercise.category !== 'callout').length;
};

export const groupExercisesByCategory = (exercises: Exercise[]) => {
  return exercises.reduce((groups, exercise) => {
    const category = exercise.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(exercise);
    return groups;
  }, {} as Record<string, Exercise[]>);
};
