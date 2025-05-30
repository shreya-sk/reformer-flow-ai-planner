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
      setCurrentClass(JSON.parse(storedClassPlan));
    } else {
      setCurrentClass(getInitialClassPlan());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CLASS_PLAN_KEY, JSON.stringify(currentClass));
  }, [currentClass]);

  const updateClass = (updatedClass: Partial<ClassPlan>) => {
    setCurrentClass(prevClass => {
      const newClass = { ...prevClass, ...updatedClass, updatedAt: new Date() };
      return newClass;
    });
  };

  const addExercise = (exercise: Exercise) => {
    setCurrentClass(prevClass => {
      const newExercises = [...prevClass.exercises, exercise];
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      return { ...prevClass, exercises: newExercises, totalDuration, updatedAt: new Date() };
    });
  };

  const removeExercise = (exerciseId: string) => {
    setCurrentClass(prevClass => {
      const newExercises = prevClass.exercises.filter(exercise => exercise.id !== exerciseId);
      const totalDuration = newExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      return { ...prevClass, exercises: newExercises, totalDuration, updatedAt: new Date() };
    });
  };

  const reorderExercises = (exercises: Exercise[]) => {
    setCurrentClass(prevClass => {
      const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
      return { ...prevClass, exercises: exercises, totalDuration, updatedAt: new Date() };
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
    setCurrentClass(getInitialClassPlan());
  };

  const addCallout = (name: string, position: number) => {
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
    updateClass({ exercises: newExercises });
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
