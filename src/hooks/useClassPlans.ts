
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClassPlan, Exercise } from '@/types/reformer';

export const useClassPlans = () => {
  const [classPlans, setClassPlans] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClassPlans = useCallback(async () => {
    if (!user) {
      console.log('🎯 useClassPlans: No user, skipping fetch');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log('🎯 useClassPlans: Fetching class plans for user:', user.id);
    
    try {
      // First fetch class plans
      const { data: classPlansData, error: classPlansError } = await supabase
        .from('class_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (classPlansError) {
        console.error('🎯 useClassPlans: Error fetching class plans:', classPlansError);
        throw classPlansError;
      }

      console.log('🎯 useClassPlans: Raw class plans data:', classPlansData?.length || 0, 'plans found');

      // Then fetch exercises for each class plan
      const transformedPlans: ClassPlan[] = [];
      
      for (const plan of classPlansData || []) {
        console.log('🎯 useClassPlans: Processing plan:', plan.id, plan.name);
        
        // Fetch class plan exercises
        const { data: classPlanExercises, error: cpeError } = await supabase
          .from('class_plan_exercises')
          .select('*')
          .eq('class_plan_id', plan.id)
          .order('position');

        if (cpeError) {
          console.error('🎯 useClassPlans: Error fetching class plan exercises:', cpeError);
          throw cpeError;
        }

        console.log('🎯 useClassPlans: Found exercises for plan:', plan.id, classPlanExercises?.length || 0);

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

        const transformedPlan: ClassPlan = {
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

        transformedPlans.push(transformedPlan);
        console.log('🎯 useClassPlans: Transformed plan:', transformedPlan.id, transformedPlan.name, 'exercises:', transformedPlan.exercises.length);
      }

      console.log('🎯 useClassPlans: Final transformed plans:', transformedPlans.length);
      setClassPlans(transformedPlans);
    } catch (error) {
      console.error('🎯 useClassPlans: Error in fetchClassPlans:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveClassPlan = async (classPlan: ClassPlan) => {
    if (!user) throw new Error('User not authenticated');

    console.log('💾 Saving:', classPlan.name, 'with', classPlan.exercises.length, 'exercises');

    // Filter real exercises (not callouts)
    const realExercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
    
    if (realExercises.length === 0) {
      throw new Error('Cannot save class with no exercises');
    }

    try {
      // Save main class plan
      const { data: classPlanData, error: classPlanError } = await supabase
        .from('class_plans')
        .insert({
          name: classPlan.name,
          duration_minutes: classPlan.classDuration || classPlan.duration || 45,
          notes: classPlan.notes || '',
          image_url: classPlan.image || '',
          user_id: user.id
        })
        .select()
        .single();

      if (classPlanError) throw classPlanError;

      console.log('💾 Saved class plan:', classPlanData.id);

      // Save exercises with proper ID handling
      const exerciseInserts = realExercises.map((exercise, index) => {
        // Handle timestamped IDs from usePersistedClassPlan
        let originalId = exercise.id;
        if (exercise.id.includes('-') && exercise.id.split('-').length >= 3) {
          const parts = exercise.id.split('-');
          originalId = parts.slice(0, -2).join('-');
        }

        console.log('💾 Mapping exercise:', exercise.name, 'ID:', exercise.id, '→', originalId);

        return {
          class_plan_id: classPlanData.id,
          exercise_id: originalId,
          position: index,
          exercise_type: exercise.isCustom ? 'user' : 'system',
          duration_override: exercise.duration,
          notes: exercise.notes || null
        };
      });

      const { error: exerciseError } = await supabase
        .from('class_plan_exercises')
        .insert(exerciseInserts);

      if (exerciseError) {
        console.error('💾 Exercise insert error:', exerciseError);
        throw exerciseError;
      }

      console.log('💾 Saved', exerciseInserts.length, 'exercises');

      // Force refresh the class plans
      await fetchClassPlans();
      
      return classPlanData;
    } catch (error) {
      console.error('💾 Save failed:', error);
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
    console.log('🎯 useClassPlans: useEffect triggered, user:', user?.id);
    fetchClassPlans();
  }, [fetchClassPlans]);

  return {
    classPlans,
    savedClasses: classPlans, // Alias for compatibility
    loading,
    refetch: fetchClassPlans,
    saveClassPlan,
    deleteClassPlan
  };
};
