
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

        // Calculate real exercise count (excluding callouts)
        const realExercises = exercises.filter(ex => ex.category !== 'callout');
        
        const transformedPlan: ClassPlan = {
          id: plan.id,
          name: plan.name,
          duration: plan.duration_minutes,
          exercises,
          totalDuration: realExercises.reduce((sum, ex) => sum + ex.duration, 0),
          classDuration: plan.duration_minutes,
          createdAt: new Date(plan.created_at),
          updatedAt: new Date(plan.updated_at),
          notes: plan.notes || '',
          image: plan.image_url || ''
        };

        transformedPlans.push(transformedPlan);
        console.log('🎯 useClassPlans: Transformed plan:', transformedPlan.id, transformedPlan.name, 'real exercises:', realExercises.length);
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

    // Filter real exercises (not callouts)
    const realExercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
    
    console.log('💾 Starting save process:', {
      name: classPlan.name,
      totalExercises: classPlan.exercises.length,
      realExercises: realExercises.length,
      exerciseDetails: realExercises.map(ex => ({ 
        id: ex.id, 
        name: ex.name, 
        isCustom: ex.isCustom,
        isSystemExercise: ex.isSystemExercise 
      }))
    });
    
    if (realExercises.length === 0) {
      throw new Error('Cannot save class with no exercises');
    }

    let classPlanData = null;

    try {
      // Validate all exercises exist before attempting to save
      console.log('💾 Validating exercises exist in database...');
      const validationResults = [];
      
      for (const exercise of realExercises) {
        let existsInDB = false;
        let exerciseType = '';
        
        console.log('💾 Checking exercise:', exercise.id, exercise.name);
        
        // Check system exercises first
        const { data: systemCheck, error: systemError } = await supabase
          .from('system_exercises')
          .select('id, name')
          .eq('id', exercise.id)
          .single();
        
        if (systemCheck && !systemError) {
          existsInDB = true;
          exerciseType = 'system';
          console.log('💾 Found in system exercises:', systemCheck.name);
        } else {
          // Check user exercises
          const { data: userCheck, error: userError } = await supabase
            .from('user_exercises')
            .select('id, name')
            .eq('id', exercise.id)
            .eq('user_id', user.id)
            .single();
          
          if (userCheck && !userError) {
            existsInDB = true;
            exerciseType = 'user';
            console.log('💾 Found in user exercises:', userCheck.name);
          }
        }
        
        if (!existsInDB) {
          console.error('💾 Exercise not found in database:', exercise.id, exercise.name);
          throw new Error(`Exercise "${exercise.name}" not found in database. Please try refreshing your exercise library.`);
        }
        
        validationResults.push({
          exercise,
          exerciseType,
          exists: existsInDB
        });
      }
      
      console.log('💾 All exercises validated successfully');

      // Save main class plan first
      const { data: savedClassPlan, error: classPlanError } = await supabase
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

      if (classPlanError) {
        console.error('💾 Class plan save error:', classPlanError);
        throw new Error(`Failed to save class plan: ${classPlanError.message}`);
      }

      classPlanData = savedClassPlan;
      console.log('💾 Class plan saved successfully:', classPlanData.id);

      // Now save exercises using validation results
      const exerciseInserts = validationResults.map((result, index) => ({
        class_plan_id: classPlanData.id,
        exercise_id: result.exercise.id,
        position: index,
        exercise_type: result.exerciseType,
        duration_override: result.exercise.duration,
        notes: result.exercise.notes || null
      }));

      console.log('💾 About to insert exercises:', exerciseInserts.length);

      if (exerciseInserts.length > 0) {
        const { error: exerciseError } = await supabase
          .from('class_plan_exercises')
          .insert(exerciseInserts);

        if (exerciseError) {
          console.error('💾 Exercise insert error:', exerciseError);
          
          // Clean up the class plan if exercise save failed
          await supabase
            .from('class_plans')
            .delete()
            .eq('id', classPlanData.id);
          
          throw new Error(`Failed to save exercises: ${exerciseError.message}`);
        }

        console.log('💾 All exercises saved successfully');
      }

      // Force refresh the class plans
      await fetchClassPlans();
      
      return classPlanData;
    } catch (error) {
      console.error('💾 Save failed:', error);
      
      // Clean up if class plan was created but exercises failed
      if (classPlanData) {
        try {
          await supabase
            .from('class_plans')
            .delete()
            .eq('id', classPlanData.id);
          console.log('💾 Cleaned up failed class plan');
        } catch (cleanupError) {
          console.error('💾 Failed to clean up class plan:', cleanupError);
        }
      }
      
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
