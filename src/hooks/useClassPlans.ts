import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClassPlan, Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

export const useClassPlans = () => {
  const [savedClasses, setSavedClasses] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchClassPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: classPlans, error } = await supabase
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

      // Now we need to fetch the actual exercises
      const transformedPlans = await Promise.all(
        classPlans.map(async (plan) => {
          const exercises = await Promise.all(
            plan.class_plan_exercises
              .sort((a, b) => a.position - b.position)
              .map(async (planExercise) => {
                if (planExercise.is_section_divider) {
                  // Handle section dividers
                  return {
                    id: planExercise.id,
                    name: planExercise.section_name || 'Section',
                    category: 'callout' as const,
                    duration: 0,
                    springs: 'none',
                    difficulty: 'beginner' as const,
                    intensityLevel: 'low' as const,
                    muscleGroups: [],
                    equipment: [],
                  };
                }

                // Fetch the actual exercise
                const table = planExercise.exercise_type === 'system' 
                  ? 'system_exercises' 
                  : 'user_exercises';
                
                const { data: exercise } = await supabase
                  .from(table)
                  .select('*')
                  .eq('id', planExercise.exercise_id)
                  .single();

                if (!exercise) return null;

                return {
                  ...exercise,
                  id: planExercise.id, // Use the plan exercise ID for uniqueness
                  duration: planExercise.duration_override || exercise.duration,
                  repsOrDuration: planExercise.reps_override,
                  notes: planExercise.notes,
                };
              })
          );

          return {
            id: plan.id,
            name: plan.name,
            exercises: exercises.filter(Boolean),
            totalDuration: exercises
              .filter(ex => ex && ex.category !== 'callout')
              .reduce((sum, ex) => sum + (ex?.duration || 0), 0),
            classDuration: plan.duration_minutes,
            createdAt: new Date(plan.created_at),
            notes: plan.notes || '',
            image: plan.image_url,
          };
        })
      );
      
      setSavedClasses(transformedPlans);
    } catch (error) {
      console.error('Error fetching class plans:', error);
      toast({
        title: "Error loading classes",
        description: "Failed to load your saved classes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveClassPlan = async (classPlan: ClassPlan) => {
    if (!user) return;

    try {
      // First, create the class plan
      const { data: newPlan, error: planError } = await supabase
        .from('class_plans')
        .insert({
          name: classPlan.name,
          user_id: user.id,
          duration_minutes: classPlan.classDuration,
          notes: classPlan.notes,
          image_url: classPlan.image,
        })
        .select()
        .single();

      if (planError) throw planError;

      // Then, add all exercises
      const exerciseInserts = classPlan.exercises.map((exercise, index) => {
        if (exercise.category === 'callout') {
          return {
            class_plan_id: newPlan.id,
            exercise_id: crypto.randomUUID(),
            exercise_type: 'system' as const,
            position: index,
            is_section_divider: true,
            section_name: exercise.name,
          };
        }

        // Determine if this is a system or user exercise
        const isSystemExercise = !exercise.isCustom;
        
        return {
          class_plan_id: newPlan.id,
          exercise_id: exercise.id.replace(/-\d+-\w+$/, ''), // Remove unique suffixes
          exercise_type: isSystemExercise ? 'system' : 'user',
          position: index,
          duration_override: exercise.duration,
          notes: exercise.notes,
        };
      });

      const { error: exerciseError } = await supabase
        .from('class_plan_exercises')
        .insert(exerciseInserts);

      if (exerciseError) throw exerciseError;

      toast({
        title: "Class saved successfully!",
        description: `"${classPlan.name}" has been added to your library.`,
      });
      
      await fetchClassPlans(); // Refresh the list
    } catch (error) {
      console.error('Error saving class plan:', error);
      toast({
        title: "Error saving class",
        description: "Failed to save your class plan.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchClassPlans();
    }
  }, [user]);

  return {
    savedClasses,
    loading,
    saveClassPlan,
    fetchClassPlans,
  };
};