import { useState, useEffect, useCallback } from 'react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { v4 as uuidv4 } from 'uuid';

export const usePersistedClassPlan = () => {
  const [currentClassPlan, setCurrentClassPlan] = useState<ClassPlan>({
    id: uuidv4(),
    name: 'New Class Plan',
    description: '',
    duration: 45,
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    notes: ''
  });

  // Load from localStorage on initialization
  useEffect(() => {
    const saved = localStorage.getItem('currentClassPlan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentClassPlan({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt)
        });
      } catch (error) {
        console.error('Error parsing saved class plan:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('currentClassPlan', JSON.stringify(currentClassPlan));
  }, [currentClassPlan]);

  const updateClassPlan = useCallback((updates: Partial<ClassPlan>) => {
    setCurrentClassPlan(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
  }, []);

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

  const reorderExercises = useCallback((startIndex: number, endIndex: number) => {
    setCurrentClassPlan(prev => {
      const result = Array.from(prev.exercises);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      return {
        ...prev,
        exercises: result,
        updatedAt: new Date()
      };
    });
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

  const duplicateExercise = useCallback((exerciseId: string) => {
    setCurrentClassPlan(prev => {
      const exerciseToDuplicate = prev.exercises.find(ex => ex.id === exerciseId);
      if (!exerciseToDuplicate) return prev;

      const duplicatedExercise = {
        ...exerciseToDuplicate,
        id: uuidv4(),
        name: `${exerciseToDuplicate.name} (Copy)`
      };

      const exerciseIndex = prev.exercises.findIndex(ex => ex.id === exerciseId);
      const newExercises = [...prev.exercises];
      newExercises.splice(exerciseIndex + 1, 0, duplicatedExercise);

      return {
        ...prev,
        exercises: newExercises,
        updatedAt: new Date()
      };
    });
  }, []);

  const clearClassPlan = useCallback(() => {
    setCurrentClassPlan({
      id: uuidv4(),
      name: 'New Class Plan',
      description: '',
      duration: 45,
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      notes: ''
    });
  }, []);

  const getTotalDuration = useCallback(() => {
    return currentClassPlan.exercises.reduce((total, exercise) => total + exercise.duration, 0);
  }, [currentClassPlan.exercises]);

  const createCallout = useCallback((text: string, color: string, duration: number = 1) => {
    const callout: Exercise = {
      id: uuidv4(),
      name: text,
      category: 'callout',
      position: 'other',
      primaryMuscle: 'core',
      difficulty: 'beginner',
      intensityLevel: 'low',
      duration,
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

    addExercise(callout);
  }, [addExercise]);

  return {
    currentClassPlan,
    updateClassPlan,
    addExercise,
    removeExercise,
    reorderExercises,
    updateExercise,
    duplicateExercise,
    clearClassPlan,
    getTotalDuration,
    createCallout
  };
};
