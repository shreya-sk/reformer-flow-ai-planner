
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

  // Add exercise to user library
  const addToUserLibrary = async (storeExerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercise_library')
        .insert([{
          user_id: user.id,
          store_exercise_id: storeExerciseId
        }]);

      if (error) throw error;

      // Update download count by first getting current count
      const { data: currentData } = await supabase
        .from('exercise_store')
        .select('download_count')
        .eq('id', storeExerciseId)
        .single();

      if (currentData) {
        await supabase
          .from('exercise_store')
          .update({ download_count: currentData.download_count + 1 })
          .eq('id', storeExerciseId);
      }

      setUserLibrary(prev => [...prev, storeExerciseId]);
    } catch (error) {
      console.error('Error adding to user library:', error);
      throw error;
    }
  };

  // Add bundle to user library
  const addBundleToLibrary = async (bundleId: string) => {
    if (!user) return;

    try {
      // Get all exercises in the bundle
      const { data: bundleExercises, error } = await supabase
        .from('exercise_store')
        .select('id')
        .eq('bundle_id', bundleId);

      if (error) throw error;

      // Add all exercises to user library
      const exerciseIds = bundleExercises?.map(ex => ex.id) || [];
      await Promise.all(exerciseIds.map(id => addToUserLibrary(id)));

      // Update bundle download count
      const { data: currentData } = await supabase
        .from('exercise_bundles')
        .select('download_count')
        .eq('id', bundleId)
        .single();

      if (currentData) {
        await supabase
          .from('exercise_bundles')
          .update({ download_count: currentData.download_count + 1 })
          .eq('id', bundleId);
      }
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
