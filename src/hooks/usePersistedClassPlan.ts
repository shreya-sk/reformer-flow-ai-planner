
import { useState, useEffect, useCallback } from 'react';
import { ClassPlan, Exercise } from '@/types/reformer';
import { v4 as uuidv4 } from 'uuid';

const CLASS_PLAN_STORAGE_KEY = 'currentClassPlan';

export const usePersistedClassPlan = () => {
  const [currentClassPlan, setCurrentClassPlan] = useState<ClassPlan>(() => {
    const stored = localStorage.getItem(CLASS_PLAN_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt)
        };
      } catch (error) {
        console.error('Error parsing stored class plan:', error);
      }
    }
    
    return {
      id: uuidv4(),
      name: '',
      description: '',
      duration: 45,
      exercises: [],
      tags: [],
      notes: '',
      difficultyLevel: 'beginner' as const,
      isPublic: false,
      userId: '',
      viewCount: 0,
      copyCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  // Sync with localStorage whenever the class plan changes
  useEffect(() => {
    localStorage.setItem(CLASS_PLAN_STORAGE_KEY, JSON.stringify(currentClassPlan));
  }, [currentClassPlan]);

  const updateClassPlan = useCallback((updates: Partial<ClassPlan>) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

  const updateClassName = useCallback((name: string) => {
    updateClassPlan({ name });
  }, [updateClassPlan]);

  const updateClassDuration = useCallback((duration: number) => {
    updateClassPlan({ duration });
  }, [updateClassPlan]);

  const updateClassNotes = useCallback((notes: string) => {
    updateClassPlan({ notes });
  }, [updateClassPlan]);

  const updateClassImage = useCallback((imageUrl: string) => {
    updateClassPlan({ imageUrl });
  }, [updateClassPlan]);

  const addExercise = useCallback((exercise: Exercise) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
      updatedAt: new Date()
    }));
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
      updatedAt: new Date()
    }));
  }, []);

  const reorderExercises = useCallback((exercises: Exercise[]) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      exercises,
      updatedAt: new Date()
    }));
  }, []);

  const updateExercise = useCallback((exerciseId: string, updates: Partial<Exercise>) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      ),
      updatedAt: new Date()
    }));
  }, []);

  const clearClassPlan = useCallback(() => {
    const newPlan = {
      id: uuidv4(),
      name: '',
      description: '',
      duration: 45,
      exercises: [],
      tags: [],
      notes: '',
      difficultyLevel: 'beginner' as const,
      isPublic: false,
      userId: '',
      viewCount: 0,
      copyCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentClassPlan(newPlan);
    localStorage.removeItem(CLASS_PLAN_STORAGE_KEY);
  }, []);

  const loadClass = useCallback((classPlan: ClassPlan) => {
    setCurrentClassPlan({
      ...classPlan,
      createdAt: new Date(classPlan.createdAt),
      updatedAt: new Date(classPlan.updatedAt)
    });
  }, []);

  const syncExerciseUpdates = useCallback((updatedExercise: Exercise) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
      updatedAt: new Date()
    }));
  }, []);

  const createCallout = useCallback((text: string, color: string, duration: number = 0) => {
    const calloutExercise: Exercise = {
      id: uuidv4(),
      name: text,
      category: 'callout',
      position: 'other',
      primaryMuscle: 'core',
      duration: duration,
      springs: 'none',
      difficulty: 'beginner',
      intensityLevel: 'low',
      muscleGroups: [],
      equipment: [],
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
      isPregnancySafe: true,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addExercise(calloutExercise);
  }, [addExercise]);

  const addCallout = useCallback((name: string, position: number) => {
    const calloutExercise: Exercise = {
      id: uuidv4(),
      name: name,
      category: 'callout',
      position: 'other',
      primaryMuscle: 'core',
      duration: 0,
      springs: 'none',
      difficulty: 'beginner',
      intensityLevel: 'low',
      muscleGroups: [],
      equipment: [],
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
      isPregnancySafe: true,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCurrentClassPlan(prev => {
      const exercises = [...prev.exercises];
      exercises.splice(position, 0, calloutExercise);
      return {
        ...prev,
        exercises,
        updatedAt: new Date()
      };
    });
  }, []);

  const getRealExerciseCount = useCallback(() => {
    return currentClassPlan.exercises.filter(ex => ex.category !== 'callout').length;
  }, [currentClassPlan.exercises]);

  // Alias for backward compatibility
  const currentClass = currentClassPlan;

  return {
    currentClassPlan,
    currentClass,
    updateClassPlan,
    updateClassName,
    updateClassDuration,
    updateClassNotes,
    updateClassImage,
    addExercise,
    removeExercise,
    reorderExercises,
    updateExercise,
    clearClassPlan,
    loadClass,
    syncExerciseUpdates,
    createCallout,
    addCallout,
    getRealExerciseCount
  };
};
