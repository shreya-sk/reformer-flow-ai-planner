
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

  useEffect(() => {
    fetchExercises();
  }, [user]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises
  };
};
