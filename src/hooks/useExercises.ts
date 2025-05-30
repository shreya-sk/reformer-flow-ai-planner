import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment, TeachingFocus } from '@/types/reformer';
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
          springs: (customization?.custom_springs || exercise.springs) as SpringSetting,
          difficulty: (customization?.custom_difficulty || exercise.difficulty) as DifficultyLevel,
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
          setup: customization?.custom_setup || exercise.setup || '',
          repsOrDuration: customization?.custom_reps_or_duration || exercise.reps_or_duration || '',
          tempo: customization?.custom_tempo || exercise.tempo || '',
          targetAreas: customization?.custom_target_areas || exercise.target_areas || [],
          breathingCues: customization?.custom_breathing_cues || exercise.breathing_cues || [],
          teachingFocus: (customization?.custom_teaching_focus || exercise.teaching_focus || []) as TeachingFocus[],
          modifications: customization?.custom_modifications || exercise.modifications || [],
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
        setup: exercise.setup || '',
        repsOrDuration: exercise.reps_or_duration || '',
        tempo: exercise.tempo || '',
        targetAreas: exercise.target_areas || [],
        breathingCues: exercise.breathing_cues || [],
        teachingFocus: (exercise.teaching_focus || []) as TeachingFocus[],
        modifications: exercise.modifications || [],
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
          setup: exercise.setup,
          reps_or_duration: exercise.repsOrDuration,
          tempo: exercise.tempo,
          target_areas: exercise.targetAreas,
          breathing_cues: exercise.breathingCues,
          teaching_focus: exercise.teachingFocus,
          modifications: exercise.modifications,
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
          custom_setup: customizations.custom_setup,
          custom_reps_or_duration: customizations.custom_reps_or_duration,
          custom_tempo: customizations.custom_tempo,
          custom_target_areas: customizations.custom_target_areas,
          custom_breathing_cues: customizations.custom_breathing_cues,
          custom_teaching_focus: customizations.custom_teaching_focus,
          custom_modifications: customizations.custom_modifications,
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
          setup: updates.setup,
          reps_or_duration: updates.repsOrDuration,
          tempo: updates.tempo,
          target_areas: updates.targetAreas,
          breathing_cues: updates.breathingCues,
          teaching_focus: updates.teachingFocus,
          modifications: updates.modifications,
          progressions: updates.progressions,
          regressions: updates.regressions,
          contraindications: updates.contraindications,
          description: updates.description,
          muscle_groups: updates.muscleGroups,
          equipment: updates.equipment,
          is_pregnancy_safe: updates.isPregnancySafe,
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

  // Add refetchExercises as an alias to fetchExercises for backward compatibility
  const refetchExercises = fetchExercises;

  useEffect(() => {
    fetchExercises();
  }, [user]);

  return {
    exercises,
    loading,
    fetchExercises,
    refetchExercises, // Add this property
    createUserExercise,
    customizeSystemExercise,
    updateUserExercise,
    resetSystemExerciseToOriginal,
  };
};
