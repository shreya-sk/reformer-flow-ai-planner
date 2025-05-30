
import { useState, useEffect } from 'react';
import { Exercise, ClassPlan } from '@/types/reformer';

const CLASS_PLAN_KEY = 'reformerly_class_plan';

const getInitialClassPlan = (): ClassPlan => ({
  id: `class-${Date.now()}`,
  name: '',
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
  }, [currentClass]);

  const updateClass = (updatedClass: Partial<ClassPlan>) => {
    console.log('Updating class with:', updatedClass);
    setCurrentClass(prevClass => {
      const newClass = { ...prevClass, ...updatedClass, updatedAt: new Date() };
      console.log('New class state:', newClass);
      return newClass;
    });
  };

  const addExercise = (exercise: Exercise) => {
    console.log('Adding exercise to class plan:', exercise);
    setCurrentClass(prevClass => {
      const newExercises = [...prevClass.exercises, exercise];
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const newClass = { 
        ...prevClass, 
        exercises: newExercises, 
        totalDuration, 
        updatedAt: new Date() 
      };
      console.log('Updated class plan after adding exercise:', newClass);
      return newClass;
    });
  };

  const removeExercise = (exerciseId: string) => {
    console.log('Removing exercise from class plan:', exerciseId);
    setCurrentClass(prevClass => {
      const newExercises = prevClass.exercises.filter(exercise => exercise.id !== exerciseId);
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const newClass = { 
        ...prevClass, 
        exercises: newExercises, 
        totalDuration, 
        updatedAt: new Date() 
      };
      console.log('Updated class plan after removing exercise:', newClass);
      return newClass;
    });
  };

  const reorderExercises = (exercises: Exercise[]) => {
    console.log('Reordering exercises in class plan:', exercises);
    setCurrentClass(prevClass => {
      const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      const newClass = { 
        ...prevClass, 
        exercises: exercises, 
        totalDuration, 
        updatedAt: new Date() 
      };
      console.log('Updated class plan after reordering:', newClass);
      return newClass;
    });
  };

  const updateClassName = (name: string) => {
    updateClass({ name });
  };

  const updateClassDuration = (duration: number) => {
    updateClass({ classDuration: duration });
  };

  const updateClassNotes = (notes: string) => {
    updateClass({ notes });
  };

  const updateClassImage = (image: string) => {
    updateClass({ image });
  };

  const clearClassPlan = () => {
    console.log('Clearing class plan');
    setCurrentClass(getInitialClassPlan());
  };

  const addCallout = (name: string, position: number) => {
    console.log('Adding callout to class plan:', name, 'at position:', position);
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

    const newExercises = [...currentClass.exercises];
    newExercises.splice(position, 0, calloutExercise);
    reorderExercises(newExercises);
  };

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
