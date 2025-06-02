
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClassPlan, Exercise, DifficultyLevel } from '@/types/reformer';
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
          class_plan_exercises(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const plans: ClassPlan[] = data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        duration: plan.duration_minutes || 45,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at),
        tags: plan.tags || [],
        notes: plan.notes || '',
        difficultyLevel: (plan.difficulty_level as DifficultyLevel) || 'beginner',
        isPublic: plan.is_public || false,
        shareToken: plan.share_token,
        userId: plan.user_id,
        viewCount: plan.view_count || 0,
        copyCount: plan.copy_count || 0,
        imageUrl: plan.image_url,
        exercises: plan.class_plan_exercises?.map((cpe: any) => ({
          id: cpe.exercise_id,
          name: cpe.section_name || 'Exercise',
          category: cpe.exercise_type === 'section_divider' ? 'callout' : 'supine',
          position: 'other' as const,
          primaryMuscle: 'core' as const,
          duration: cpe.duration_override || 3,
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
          isPregnancySafe: true,
          isCustom: true,
          isSystemExercise: false,
          createdAt: new Date(),
          updatedAt: new Date()
        })) || []
      })) || [];

      setClassPlans(plans);
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
          user_id: user.id,
          name: classPlan.name,
          description: classPlan.description,
          duration_minutes: classPlan.duration,
          tags: classPlan.tags,
          notes: classPlan.notes,
          difficulty_level: classPlan.difficultyLevel,
          is_public: classPlan.isPublic,
          share_token: classPlan.shareToken,
          image_url: classPlan.imageUrl,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Save exercises within the class plan
      if (classPlan.exercises && classPlan.exercises.length > 0) {
        await supabase
          .from('class_plan_exercises')
          .delete()
          .eq('class_plan_id', classPlan.id);

        const exerciseInserts = classPlan.exercises.map((exercise, index) => ({
          class_plan_id: classPlan.id,
          exercise_id: exercise.id,
          section_name: exercise.name,
          exercise_type: exercise.category === 'callout' ? 'section_divider' : 'exercise',
          duration_override: exercise.duration,
          reps_override: exercise.repsOrDuration,
          position: index, // Changed from 'order' to 'position'
          notes: exercise.notes
        }));

        const { error: exerciseError } = await supabase
          .from('class_plan_exercises')
          .insert(exerciseInserts);

        if (exerciseError) {
          console.error('Error saving class plan exercises:', exerciseError);
          throw exerciseError;
        }
      }

      await fetchClassPlans();
      return data;
    } catch (err) {
      console.error('Error saving class plan:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
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
