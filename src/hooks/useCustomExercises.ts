
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

export const useCustomExercises = () => {
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCustomExercises = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_exercises')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom exercises:', error);
        return;
      }

      const transformedData: Exercise[] = data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category as any,
        duration: item.duration,
        springs: item.springs as any,
        difficulty: item.difficulty as any,
        intensityLevel: 'medium' as const,
        muscleGroups: item.muscle_groups as any[],
        equipment: item.equipment as any[],
        description: item.description || '',
        image: item.image_url || '',
        videoUrl: item.video_url || '',
        notes: item.notes || '',
        cues: item.cues || [],
        transitions: [],
        contraindications: item.contraindications || [],
        isPregnancySafe: item.is_pregnancy_safe,
        isCustom: true,
      }));
      
      setCustomExercises(transformedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomExercise = async (exercise: Omit<Exercise, 'id'>) => {
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

      if (error) {
        console.error('Error saving custom exercise:', error);
        toast({
          title: "Error saving exercise",
          description: "Failed to save your custom exercise.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Exercise created!",
        description: `"${exercise.name}" has been added to your library.`,
      });

      fetchCustomExercises();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteCustomExercise = async (exerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercises')
        .delete()
        .eq('id', exerciseId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting custom exercise:', error);
        toast({
          title: "Error deleting exercise",
          description: "Failed to delete the custom exercise.",
          variant: "destructive",
        });
        return;
      }

      setCustomExercises(prev => prev.filter(ex => ex.id !== exerciseId));
      toast({
        title: "Exercise deleted",
        description: "Custom exercise has been removed.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomExercises();
    }
  }, [user]);

  return {
    customExercises,
    loading,
    saveCustomExercise,
    deleteCustomExercise,
    fetchCustomExercises,
  };
};
