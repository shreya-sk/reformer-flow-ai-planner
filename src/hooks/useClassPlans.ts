
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClassPlan, Exercise } from '@/types/reformer';

export const useClassPlans = () => {
  const [classPlans, setClassPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchClassPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_plans')
        .select(`
          id,
          name,
          duration_minutes,
          notes,
          image_url,
          created_at,
          updated_at,
          class_plan_exercises (
            id,
            exercise_id,
            position,
            system_exercises (
              id,
              name,
              category,
              duration,
              springs,
              difficulty,
              muscle_groups,
              equipment,
              description,
              image_url,
              video_url,
              notes,
              cues,
              setup,
              reps_or_duration,
              tempo,
              target_areas,
              breathing_cues,
              teaching_focus,
              modifications,
              progressions,
              regressions,
              contraindications,
              is_pregnancy_safe
            ),
            user_exercises (
              id,
              name,
              category,
              duration,
              springs,
              difficulty,
              muscle_groups,
              equipment,
              description,
              image_url,
              video_url,
              notes,
              cues,
              setup,
              reps_or_duration,
              tempo,
              target_areas,
              breathing_cues,
              teaching_focus,
              modifications,
              progressions,
              regressions,
              contraindications,
              is_pregnancy_safe
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPlans: ClassPlan[] = data.map(plan => {
        const exercises: Exercise[] = plan.class_plan_exercises
          .sort((a, b) => a.position - b.position)
          .map(cpe => {
            const exercise = cpe.system_exercises || cpe.user_exercises;
            return {
              id: exercise.id,
              name: exercise.name,
              category: exercise.category,
              duration: exercise.duration,
              springs: exercise.springs,
              difficulty: exercise.difficulty,
              intensityLevel: 'medium' as const,
              muscleGroups: exercise.muscle_groups || [],
              equipment: exercise.equipment || [],
              description: exercise.description || '',
              image: exercise.image_url || '',
              videoUrl: exercise.video_url || '',
              notes: exercise.notes || '',
              cues: exercise.cues || [],
              setup: exercise.setup || '',
              repsOrDuration: exercise.reps_or_duration || '',
              tempo: exercise.tempo || '',
              targetAreas: exercise.target_areas || [],
              breathingCues: exercise.breathing_cues || [],
              teachingFocus: exercise.teaching_focus || [],
              modifications: exercise.modifications || [],
              progressions: exercise.progressions || [],
              regressions: exercise.regressions || [],
              transitions: [],
              contraindications: exercise.contraindications || [],
              isPregnancySafe: exercise.is_pregnancy_safe || false,
              isCustom: !!cpe.user_exercises,
              isSystemExercise: !!cpe.system_exercises,
            };
          });

        return {
          id: plan.id,
          name: plan.name,
          duration: plan.duration_minutes,
          exercises,
          totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0),
          classDuration: plan.duration_minutes,
          createdAt: new Date(plan.created_at),
          updatedAt: new Date(plan.updated_at),
          notes: plan.notes || '',
          image: plan.image_url || ''
        };
      });

      setClassPlans(transformedPlans);
    } catch (error) {
      console.error('Error fetching class plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveClassPlan = async (classPlan: ClassPlan) => {
    if (!user) return;

    try {
      const { data: classPlanData, error: classPlanError } = await supabase
        .from('class_plans')
        .insert({
          name: classPlan.name,
          duration_minutes: classPlan.duration,
          notes: classPlan.notes,
          image_url: classPlan.image,
          user_id: user.id
        })
        .select()
        .single();

      if (classPlanError) throw classPlanError;

      // Insert exercises
      if (classPlan.exercises.length > 0) {
        const exerciseInserts = classPlan.exercises.map((exercise, index) => ({
          class_plan_id: classPlanData.id,
          exercise_id: exercise.id,
          position: index,
          exercise_type: exercise.isCustom ? 'user' : 'system'
        }));

        const { error: exerciseError } = await supabase
          .from('class_plan_exercises')
          .insert(exerciseInserts);

        if (exerciseError) throw exerciseError;
      }

      await fetchClassPlans();
    } catch (error) {
      console.error('Error saving class plan:', error);
      throw error;
    }
  };

  const deleteClassPlan = async (classPlanId: string) => {
    try {
      const { error } = await supabase
        .from('class_plans')
        .delete()
        .eq('id', classPlanId);

      if (error) throw error;
      await fetchClassPlans();
    } catch (error) {
      console.error('Error deleting class plan:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchClassPlans();
  }, [user]);

  return {
    classPlans,
    savedClasses: classPlans, // Alias for compatibility
    loading,
    refetch: fetchClassPlans,
    saveClassPlan,
    deleteClassPlan
  };
};
