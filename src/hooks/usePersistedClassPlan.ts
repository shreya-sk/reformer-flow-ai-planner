import { useState, useEffect } from 'react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useDataSync } from './useDataSync';

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

export const usePersistedClassPlan = () => {
  const [currentClass, setCurrentClass] = useState<ClassPlan>(getInitialClassPlan());

  useEffect(() => {
    const storedClassPlan = localStorage.getItem(CLASS_PLAN_KEY);
    if (storedClassPlan) {
      try {
        const parsed = JSON.parse(storedClassPlan);
        console.log('Loaded class plan from localStorage:', parsed);
        setCurrentClass(parsed);
      } catch (error) {
        console.error('Error parsing stored class plan:', error);
        setCurrentClass(getInitialClassPlan());
      }
    } else {
      console.log('No stored class plan found, using initial plan');
      setCurrentClass(getInitialClassPlan());
    }
  }, []);

  useEffect(() => {
    console.log('Saving class plan to localStorage:', currentClass);
    localStorage.setItem(CLASS_PLAN_KEY, JSON.stringify(currentClass));
    // markPendingChanges(); // Mark for sync (removed or comment out if not defined)
  }, [currentClass]);

  const updateClass = (updatedClass: Partial<ClassPlan>) => {
    console.log('🔄 usePersistedClassPlan: updateClass called with:', updatedClass);
    setCurrentClass(prevClass => {
      const newClass = { 
        ...prevClass, 
        ...updatedClass, 
        updatedAt: new Date() 
      };
      console.log('🔄 usePersistedClassPlan: New class state:', {
        name: newClass.name,
        exerciseCount: newClass.exercises.length,
        totalDuration: newClass.totalDuration
      });
      return newClass;
    });
  };

  const addExercise = (exercise: Exercise) => {
    console.log('➕ usePersistedClassPlan: Adding exercise:', exercise.name);
    setCurrentClass(prevClass => {
      // Create a unique ID if not already unique
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const uniqueExercise = {
        ...exercise,
        id: `${exercise.id}-${timestamp}-${randomId}`,
      };
      
      const newExercises = [...prevClass.exercises, uniqueExercise];
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const newClass = { 
        ...prevClass, 
        exercises: newExercises, 
        totalDuration, 
        updatedAt: new Date() 
      };
      
      console.log('➕ usePersistedClassPlan: After adding exercise:', {
        name: newClass.name,
        exerciseCount: newClass.exercises.length,
        totalDuration: newClass.totalDuration,
        addedExercise: uniqueExercise.name
      });
      
      return newClass;
    });
  };

  const removeExercise = (exerciseId: string) => {
    console.log('➖ usePersistedClassPlan: Removing exercise:', exerciseId);
    setCurrentClass(prevClass => {
      const exerciseToRemove = prevClass.exercises.find(ex => ex.id === exerciseId);
      const newExercises = prevClass.exercises.filter(exercise => exercise.id !== exerciseId);
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const newClass = { 
        ...prevClass, 
        exercises: newExercises, 
        totalDuration, 
        updatedAt: new Date() 
      };
      
      console.log('➖ usePersistedClassPlan: After removing exercise:', {
        name: newClass.name,
        exerciseCount: newClass.exercises.length,
        totalDuration: newClass.totalDuration,
        removedExercise: exerciseToRemove?.name || 'Unknown'
      });
      
      return newClass;
    });
  };

  const reorderExercises = (exercises: Exercise[]) => {
    console.log('🔄 usePersistedClassPlan: Reordering exercises:', exercises.length);
    setCurrentClass(prevClass => {
      const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const newClass = { 
        ...prevClass, 
        exercises: exercises, 
        totalDuration, 
        updatedAt: new Date() 
      };
      
      console.log('🔄 usePersistedClassPlan: After reordering:', {
        name: newClass.name,
        exerciseCount: newClass.exercises.length,
        totalDuration: newClass.totalDuration
      });
      
      return newClass;
    });
  };

  const updateClassName = (name: string) => {
    console.log('📝 usePersistedClassPlan: Updating class name to:', name);
    updateClass({ name });
  };

  const updateClassDuration = (duration: number) => {
    console.log('⏱️ usePersistedClassPlan: Updating class duration to:', duration);
    updateClass({ classDuration: duration });
  };

  const updateClassNotes = (notes: string) => {
    console.log('📝 usePersistedClassPlan: Updating class notes');
    updateClass({ notes });
  };

  const updateClassImage = (image: string) => {
    console.log('🖼️ usePersistedClassPlan: Updating class image');
    updateClass({ image });
  };

  const clearClassPlan = () => {
    console.log('🗑️ usePersistedClassPlan: Clearing class plan');
    const initialPlan = getInitialClassPlan();
    setCurrentClass(initialPlan);
  };

  const addCallout = (name: string, position: number) => {
    console.log('📝 usePersistedClassPlan: Adding callout:', name, 'at position:', position);
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

    setCurrentClass(prevClass => {
      const newExercises = [...prevClass.exercises];
      newExercises.splice(position, 0, calloutExercise);
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      
      const newClass = {
        ...prevClass,
        exercises: newExercises,
        totalDuration,
        updatedAt: new Date()
      };
      
      console.log('📝 usePersistedClassPlan: After adding callout:', {
        name: newClass.name,
        exerciseCount: newClass.exercises.length,
        totalDuration: newClass.totalDuration
      });
      
      return newClass;
    });
  };

  // Debug logging for current state
  console.log('🎯 usePersistedClassPlan current state:', {
    name: currentClass.name,
    exerciseCount: currentClass.exercises.length,
    totalDuration: currentClass.totalDuration,
    exercises: currentClass.exercises.map(ex => ({ id: ex.id, name: ex.name, duration: ex.duration }))
  });

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
    addCallout
  };
};