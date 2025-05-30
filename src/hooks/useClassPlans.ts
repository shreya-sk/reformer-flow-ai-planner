
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
      // First fetch class plans
      const { data: classPlansData, error: classPlansError } = await supabase
        .from('class_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (classPlansError) throw classPlansError;

      // Then fetch exercises for each class plan
      const transformedPlans: ClassPlan[] = [];
      
      for (const plan of classPlansData || []) {
        // Fetch class plan exercises
        const { data: classPlanExercises, error: cpeError } = await supabase
          .from('class_plan_exercises')
          .select('*')
          .eq('class_plan_id', plan.id)
          .order('position');

        if (cpeError) throw cpeError;

        const exercises: Exercise[] = [];
        
        // Fetch exercise details for each class plan exercise
        for (const cpe of classPlanExercises || []) {
          let exerciseData = null;
          
          if (cpe.exercise_type === 'system') {
            const { data: systemExercise } = await supabase
              .from('system_exercises')
              .select('*')
              .eq('id', cpe.exercise_id)
              .single();
            exerciseData = systemExercise;
          } else {
            const { data: userExercise } = await supabase
              .from('user_exercises')
              .select('*')
              .eq('id', cpe.exercise_id)
              .single();
            exerciseData = userExercise;
          }

          if (exerciseData) {
            const exercise: Exercise = {
              id: exerciseData.id,
              name: exerciseData.name,
              category: exerciseData.category,
              duration: cpe.duration_override || exerciseData.duration,
              springs: exerciseData.springs,
              difficulty: exerciseData.difficulty,
              intensityLevel: 'medium' as const,
              muscleGroups: exerciseData.muscle_groups || [],
              equipment: exerciseData.equipment || [],
              description: exerciseData.description || '',
              image: exerciseData.image_url || '',
              videoUrl: exerciseData.video_url || '',
              notes: cpe.notes || exerciseData.notes || '',
              cues: exerciseData.cues || [],
              setup: exerciseData.setup || '',
              repsOrDuration: cpe.reps_override || exerciseData.reps_or_duration || '',
              tempo: exerciseData.tempo || '',
              targetAreas: exerciseData.target_areas || [],
              breathingCues: exerciseData.breathing_cues || [],
              teachingFocus: exerciseData.teaching_focus || [],
              modifications: exerciseData.modifications || [],
              progressions: exerciseData.progressions || [],
              regressions: exerciseData.regressions || [],
              transitions: [],
              contraindications: exerciseData.contraindications || [],
              isPregnancySafe: exerciseData.is_pregnancy_safe || false,
              isCustom: cpe.exercise_type === 'user',
              isSystemExercise: cpe.exercise_type === 'system',
            };
            exercises.push(exercise);
          }
        }

        transformedPlans.push({
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
        });
      }

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
