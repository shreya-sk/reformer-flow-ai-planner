
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from './useClassPlans';

interface Statistics {
  totalClasses: number;
  totalHours: number;
  exercisesUsed: number;
}

export const useStatistics = () => {
  const { user } = useAuth();
  const { classPlans, loading: classPlansLoading } = useClassPlans();
  const [stats, setStats] = useState<Statistics>({
    totalClasses: 0,
    totalHours: 0,
    exercisesUsed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || classPlansLoading) {
      setLoading(true);
      return;
    }

    // Calculate statistics from class plans
    const totalClasses = classPlans.length;
    const totalHours = Math.round(
      classPlans.reduce((sum, plan) => sum + (plan.totalDuration || 0), 0) / 60
    );
    const exercisesUsed = classPlans.reduce(
      (sum, plan) => sum + (plan.exercises?.length || 0), 
      0
    );

    setStats({
      totalClasses,
      totalHours,
      exercisesUsed
    });
    setLoading(false);
  }, [user, classPlans, classPlansLoading]);

  return { stats, loading };
};
