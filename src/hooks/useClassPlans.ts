import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Exercise, ClassPlan, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

interface ClassPlanHook {
  classPlans: ClassPlan[];
  savedClasses: ClassPlan[];
  loading: boolean;
  fetchClassPlans: () => Promise<void>;
  saveClassPlan: (classPlan: ClassPlan) => Promise<void>;
  updateClassPlan: (classPlan: ClassPlan) => Promise<void>;
  deleteClassPlan: (classPlanId: string) => Promise<void>;
}

export const useClassPlans = (): ClassPlanHook => {
  const [classPlans, setClassPlans] = useState<ClassPlan[]>([]);
  const [savedClasses, setSavedClasses] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchClassPlans();
    }
  }, [user]);

  const fetchClassPlans = async () => {
    setLoading(true);
    try {
      if (!user) {
        console.error("User not logged in.");
        return;
      }

      let { data: class_plans, error } = await supabase
        .from('class_plans')
        .select(`
          *,
          class_plan_exercises (
            order_number,
            system_exercises (
              *
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (class_plans) {
        const mappedClassPlans: ClassPlan[] = class_plans.map(plan => {
          const exercisesWithOrder = (plan.class_plan_exercises as any[])
            .sort((a, b) => a.order_number - b.order_number)
            .map(row => {
              
              const exerciseWithDefaults = {
                ...row.system_exercises,
                id: row.system_exercises.id,
                name: row.custom_name || row.system_exercises.name,
                category: row.system_exercises.category,
                duration: row.custom_duration || row.system_exercises.duration,
                springs: row.custom_springs || row.system_exercises.springs,
                difficulty: row.custom_difficulty || row.system_exercises.difficulty,
                intensityLevel: 'medium' as const,
                muscleGroups: row.system_exercises.muscle_groups || [],
                equipment: row.system_exercises.equipment || [],
                description: row.system_exercises.description || '',
                image: row.system_exercises.image || '',
                videoUrl: row.system_exercises.video_url || '',
                notes: row.custom_notes || row.system_exercises.notes || '',
                cues: row.custom_cues || row.system_exercises.cues || [],
                setup: row.custom_setup || row.system_exercises.setup || '',
                repsOrDuration: row.custom_reps_or_duration || row.system_exercises.reps_or_duration || '',
                tempo: row.custom_tempo || row.system_exercises.tempo || '',
                targetAreas: row.custom_target_areas || row.system_exercises.target_areas || [],
                breathingCues: row.custom_breathing_cues || row.system_exercises.breathing_cues || [],
                teachingFocus: row.custom_teaching_focus || row.system_exercises.teaching_focus || [],
                modifications: row.custom_modifications || row.system_exercises.modifications || [],
                progressions: row.system_exercises.progressions || [],
                regressions: row.system_exercises.regressions || [],
                transitions: row.system_exercises.transitions || [],
                contraindications: row.system_exercises.contraindications || [],
                isPregnancySafe: row.system_exercises.is_pregnancy_safe || false,
                isSystemExercise: true,
                isCustomized: !!(row.custom_name || row.custom_duration || row.custom_springs),
                originalExerciseId: row.system_exercises.id
              } as Exercise;

              return exerciseWithDefaults;
            });

          const classPlan: ClassPlan = {
            id: plan.id,
            name: plan.name,
            duration: plan.class_duration || 45,
            exercises: exercisesWithOrder,
            totalDuration: plan.total_duration || 0,
            classDuration: plan.class_duration || 45,
            createdAt: new Date(plan.created_at),
            updatedAt: new Date(plan.updated_at),
            notes: plan.notes || '',
            image: plan.image || ''
          };

          return classPlan;
        });

        setClassPlans(mappedClassPlans);
        setSavedClasses(mappedClassPlans);
      }
    } catch (error) {
      console.error("Error fetching class plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveClassPlan = async (classPlan: ClassPlan) => {
    setLoading(true);
    try {
      if (!user) {
        console.error("User not logged in.");
        return;
      }

      const { data, error } = await supabase
        .from('class_plans')
        .insert([
          {
            user_id: user.id,
            name: classPlan.name,
            description: classPlan.description,
            duration: classPlan.duration,
            total_duration: classPlan.totalDuration,
            class_duration: classPlan.classDuration,
            tags: classPlan.tags,
            notes: classPlan.notes,
            difficulty_level: classPlan.difficultyLevel,
            is_public: classPlan.isPublic,
            share_token: classPlan.shareToken,
            view_count: classPlan.viewCount,
            copy_count: classPlan.copyCount,
            image: classPlan.image
          }
        ])
        .select()

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newClassPlanId = data[0].id;

        // Save each exercise in class_plan_exercises
        await Promise.all(classPlan.exercises.map(async (exercise, index) => {
          const { error: exerciseError } = await supabase
            .from('class_plan_exercises')
            .insert([
              {
                class_plan_id: newClassPlanId,
                system_exercise_id: exercise.id,
                order_number: index,
                custom_name: exercise.name !== exercise.name ? exercise.name : null,
                custom_duration: exercise.duration !== exercise.duration ? exercise.duration : null,
                custom_springs: exercise.springs !== exercise.springs ? exercise.springs : null,
                custom_cues: exercise.cues !== exercise.cues ? exercise.cues : null,
                custom_notes: exercise.notes !== exercise.notes ? exercise.notes : null,
              }
            ]);

          if (exerciseError) {
            console.error(`Error saving exercise ${exercise.name} to class plan:`, exerciseError);
          }
        }));

        // Refresh class plans to reflect the newly saved class
        await fetchClassPlans();
        toast({
          title: "Class saved!",
          description: "Your class plan has been successfully saved.",
        });
      }
    } catch (error) {
      console.error("Error saving class plan:", error);
      toast({
        title: "Error saving class",
        description: "Failed to save the class plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClassPlan = async (classPlan: ClassPlan) => {
    setLoading(true);
    try {
      if (!user) {
        console.error("User not logged in.");
        return;
      }

      const { error } = await supabase
        .from('class_plans')
        .update({
          name: classPlan.name,
          description: classPlan.description,
          duration: classPlan.duration,
          exercises: classPlan.exercises,
          tags: classPlan.tags,
          notes: classPlan.notes,
          difficultyLevel: classPlan.difficultyLevel,
          isPublic: classPlan.isPublic,
          shareToken: classPlan.shareToken,
          viewCount: classPlan.viewCount,
          copyCount: classPlan.copyCount,
          imageUrl: classPlan.imageUrl,
          totalDuration: classPlan.totalDuration,
          classDuration: classPlan.classDuration,
          image: classPlan.image
        })
        .eq('id', classPlan.id);

      if (error) {
        throw error;
      }

      // Refresh class plans to reflect the updated class
      await fetchClassPlans();
      toast({
        title: "Class updated!",
        description: "Your class plan has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating class plan:", error);
      toast({
        title: "Error updating class",
        description: "Failed to update the class plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteClassPlan = async (classPlanId: string) => {
    setLoading(true);
    try {
      if (!user) {
        console.error("User not logged in.");
        return;
      }

      const { error } = await supabase
        .from('class_plans')
        .delete()
        .eq('id', classPlanId);

      if (error) {
        throw error;
      }

      // Refresh class plans to reflect the deleted class
      await fetchClassPlans();
      toast({
        title: "Class deleted!",
        description: "Your class plan has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting class plan:", error);
      toast({
        title: "Error deleting class",
        description: "Failed to delete the class plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    classPlans,
    savedClasses,
    loading,
    fetchClassPlans,
    saveClassPlan,
    updateClassPlan,
    deleteClassPlan,
  };
};
