
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/types/reformer';

export const useCustomExercises = () => {
  const [customExercisesData, setCustomExercisesData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomExercises = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_exercises')
          .select('*');

        if (error) {
          console.error('Error fetching custom exercises:', error);
        }

        setCustomExercisesData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomExercises();
  }, []);

  const exercises: Exercise[] = customExercisesData?.map(exercise => ({
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
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
    transitions: [],
    contraindications: exercise.contraindications || [],
    isPregnancySafe: exercise.is_pregnancy_safe || false,
    isCustom: true
  })) || [];

  return {
    exercises,
    loading
  };
};
