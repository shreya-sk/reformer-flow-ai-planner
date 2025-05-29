
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise } from '@/types/reformer';
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
          category: exercise.category as any,
          duration: customization?.custom_duration || exercise.duration,
          springs: customization?.custom_springs || exercise.springs,
          difficulty: customization?.custom_difficulty || exercise.difficulty,
          intensityLevel: 'medium' as const,
          muscleGroups: exercise.muscle_groups || [],
          equipment: exercise.equipment || [],
          description: exercise.description || '',
          image: exercise.image_url || '',
          videoUrl: exercise.video_url || '',
          notes: customization?.custom_notes || exercise.notes || '',
          cues: customization?.custom_cues || exercise.cues || [],
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
        category: exercise.category as any,
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
          ...customizations,
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

  useEffect(() => {
    fetchExercises();
  }, [user]);

  return {
    exercises,
    loading,
    fetchExercises,
    createUserExercise,
    customizeSystemExercise,
  };
};
