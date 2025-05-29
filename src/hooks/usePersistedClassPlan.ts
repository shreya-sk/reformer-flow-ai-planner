import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ClassPlan, Exercise } from '@/types/reformer';

const createEmptyClassPlan = (): ClassPlan => ({
  id: '',
  name: 'New Class Plan',
  exercises: [],
  totalDuration: 0,
  classDuration: 45, // Default 45 minutes
  createdAt: new Date(),
  notes: '',
  image: '', // Add default empty image
});

export const usePersistedClassPlan = () => {
  const { user } = useAuth();
  
  // Make storage key user-specific
  const STORAGE_KEY = user ? `current-class-plan-${user.id}` : 'current-class-plan';

  const [currentClass, setCurrentClass] = useState<ClassPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          // Ensure classDuration exists for backwards compatibility
          classDuration: parsed.classDuration || 45,
          // Ensure image field exists
          image: parsed.image || '',
          // Ensure notes field exists
          notes: parsed.notes || '',
        };
      }
    } catch (error) {
      console.error('Failed to load saved class plan:', error);
    }
    return createEmptyClassPlan();
  });

  // Save to localStorage whenever currentClass changes or user changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClass));
    } catch (error) {
      console.error('Failed to save class plan:', error);
    }
  }, [currentClass, STORAGE_KEY]);

  // When user changes, reload the class plan from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentClass({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          classDuration: parsed.classDuration || 45,
          image: parsed.image || '',
          notes: parsed.notes || '',
        });
      } else {
        setCurrentClass(createEmptyClassPlan());
      }
    } catch (error) {
      console.error('Failed to load saved class plan:', error);
      setCurrentClass(createEmptyClassPlan());
    }
  }, [STORAGE_KEY]);

  const addExercise = useCallback((exercise: Exercise) => {
    console.log('Adding exercise to class plan:', exercise.name, 'ID:', exercise.id);
    
    setCurrentClass(prev => {
      // Always use the provided ID (SmartAddButton already makes it unique)
      const exerciseCopy: Exercise = {
        ...exercise,
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
      
      console.log('Updated class plan with exercises:', newExercises.length, 'Total duration:', totalDuration);
      
      return {
        ...prev,
        exercises: newExercises,
        totalDuration,
      };
    });
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
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
  }, []);

  const updateClassName = useCallback((name: string) => {
    setCurrentClass(prev => ({ ...prev, name }));
  }, []);

  const updateClassDuration = useCallback((duration: number) => {
    setCurrentClass(prev => ({ ...prev, classDuration: duration }));
  }, []);

  const updateClassImage = useCallback((image: string) => {
    setCurrentClass(prev => ({ ...prev, image }));
  }, []);

  const updateClassNotes = useCallback((notes: string) => {
    setCurrentClass(prev => ({ ...prev, notes }));
  }, []);

  const reorderExercises = useCallback((exercises: Exercise[]) => {
    const totalDuration = exercises
      .filter(ex => ex.category !== 'callout')
      .reduce((sum, ex) => sum + (ex.duration || 0), 0);
    
    setCurrentClass(prev => ({
      ...prev,
      exercises,
      totalDuration,
    }));
  }, []);

  const updateExercise = useCallback((updatedExercise: Exercise) => {
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
  }, []);

  const addCallout = useCallback((name: string, insertIndex?: number) => {
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
  }, []);

  const clearClassPlan = useCallback(() => {
    setCurrentClass(createEmptyClassPlan());
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  const loadClassPlan = useCallback((classPlan: ClassPlan) => {
    setCurrentClass(classPlan);
  }, []);

  return {
    currentClass,
    addExercise,
    removeExercise,
    updateClassName,
    updateClassDuration,
    updateClassImage,
    updateClassNotes,
    reorderExercises,
    updateExercise,
    addCallout,
    clearClassPlan,
    loadClassPlan,
  };
};
