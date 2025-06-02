
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/types/reformer';
import { useAuth } from '@/contexts/AuthContext';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExercises = async () => {
    try {
      setLoading(true);
      
      // Fetch system exercises
      const { data: systemData, error: systemError } = await supabase
        .from('system_exercises')
        .select('*')
        .eq('is_active', true);

      if (systemError) throw systemError;

      const systemExercises = systemData?.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        position: 'supine' as const, // Default position for existing exercises
        primaryMuscle: 'core' as const, // Default primary muscle for existing exercises  
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
        transitions: exercise.transitions || [],
        contraindications: exercise.contraindications || [],
        isPregnancySafe: exercise.is_pregnancy_safe || false,
        isSystemExercise: true,
        isCustomized: false,
        createdAt: new Date(exercise.created_at),
        updatedAt: new Date(exercise.updated_at)
      })) || [];

      let userExercises: Exercise[] = [];
      
      // Fetch user exercises if authenticated
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('user_exercises')
          .select('*')
          .eq('user_id', user.id);

        if (userError) throw userError;

        userExercises = userData?.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          position: 'supine' as const, // Default position for existing exercises
          primaryMuscle: 'core' as const, // Default primary muscle for existing exercises
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
          transitions: exercise.transitions || [],
          contraindications: exercise.contraindications || [],
          isPregnancySafe: exercise.is_pregnancy_safe || false,
          isCustom: true,
          isSystemExercise: false,
          createdAt: new Date(exercise.created_at),
          updatedAt: new Date(exercise.updated_at)
        })) || [];
      }

      const allExercises = [...systemExercises, ...userExercises];
      setExercises(allExercises);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createUserExercise = async (exerciseData: Omit<Exercise, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .insert({
          user_id: user.id,
          name: exerciseData.name,
          category: exerciseData.category,
          duration: exerciseData.duration,
          springs: exerciseData.springs,
          difficulty: exerciseData.difficulty,
          muscle_groups: exerciseData.muscleGroups,
          equipment: exerciseData.equipment,
          description: exerciseData.description,
          image_url: exerciseData.image,
          video_url: exerciseData.videoUrl,
          notes: exerciseData.notes,
          cues: exerciseData.cues,
          setup: exerciseData.setup,
          reps_or_duration: exerciseData.repsOrDuration,
          tempo: exerciseData.tempo,
          target_areas: exerciseData.targetAreas,
          breathing_cues: exerciseData.breathingCues,
          teaching_focus: exerciseData.teachingFocus,
          modifications: exerciseData.modifications,
          progressions: exerciseData.progressions,
          regressions: exerciseData.regressions,
          contraindications: exerciseData.contraindications,
          is_pregnancy_safe: exerciseData.isPregnancySafe
        })
        .select()
        .single();

      if (error) throw error;
      await fetchExercises();
      return data;
    } catch (err) {
      console.error('Error creating user exercise:', err);
      throw err;
    }
  };

  const updateUserExercise = async (id: string, exerciseData: Partial<Exercise>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .update({
          name: exerciseData.name,
          category: exerciseData.category,
          duration: exerciseData.duration,
          springs: exerciseData.springs,
          difficulty: exerciseData.difficulty,
          muscle_groups: exerciseData.muscleGroups,
          equipment: exerciseData.equipment,
          description: exerciseData.description,
          image_url: exerciseData.image,
          video_url: exerciseData.videoUrl,
          notes: exerciseData.notes,
          cues: exerciseData.cues,
          setup: exerciseData.setup,
          reps_or_duration: exerciseData.repsOrDuration,
          tempo: exerciseData.tempo,
          target_areas: exerciseData.targetAreas,
          breathing_cues: exerciseData.breathingCues,
          teaching_focus: exerciseData.teachingFocus,
          modifications: exerciseData.modifications,
          progressions: exerciseData.progressions,
          regressions: exerciseData.regressions,
          contraindications: exerciseData.contraindications,
          is_pregnancy_safe: exerciseData.isPregnancySafe,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchExercises();
      return data;
    } catch (err) {
      console.error('Error updating user exercise:', err);
      throw err;
    }
  };

  const duplicateExercise = async (exercise: Exercise) => {
    const duplicatedData = {
      ...exercise,
      name: `${exercise.name} (Copy)`,
      isCustom: true
    };
    
    // Remove id and other non-insertable fields
    const { id, createdAt, updatedAt, isSystemExercise, isCustomized, ...insertData } = duplicatedData;
    
    return createUserExercise(insertData);
  };

  const deleteUserExercise = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchExercises();
    } catch (err) {
      console.error('Error deleting user exercise:', err);
      throw err;
    }
  };

  const customizeSystemExercise = async (exercise: Exercise, customizations: Partial<Exercise>) => {
    // This would create a customization record for a system exercise
    return updateUserExercise(exercise.id, customizations);
  };

  const resetSystemExerciseToOriginal = async (exerciseId: string) => {
    // This would reset a customized system exercise to its original state
    await fetchExercises();
  };

  useEffect(() => {
    fetchExercises();
  }, [user]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    createUserExercise,
    updateUserExercise,
    duplicateExercise,
    deleteUserExercise,
    customizeSystemExercise,
    resetSystemExerciseToOriginal
  };
};
