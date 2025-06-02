
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment } from '@/types/reformer';
import { useAuth } from '@/contexts/AuthContext';

export const useCustomExercises = () => {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCustomExercises = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_exercises')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exercises: Exercise[] = data?.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category as ExerciseCategory,
        position: 'supine' as const,
        primaryMuscle: 'core' as const,
        duration: exercise.duration,
        springs: exercise.springs as SpringSetting,
        difficulty: exercise.difficulty as DifficultyLevel,
        intensityLevel: 'medium' as const,
        muscleGroups: (exercise.muscle_groups || []) as MuscleGroup[],
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
        teachingFocus: exercise.teaching_focus || [],
        modifications: exercise.modifications || [],
        progressions: exercise.progressions || [],
        regressions: exercise.regressions || [],
        transitions: [], // Default empty array since property doesn't exist in DB
        contraindications: exercise.contraindications || [],
        isPregnancySafe: exercise.is_pregnancy_safe || false,
        isCustom: true,
        createdAt: new Date(exercise.created_at),
        updatedAt: new Date(exercise.updated_at)
      })) || [];

      setCustomExercises(exercises);
    } catch (err) {
      console.error('Error fetching custom exercises:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveCustomExercise = async (exercise: Exercise) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .upsert({
          id: exercise.id,
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
          is_pregnancy_safe: exercise.isPregnancySafe,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCustomExercises();
      return data;
    } catch (err) {
      console.error('Error saving custom exercise:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteCustomExercise = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCustomExercises();
    } catch (err) {
      console.error('Error deleting custom exercise:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchCustomExercises();
  }, [user]);

  return {
    customExercises,
    loading,
    error,
    saveCustomExercise,
    deleteCustomExercise,
    refetch: fetchCustomExercises
  };
};
