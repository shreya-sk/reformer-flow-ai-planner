
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from './useClassPlans';
import { useExercises } from './useExercises';

interface ExerciseUsage {
  exerciseId: string;
  exerciseName: string;
  usageCount: number;
  lastUsed: Date;
}

interface ClassPlanUsage {
  classId: string;
  className: string;
  usageCount: number;
  lastUsed: Date;
}

interface UserStats {
  mostUsedExercises: ExerciseUsage[];
  mostUsedClassPlans: ClassPlanUsage[];
  customExerciseCount: number;
  totalClassesCreated: number;
  totalExercisesUsed: number;
}

const STATS_KEY = 'user-stats';

export const useUserStats = () => {
  const { user } = useAuth();
  const { classPlans } = useClassPlans();
  const { exercises } = useExercises();
  
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          mostUsedExercises: parsed.mostUsedExercises?.map((ex: any) => ({
            ...ex,
            lastUsed: new Date(ex.lastUsed)
          })) || [],
          mostUsedClassPlans: parsed.mostUsedClassPlans?.map((cp: any) => ({
            ...cp,
            lastUsed: new Date(cp.lastUsed)
          })) || []
        };
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
    
    return {
      mostUsedExercises: [],
      mostUsedClassPlans: [],
      customExerciseCount: 0,
      totalClassesCreated: 0,
      totalExercisesUsed: 0
    };
  });

  // Calculate stats from current data
  useEffect(() => {
    if (!user) return;

    const customExercises = exercises.filter(ex => ex.isCustom);
    const totalClasses = classPlans.length;
    
    // Calculate exercise usage from all class plans
    const exerciseUsageMap = new Map<string, ExerciseUsage>();
    
    classPlans.forEach(classPlan => {
      classPlan.exercises
        .filter(ex => ex.category !== 'callout')
        .forEach(exercise => {
          const existing = exerciseUsageMap.get(exercise.id);
          if (existing) {
            existing.usageCount++;
            existing.lastUsed = new Date(Math.max(existing.lastUsed.getTime(), classPlan.updatedAt.getTime()));
          } else {
            exerciseUsageMap.set(exercise.id, {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              usageCount: 1,
              lastUsed: classPlan.updatedAt
            });
          }
        });
    });

    const mostUsedExercises = Array.from(exerciseUsageMap.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    // For class plan usage, we'll track when they're accessed/taught
    // For now, just show creation data
    const mostUsedClassPlans = classPlans
      .map(cp => ({
        classId: cp.id,
        className: cp.name,
        usageCount: 1, // TODO: Track actual usage
        lastUsed: cp.updatedAt
      }))
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .slice(0, 5);

    const newStats = {
      mostUsedExercises,
      mostUsedClassPlans,
      customExerciseCount: customExercises.length,
      totalClassesCreated: totalClasses,
      totalExercisesUsed: exerciseUsageMap.size
    };

    setStats(newStats);
    
    // Save to localStorage
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Failed to save user stats:', error);
    }
  }, [user, classPlans, exercises]);

  const recordClassPlanUsage = useCallback((classId: string) => {
    // TODO: Implement usage tracking when class is taught
    console.log('Class plan used:', classId);
  }, []);

  const recordExerciseUsage = useCallback((exerciseId: string) => {
    // TODO: Implement exercise usage tracking
    console.log('Exercise used:', exerciseId);
  }, []);

  return {
    stats,
    recordClassPlanUsage,
    recordExerciseUsage
  };
};
