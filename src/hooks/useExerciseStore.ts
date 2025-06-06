import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  is_featured: boolean;
  bundle_id: string | null;
  download_count: number;
}

interface ExerciseBundle {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  exercise_count: number;
  is_featured: boolean;
  download_count: number;
}

export const useExerciseStore = () => {
  const { user } = useAuth();
  const [storeExercises, setStoreExercises] = useState<StoreExercise[]>([]);
  const [bundles, setBundles] = useState<ExerciseBundle[]>([]);
  const [userLibrary, setUserLibrary] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch store exercises
  const fetchStoreExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_store')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('name');

      if (error) throw error;
      setStoreExercises(data || []);
    } catch (error) {
      console.error('Error fetching store exercises:', error);
    }
  };

  // Fetch bundles
  const fetchBundles = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_bundles')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('name');

      if (error) throw error;
      setBundles(data || []);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  // Fetch user library
  const fetchUserLibrary = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_exercise_library')
        .select('store_exercise_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserLibrary(data?.map(item => item.store_exercise_id) || []);
    } catch (error) {
      console.error('Error fetching user library:', error);
    }
  };

  // Simplified addToUserLibrary - this just tracks the relationship
  const addToUserLibrary = async (storeExerciseId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data: existing, error: checkError } = await supabase
        .from('user_exercise_library')
        .select('id')
        .eq('user_id', user.id)
        .eq('store_exercise_id', storeExerciseId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        console.log('Exercise already in library');
        return;
      }

      const { error: insertError } = await supabase
        .from('user_exercise_library')
        .insert([{
          user_id: user.id,
          store_exercise_id: storeExerciseId
        }]);

      if (insertError) throw insertError;

      setUserLibrary(prev => [...prev, storeExerciseId]);
      
      console.log('Successfully added exercise to library:', storeExerciseId);
    } catch (error) {
      console.error('Error adding to user library:', error);
      throw error;
    }
  };

  // Add bundle to user library
  const addBundleToLibrary = async (bundleId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data: bundleExercises, error } = await supabase
        .from('exercise_store')
        .select('id')
        .eq('bundle_id', bundleId);

      if (error) throw error;

      const exerciseIds = bundleExercises?.map(ex => ex.id) || [];
      
      for (const exerciseId of exerciseIds) {
        try {
          await addToUserLibrary(exerciseId);
        } catch (error) {
          console.warn(`Failed to add exercise ${exerciseId}:`, error);
        }
      }

      const { data: currentData, error: fetchError } = await supabase
        .from('exercise_bundles')
        .select('download_count')
        .eq('id', bundleId)
        .single();

      if (!fetchError && currentData) {
        await supabase
          .from('exercise_bundles')
          .update({ download_count: (currentData.download_count || 0) + 1 })
          .eq('id', bundleId);
      }

      console.log('Successfully added bundle to library:', bundleId);
    } catch (error) {
      console.error('Error adding bundle to library:', error);
      throw error;
    }
  };

  // Remove from user library
  const removeFromUserLibrary = async (storeExerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercise_library')
        .delete()
        .eq('user_id', user.id)
        .eq('store_exercise_id', storeExerciseId);

      if (error) throw error;
      setUserLibrary(prev => prev.filter(id => id !== storeExerciseId));
    } catch (error) {
      console.error('Error removing from user library:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStoreExercises(),
        fetchBundles(),
        fetchUserLibrary()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    storeExercises,
    bundles,
    userLibrary,
    loading,
    addToUserLibrary,
    addBundleToLibrary,
    removeFromUserLibrary,
    refetch: () => {
      fetchStoreExercises();
      fetchBundles();
      fetchUserLibrary();
    }
  };
};
