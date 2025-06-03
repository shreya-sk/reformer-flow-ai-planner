
import { useCallback } from 'react';
import { Exercise } from '@/types/reformer';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';

export const useClassPlanSync = () => {
  const { addExercise, currentClassPlan } = usePersistedClassPlan();

  const addExerciseToCurrentPlan = useCallback((exercise: Exercise) => {
    console.log('🔵 useClassPlanSync: Adding exercise to current plan:', exercise.name);
    
    try {
      addExercise(exercise);
      console.log('🔵 useClassPlanSync: Exercise added successfully');
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('🔵 useClassPlanSync: Current plan now has exercises:', currentClassPlan.exercises.length);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('🔴 useClassPlanSync: Error adding exercise:', error);
      return false;
    }
  }, [addExercise, currentClassPlan.exercises.length]);

  return {
    addExerciseToCurrentPlan,
    currentExerciseCount: currentClassPlan.exercises.length
  };
};
