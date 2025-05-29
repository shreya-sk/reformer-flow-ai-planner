
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

      const transformedPlans = await Promise.all(
        classPlans.map(async (plan) => {
          const exercises = await Promise.all(
            plan.class_plan_exercises
              .sort((a, b) => a.position - b.position)
              .map(async (planExercise) => {
                if (planExercise.is_section_divider) {
                  return {
                    id: planExercise.id,
                    name: planExercise.section_name || 'Section',
                    category: 'callout' as const,
                    duration: 0,
                    springs: 'none' as const,
                    difficulty: 'beginner' as const,
                    intensityLevel: 'low' as const,
                    muscleGroups: [],
                    equipment: [],
                    description: '',
                    image: '',
                    videoUrl: '',
                    notes: '',
                    cues: [],
                    transitions: [],
                    contraindications: [],
                    isPregnancySafe: false,
                  };
                }

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
                  id: planExercise.id,
                  name: exercise.name,
                  category: exercise.category,
                  duration: planExercise.duration_override || exercise.duration,
                  springs: exercise.springs,
                  difficulty: exercise.difficulty,
                  intensityLevel: 'medium' as const,
                  muscleGroups: exercise.muscle_groups || [],
                  equipment: exercise.equipment || [],
                  description: exercise.description || '',
                  image: exercise.image_url || '',
                  videoUrl: exercise.video_url || '',
                  notes: planExercise.notes || exercise.notes || '',
                  cues: exercise.cues || [],
                  transitions: [],
                  contraindications: exercise.contraindications || [],
                  isPregnancySafe: exercise.is_pregnancy_safe || false,
                  repsOrDuration: planExercise.reps_override,
                  isCustom: planExercise.exercise_type === 'user',
                  originalExerciseId: planExercise.exercise_id,
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

        // Get the original exercise ID (remove unique suffixes added by the UI)
        const originalId = (exercise as any).originalExerciseId || exercise.id.replace(/-\d+-\w+$/, '');
        const isSystemExercise = !(exercise as any).isCustom;
        
        return {
          class_plan_id: newPlan.id,
          exercise_id: originalId,
          exercise_type: isSystemExercise ? 'system' as const : 'user' as const,
          position: index,
          duration_override: exercise.duration,
          notes: exercise.notes,
          reps_override: (exercise as any).repsOrDuration,
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
      
      await fetchClassPlans();
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
