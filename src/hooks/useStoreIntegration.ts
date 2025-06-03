
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

interface StoreExercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  springs: string;
  muscle_groups: string[];
  equipment: string[];
  description: string;
  image_url: string;
  video_url: string;
  notes: string;
  cues: string[];
  setup: string;
  reps_or_duration: string;
  tempo: string;
  target_areas: string[];
  breathing_cues: string[];
  teaching_focus: string[];
  modifications: string[];
  progressions: string[];
  regressions: string[];
  contraindications: string[];
  is_pregnancy_safe: boolean;
}

export const useStoreIntegration = () => {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const addStoreExerciseToLibrary = async (storeExercise: StoreExercise): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsAdding(true);
    try {
      // First, add to user_exercise_library table for tracking
      const { error: libraryError } = await supabase
        .from('user_exercise_library')
        .insert([{
          user_id: user.id,
          store_exercise_id: storeExercise.id
        }]);

      if (libraryError && libraryError.code !== '23505') { // Ignore duplicate key error
        throw libraryError;
      }

      // Create actual user exercise record so it appears in main library
      const userExerciseData = {
        user_id: user.id,
        name: storeExercise.name,
        category: storeExercise.category,
        duration: storeExercise.duration,
        springs: storeExercise.springs,
        difficulty: storeExercise.difficulty,
        muscle_groups: storeExercise.muscle_groups,
        equipment: storeExercise.equipment,
        description: storeExercise.description,
        image_url: storeExercise.image_url,
        video_url: storeExercise.video_url,
        notes: storeExercise.notes,
        cues: storeExercise.cues,
        setup: storeExercise.setup,
        reps_or_duration: storeExercise.reps_or_duration,
        tempo: storeExercise.tempo,
        target_areas: storeExercise.target_areas,
        breathing_cues: storeExercise.breathing_cues,
        teaching_focus: storeExercise.teaching_focus,
        modifications: storeExercise.modifications,
        progressions: storeExercise.progressions,
        regressions: storeExercise.regressions,
        contraindications: storeExercise.contraindications,
        is_pregnancy_safe: storeExercise.is_pregnancy_safe
      };

      const { error: exerciseError } = await supabase
        .from('user_exercises')
        .insert([userExerciseData]);

      if (exerciseError) {
        throw exerciseError;
      }

      // Update download count
      const { data: currentData, error: fetchError } = await supabase
        .from('exercise_store')
        .select('download_count')
        .eq('id', storeExercise.id)
        .single();

      if (!fetchError && currentData) {
        await supabase
          .from('exercise_store')
          .update({ download_count: (currentData.download_count || 0) + 1 })
          .eq('id', storeExercise.id);
      }

      toast({
        title: "Added to Library!",
        description: `"${storeExercise.name}" is now available in your exercise library.`,
      });

    } catch (error) {
      console.error('Error adding store exercise to library:', error);
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addStoreExerciseToLibrary,
    isAdding
  };
};
