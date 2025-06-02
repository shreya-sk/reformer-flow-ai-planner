import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useAuth } from '@/contexts/AuthContext';

export const useClassPlans = () => {
  const [classPlans, setClassPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClassPlans = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_plans')
        .select(`
          *,
          class_plan_exercises (
            *
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData: ClassPlan[] = data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        duration: plan.duration_minutes || 45,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at),
        tags: plan.tags || [],
        notes: plan.notes,
        difficultyLevel: plan.difficulty_level,
        isPublic: plan.is_public,
        shareToken: plan.share_token,
        userId: plan.user_id,
        viewCount: plan.view_count,
        copyCount: plan.copy_count,
        imageUrl: plan.image_url,
        exercises: plan.class_plan_exercises?.map((cpe: any): Exercise => {
          if (cpe.exercise_type === 'callout') {
            return {
              id: cpe.id,
              name: cpe.section_name || 'Section Break',
              category: 'callout' as const,
              position: 'other' as const,
              primaryMuscle: 'core' as const,
              duration: cpe.duration_override || 1,
              springs: 'none' as const,
              difficulty: 'beginner' as const,
              intensityLevel: 'low' as const,
              muscleGroups: [],
              equipment: [],
              description: '',
              image: '',
              videoUrl: '',
              notes: cpe.notes || '',
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
              isPregnancySafe: true,
              isSystemExercise: false,
              createdAt: new Date(),
              updatedAt: new Date()
            };
          } else {
            // Handle regular exercises - need to fetch from system_exercises or user_exercises
            return {
              id: cpe.exercise_id,
              name: cpe.exercise_id, // Will be resolved when we implement proper exercise fetching
              category: cpe.exercise_type,
              position: 'supine' as const,
              primaryMuscle: 'core' as const,
              duration: cpe.duration_override || 3,
              springs: 'medium' as const,
              difficulty: 'beginner' as const,
              intensityLevel: 'medium' as const,
              muscleGroups: [],
              equipment: [],
              description: '',
              image: '',
              videoUrl: '',
              notes: cpe.notes || '',
              cues: [],
              setup: '',
              repsOrDuration: cpe.reps_override || '',
              tempo: '',
              targetAreas: [],
              breathingCues: [],
              teachingFocus: [],
              modifications: [],
              progressions: [],
              regressions: [],
              transitions: [],
              contraindications: [],
              isPregnancySafe: false,
              isSystemExercise: true,
              createdAt: new Date(),
              updatedAt: new Date()
            } as Exercise;
          }
        }) || []
      })) || [];

      setClassPlans(transformedData);
    } catch (err) {
      console.error('Error fetching class plans:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveClassPlan = async (classPlan: ClassPlan) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('class_plans')
        .upsert({
          id: classPlan.id,
          name: classPlan.name,
          description: classPlan.description,
          user_id: user.id,
          duration_minutes: classPlan.duration,
          difficulty_level: classPlan.difficultyLevel,
          tags: classPlan.tags || [],
          notes: classPlan.notes,
          is_public: classPlan.isPublic || false,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Save exercises
      if (classPlan.exercises && classPlan.exercises.length > 0) {
        // First, delete existing exercises for this class plan
        await supabase
          .from('class_plan_exercises')
          .delete()
          .eq('class_plan_id', classPlan.id);

        // Then insert new exercises
        const exerciseInserts = classPlan.exercises.map((exercise, index) => ({
          class_plan_id: classPlan.id,
          exercise_id: exercise.id,
          exercise_type: exercise.category,
          position: index,
          duration_override: exercise.duration,
          reps_override: exercise.repsOrDuration,
          notes: exercise.notes
        }));

        const { error: exerciseError } = await supabase
          .from('class_plan_exercises')
          .insert(exerciseInserts);

        if (exerciseError) throw exerciseError;
      }

      await fetchClassPlans();
      return data;
    } catch (err) {
      console.error('Error saving class plan:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteClassPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('class_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchClassPlans();
    } catch (err) {
      console.error('Error deleting class plan:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchClassPlans();
  }, [user]);

  return {
    classPlans,
    loading,
    error,
    saveClassPlan,
    deleteClassPlan,
    refetch: fetchClassPlans
  };
};
