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

    try {
      // Improved exercise validation with better error handling
      console.log('💾 Validating exercises exist in database...');
      const validationResults = [];
      
      for (const exercise of realExercises) {
        console.log('💾 Checking exercise:', exercise.id, exercise.name);
        
        let existsInDB = false;
        let exerciseType = '';
        
        // First try to determine the type based on exercise properties
        if (exercise.isSystemExercise || (!exercise.isCustom && !exercise.isSystemExercise)) {
          // Check system exercises first
          const { data: systemCheck, error: systemError } = await supabase
            .from('system_exercises')
            .select('id, name')
            .eq('id', exercise.id)
            .maybeSingle();
          
          if (systemCheck && !systemError) {
            existsInDB = true;
            exerciseType = 'system';
            console.log('💾 Found in system exercises:', systemCheck.name);
          }
        }
        
        if (!existsInDB && (exercise.isCustom || !exercise.isSystemExercise)) {
          // Check user exercises
          const { data: userCheck, error: userError } = await supabase
            .from('user_exercises')
            .select('id, name')
            .eq('id', exercise.id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (userCheck && !userError) {
            existsInDB = true;
            exerciseType = 'user';
            console.log('💾 Found in user exercises:', userCheck.name);
          }
        }
        
        // If not found in either, try a broader search
        if (!existsInDB) {
          console.log('💾 Exercise not found with direct lookup, trying broader search...');
          
          // Try system exercises with name match
          const { data: systemByName } = await supabase
            .from('system_exercises')
            .select('id, name')
            .ilike('name', exercise.name)
            .limit(1)
            .maybeSingle();
          
          if (systemByName) {
            existsInDB = true;
            exerciseType = 'system';
            exercise.id = systemByName.id; // Update the ID
            console.log('💾 Found system exercise by name:', systemByName.name, 'with ID:', systemByName.id);
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

      console.log('💾 Class plan saved successfully:', savedClassPlan.id);

      // Now save exercises using validation results
      const exerciseInserts = validationResults.map((result, index) => ({
        class_plan_id: savedClassPlan.id,
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
            .eq('id', savedClassPlan.id);
          
          throw new Error(`Failed to save exercises: ${exerciseError.message}`);
        }

        console.log('💾 All exercises saved successfully');
      }

      // Force refresh the class plans
      await fetchClassPlans();
      
      return savedClassPlan;
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
    savedClasses: classPlans,
    loading,
    refetch: fetchClassPlans,
    saveClassPlan,
    deleteClassPlan
  };
};
