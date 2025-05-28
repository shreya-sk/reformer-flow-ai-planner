
import { useState, useEffect } from 'react';
import { ClassPlan, Exercise } from '@/types/reformer';

const STORAGE_KEY = 'current-class-plan';

const createEmptyClassPlan = (): ClassPlan => ({
  id: '',
  name: 'New Class Plan',
  exercises: [],
  totalDuration: 0,
  createdAt: new Date(),
  notes: '',
});

export const usePersistedClassPlan = () => {
  const [currentClass, setCurrentClass] = useState<ClassPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        };
      }
    } catch (error) {
      console.error('Failed to load saved class plan:', error);
    }
    return createEmptyClassPlan();
  });

  // Save to localStorage whenever currentClass changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClass));
    } catch (error) {
      console.error('Failed to save class plan:', error);
    }
  }, [currentClass]);

  const addExercise = (exercise: Exercise) => {
    console.log('Adding exercise to class plan:', exercise.name);
    
    setCurrentClass(prev => {
      // Create a complete copy of the exercise with all attributes
      const exerciseCopy: Exercise = {
        ...exercise,
        id: `${exercise.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        // Ensure all arrays are properly copied
        muscleGroups: [...exercise.muscleGroups],
        equipment: [...exercise.equipment],
        cues: exercise.cues ? [...exercise.cues] : [],
        progressions: exercise.progressions ? [...exercise.progressions] : [],
        regressions: exercise.regressions ? [...exercise.regressions] : [],
        contraindications: exercise.contraindications ? [...exercise.contraindications] : [],
        transitions: exercise.transitions ? [...exercise.transitions] : [],
        targetAreas: exercise.targetAreas ? [...exercise.targetAreas] : [],
        teachingFocus: exercise.teachingFocus ? [...exercise.teachingFocus] : [],
      };
      
      const newExercises = [...prev.exercises, exerciseCopy];
      const totalDuration = newExercises
        .filter(ex => ex.category !== 'callout')
        .reduce((sum, ex) => sum + (ex.duration || 0), 0);
      
      console.log('Updated class plan with exercises:', newExercises.length);
      
      return {
        ...prev,
        exercises: newExercises,
        totalDuration,
      };
    });
  };

  const removeExercise = (exerciseId: string) => {
    setCurrentClass(prev => {
      const newExercises = prev.exercises.filter(ex => ex.id !== exerciseId);
      const totalDuration = newExercises
        .filter(ex => ex.category !== 'callout')
        .reduce((sum, ex) => sum + (ex.duration || 0), 0);
      
      return {
        ...prev,
        exercises: newExercises,
        totalDuration,
      };
    });
  };

  const updateClassName = (name: string) => {
    setCurrentClass(prev => ({ ...prev, name }));
  };

  const reorderExercises = (exercises: Exercise[]) => {
    const totalDuration = exercises
      .filter(ex => ex.category !== 'callout')
      .reduce((sum, ex) => sum + (ex.duration || 0), 0);
    
    setCurrentClass(prev => ({
      ...prev,
      exercises,
      totalDuration,
    }));
  };

  const updateExercise = (updatedExercise: Exercise) => {
    setCurrentClass(prev => {
      const newExercises = prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      );
      const totalDuration = newExercises
        .filter(ex => ex.category !== 'callout')
        .reduce((sum, ex) => sum + (ex.duration || 0), 0);
      
      return {
        ...prev,
        exercises: newExercises,
        totalDuration,
      };
    });
  };

  const addCallout = (name: string, insertIndex?: number) => {
    const calloutExercise: Exercise = {
      id: `callout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      category: 'callout',
      difficulty: 'beginner',
      intensityLevel: 'low',
      duration: 0,
      muscleGroups: [],
      equipment: [],
      springs: 'none',
      isPregnancySafe: true,
      description: `${name} section divider`,
      cues: [],
      notes: ''
    };

    setCurrentClass(prev => {
      const newExercises = [...prev.exercises];
      if (insertIndex !== undefined) {
        newExercises.splice(insertIndex, 0, calloutExercise);
      } else {
        newExercises.push(calloutExercise);
      }
      
      return {
        ...prev,
        exercises: newExercises,
      };
    });
  };

  const clearClassPlan = () => {
    setCurrentClass(createEmptyClassPlan());
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadClassPlan = (classPlan: ClassPlan) => {
    setCurrentClass(classPlan);
  };

  return {
    currentClass,
    addExercise,
    removeExercise,
    updateClassName,
    reorderExercises,
    updateExercise,
    addCallout,
    clearClassPlan,
    loadClassPlan,
  };
};
