import { useState, useEffect, useCallback } from 'react';
import { Exercise, ClassPlan } from '@/types/reformer';

const CLASS_PLAN_KEY = 'reformerly_class_plan';

const getInitialClassPlan = (): ClassPlan => ({
  id: `class-${Date.now()}`,
  name: 'New Class',
  duration: 45,
  exercises: [],
  totalDuration: 0,
  classDuration: 45,
  createdAt: new Date(),
  updatedAt: new Date(),
  notes: '',
  image: ''
});

// Global state to ensure consistency across components
let globalClassPlan: ClassPlan | null = null;
const subscribers = new Set<(classPlan: ClassPlan) => void>();

const notifySubscribers = (classPlan: ClassPlan) => {
  subscribers.forEach(callback => callback(classPlan));
};

const saveToStorage = (classPlan: ClassPlan) => {
  try {
    localStorage.setItem(CLASS_PLAN_KEY, JSON.stringify(classPlan));
    console.log('💾 Saved to localStorage:', {
      name: classPlan.name,
      exerciseCount: classPlan.exercises.length,
      totalDuration: classPlan.totalDuration
    });
  } catch (error) {
    console.error('Failed to save class plan:', error);
  }
};

const loadFromStorage = (): ClassPlan => {
  try {
    const stored = localStorage.getItem(CLASS_PLAN_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📂 Loaded from localStorage:', {
        name: parsed.name,
        exerciseCount: parsed.exercises?.length || 0,
        totalDuration: parsed.totalDuration || 0
      });
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt)
      };
    }
  } catch (error) {
    console.error('Failed to load class plan:', error);
  }
  return getInitialClassPlan();
};

// Initialize global state if not already done
if (!globalClassPlan) {
  globalClassPlan = loadFromStorage();
}

export const usePersistedClassPlan = () => {
  const [currentClass, setCurrentClass] = useState<ClassPlan>(() => {
    // Always use the global state as source of truth
    return globalClassPlan || loadFromStorage();
  });

  // Subscribe to global state changes
  useEffect(() => {
    const handleGlobalUpdate = (updatedClass: ClassPlan) => {
      setCurrentClass(updatedClass);
    };

    subscribers.add(handleGlobalUpdate);
    
    // Sync with current global state
    if (globalClassPlan) {
      setCurrentClass(globalClassPlan);
    }

    return () => {
      subscribers.delete(handleGlobalUpdate);
    };
  }, []);

  const updateGlobalState = useCallback((updatedClass: ClassPlan) => {
    const newClass = {
      ...updatedClass,
      updatedAt: new Date(),
      totalDuration: updatedClass.exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0)
    };

    globalClassPlan = newClass;
    saveToStorage(newClass);
    notifySubscribers(newClass);

    console.log('🔄 Global state updated:', {
      name: newClass.name,
      exerciseCount: newClass.exercises.length,
      totalDuration: newClass.totalDuration
    });
  }, []);

  const addExercise = useCallback((exercise: Exercise) => {
    console.log('➕ Adding exercise:', exercise.name);
    
    if (!globalClassPlan) {
      globalClassPlan = getInitialClassPlan();
    }

    // Create a unique ID for the exercise instance
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const uniqueExercise = {
      ...exercise,
      id: `${exercise.id}-${timestamp}-${randomId}`,
    };
    
    const newExercises = [...globalClassPlan.exercises, uniqueExercise];
    const updatedClass = {
      ...globalClassPlan,
      exercises: newExercises
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const removeExercise = useCallback((exerciseId: string) => {
    console.log('➖ Removing exercise:', exerciseId);
    
    if (!globalClassPlan) return;

    const newExercises = globalClassPlan.exercises.filter(ex => ex.id !== exerciseId);
    const updatedClass = {
      ...globalClassPlan,
      exercises: newExercises
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const reorderExercises = useCallback((exercises: Exercise[]) => {
    console.log('🔄 Reordering exercises:', exercises.length);
    
    if (!globalClassPlan) return;

    const updatedClass = {
      ...globalClassPlan,
      exercises: exercises
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const updateClassName = useCallback((name: string) => {
    console.log('📝 Updating class name to:', name);
    
    if (!globalClassPlan) return;

    const updatedClass = {
      ...globalClassPlan,
      name
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const updateClassDuration = useCallback((duration: number) => {
    console.log('⏱️ Updating class duration to:', duration);
    
    if (!globalClassPlan) return;

    const updatedClass = {
      ...globalClassPlan,
      classDuration: duration,
      duration
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const updateClassNotes = useCallback((notes: string) => {
    console.log('📝 Updating class notes');
    
    if (!globalClassPlan) return;

    const updatedClass = {
      ...globalClassPlan,
      notes
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const updateClassImage = useCallback((image: string) => {
    console.log('🖼️ Updating class image');
    
    if (!globalClassPlan) return;

    const updatedClass = {
      ...globalClassPlan,
      image
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const clearClassPlan = useCallback(() => {
    console.log('🗑️ Clearing class plan');
    const initialPlan = getInitialClassPlan();
    updateGlobalState(initialPlan);
  }, [updateGlobalState]);

  const addCallout = useCallback((name: string, position: number) => {
    console.log('📝 Adding callout:', name, 'at position:', position);
    
    if (!globalClassPlan) return;

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
      description: 'Section divider',
      calloutColor: 'amber',
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
      contraindications: []
    };

    const newExercises = [...globalClassPlan.exercises];
    newExercises.splice(position, 0, calloutExercise);
    
    const updatedClass = {
      ...globalClassPlan,
      exercises: newExercises
    };

    updateGlobalState(updatedClass);
  }, [updateGlobalState]);

  const loadClass = useCallback((classPlan: ClassPlan) => {
    console.log('📂 Loading class:', classPlan.name);
    updateGlobalState(classPlan);
  }, [updateGlobalState]);

  return {
    currentClass,
    addExercise,
    removeExercise,
    reorderExercises,
    updateClassName,
    updateClassDuration,
    updateClassNotes,
    updateClassImage,
    clearClassPlan,
    addCallout,
    loadClass
  };
};