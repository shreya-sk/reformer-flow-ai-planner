
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchExercises = async () => {
    setLoading(true);
    try {
      // Fetch system exercises
      const { data: systemExercises, error: systemError } = await supabase
        .from('system_exercises')
        .select('*')
        .eq('is_active', true);

      if (systemError) throw systemError;

      // Fetch user exercises if authenticated
      let userExercises: any[] = [];
      let customizations: any[] = [];
      
      if (user) {
        const { data: userExercisesData, error: userError } = await supabase
          .from('user_exercises')
          .select('*')
          .eq('user_id', user.id);

        if (userError) throw userError;
        userExercises = userExercisesData || [];

        // Fetch user customizations
        const { data: customizationsData, error: customError } = await supabase
          .from('user_exercise_customizations')
          .select('*')
          .eq('user_id', user.id);

        if (customError) throw customError;
        customizations = customizationsData || [];
      }

      // Transform system exercises with customizations
      const transformedSystemExercises: Exercise[] = systemExercises.map(exercise => {
        const customization = customizations.find(c => c.system_exercise_id === exercise.id);
        
        return {
          id: exercise.id,
          name: customization?.custom_name || exercise.name,
          category: exercise.category as ExerciseCategory,
          duration: customization?.custom_duration || exercise.duration,
          springs: customization?.custom_springs || exercise.springs as SpringSetting,
          difficulty: customization?.custom_difficulty || exercise.difficulty as DifficultyLevel,
          intensityLevel: 'medium' as const,
          muscleGroups: (exercise.muscle_groups || []).filter(group => 
            ['core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body',
             'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs', 'obliques',
             'transverse-abdominis', 'traps', 'deltoids', 'biceps', 'triceps', 'lats',
             'chest', 'rhomboids', 'erector-spinae', 'hip-flexors', 'adductors', 'abductors',
             'pelvic-floor', 'deep-stabilizers', 'spinal-extensors', 'neck', 'forearms',
             'wrists', 'ankles', 'feet', 'hip-abductors', 'hip-adductors', 'rotator-cuff',
             'serratus-anterior', 'psoas', 'iliotibial-band', 'thoracic-spine', 'lumbar-spine',
             'cervical-spine', 'diaphragm', 'intercostals'].includes(group)
          ) as MuscleGroup[],
          equipment: (exercise.equipment || []) as Equipment[],
          description: exercise.description || '',
          image: exercise.image_url || '',
          videoUrl: exercise.video_url || '',
          notes: customization?.custom_notes || exercise.notes || '',
          cues: customization?.custom_cues || exercise.cues || [],
          progressions: exercise.progressions || [],
          regressions: exercise.regressions || [],
          transitions: [],
          contraindications: exercise.contraindications || [],
          isPregnancySafe: exercise.is_pregnancy_safe || false,
          isSystemExercise: true,
          isCustomized: !!customization,
        };
      });

      // Transform user exercises
      const transformedUserExercises: Exercise[] = userExercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category as ExerciseCategory,
        duration: exercise.duration,
        springs: exercise.springs as SpringSetting,
        difficulty: exercise.difficulty as DifficultyLevel,
        intensityLevel: 'medium' as const,
        muscleGroups: (exercise.muscle_groups || []).filter(group => 
          ['core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body',
           'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs', 'obliques',
           'transverse-abdominis', 'traps', 'deltoids', 'biceps', 'triceps', 'lats',
           'chest', 'rhomboids', 'erector-spinae', 'hip-flexors', 'adductors', 'abductors',
           'pelvic-floor', 'deep-stabilizers', 'spinal-extensors', 'neck', 'forearms',
           'wrists', 'ankles', 'feet', 'hip-abductors', 'hip-adductors', 'rotator-cuff',
           'serratus-anterior', 'psoas', 'iliotibial-band', 'thoracic-spine', 'lumbar-spine',
           'cervical-spine', 'diaphragm', 'intercostals'].includes(group)
        ) as MuscleGroup[],
        equipment: (exercise.equipment || []) as Equipment[],
        description: exercise.description || '',
        image: exercise.image_url || '',
        videoUrl: exercise.video_url || '',
        notes: exercise.notes || '',
        cues: exercise.cues || [],
        progressions: exercise.progressions || [],
        regressions: exercise.regressions || [],
        transitions: [],
        contraindications: exercise.contraindications || [],
        isPregnancySafe: exercise.is_pregnancy_safe || false,
        isCustom: true,
        isSystemExercise: false,
      }));

      setExercises([...transformedSystemExercises, ...transformedUserExercises]);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Error loading exercises",
        description: "Failed to load exercises.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserExercise = async (exercise: Omit<Exercise, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .insert({
          user_id: user.id,
          name: exercise.name,
          category: exercise.category,
          duration: exercise.duration,
          springs: exercise.springs,
          difficulty: exercise.difficulty,
          muscle_groups: exercise.muscleGroups,
          equipment: exercise.equipment,
          description: exercise.description,
          image_url: exercise.image,
          video_url: exercise.videoUrl,
          notes: exercise.notes,
          cues: exercise.cues,
          progressions: exercise.progressions,
          regressions: exercise.regressions,
          contraindications: exercise.contraindications,
          is_pregnancy_safe: exercise.isPregnancySafe || false,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchExercises();
      return data;
    } catch (error) {
      console.error('Error creating user exercise:', error);
      throw error;
    }
  };

  const customizeSystemExercise = async (systemExerciseId: string, customizations: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercise_customizations')
        .upsert({
          user_id: user.id,
          system_exercise_id: systemExerciseId,
          custom_name: customizations.custom_name,
          custom_duration: customizations.custom_duration,
          custom_springs: customizations.custom_springs,
          custom_cues: customizations.custom_cues,
          custom_notes: customizations.custom_notes,
          custom_difficulty: customizations.custom_difficulty,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchExercises();
      return data;
    } catch (error) {
      console.error('Error customizing system exercise:', error);
      throw error;
    }
  };

  const updateUserExercise = async (exerciseId: string, updates: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .update({
          name: updates.name,
          duration: updates.duration,
          springs: updates.springs,
          cues: updates.cues,
          notes: updates.notes,
          difficulty: updates.difficulty,
          progressions: updates.progressions,
          regressions: updates.regressions,
          description: updates.description,
          muscle_groups: updates.muscleGroups,
          updated_at: new Date().toISOString(),
        })
        .eq('id', exerciseId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchExercises();
      return data;
    } catch (error) {
      console.error('Error updating user exercise:', error);
      throw error;
    }
  };

  const resetSystemExerciseToOriginal = async (systemExerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercise_customizations')
        .delete()
        .eq('system_exercise_id', systemExerciseId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await fetchExercises();
      
      toast({
        title: "Reset successful",
        description: "Exercise has been reset to its original version.",
      });
    } catch (error) {
      console.error('Error resetting exercise:', error);
      toast({
        title: "Reset failed",
        description: "Could not reset exercise to original.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [user]);

  return {
    exercises,
    loading,
    fetchExercises,
    createUserExercise,
    customizeSystemExercise,
    updateUserExercise,
    resetSystemExerciseToOriginal,
  };
};
