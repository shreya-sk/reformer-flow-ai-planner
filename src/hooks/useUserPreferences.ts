
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserPreferences {
  id?: string;
  showPregnancySafeOnly: boolean;
  darkMode: boolean;
  favoriteExercises: string[];
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    showPregnancySafeOnly: false,
    darkMode: false,
    favoriteExercises: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        toast({
          title: "Error loading preferences",
          description: "Using default settings.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data) {
        setPreferences({
          id: data.id,
          showPregnancySafeOnly: data.show_pregnancy_safe_only || false,
          darkMode: data.dark_mode || false,
          favoriteExercises: data.favorite_exercises ? Array.from(data.favorite_exercises as string[]) : [],
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error loading preferences",
        description: "Using default settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save preferences.",
        variant: "destructive",
      });
      return false;
    }

    const updatedPreferences = { ...preferences, ...newPreferences };
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          show_pregnancy_safe_only: updatedPreferences.showPregnancySafeOnly,
          dark_mode: updatedPreferences.darkMode,
          favorite_exercises: updatedPreferences.favoriteExercises,
        });

      if (error) {
        console.error('Error updating preferences:', error);
        toast({
          title: "Failed to save preferences",
          description: "Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Update local state only after successful database update
      setPreferences(updatedPreferences);
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Failed to save preferences",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !preferences.darkMode;
    const success = await updatePreferences({ darkMode: newDarkMode });
    if (success) {
      toast({
        title: "Theme updated",
        description: `Switched to ${newDarkMode ? 'dark' : 'light'} mode.`,
      });
    }
  };

  const togglePregnancySafeOnly = async () => {
    const newValue = !preferences.showPregnancySafeOnly;
    await updatePreferences({ showPregnancySafeOnly: newValue });
  };

  const toggleFavoriteExercise = async (exerciseId: string) => {
    const currentFavorites = preferences.favoriteExercises || [];
    const newFavorites = currentFavorites.includes(exerciseId)
      ? currentFavorites.filter(id => id !== exerciseId)
      : [...currentFavorites, exerciseId];
    
    await updatePreferences({ favoriteExercises: newFavorites });
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences({
        showPregnancySafeOnly: false,
        darkMode: false,
        favoriteExercises: [],
      });
      setLoading(false);
    }
  }, [user]);

  // Apply dark mode to document
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  return {
    preferences,
    loading,
    updatePreferences,
    toggleDarkMode,
    togglePregnancySafeOnly,
    toggleFavoriteExercise,
  };
};
