
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserPreferences {
  id?: string;
  showPregnancySafeOnly: boolean;
  darkMode: boolean;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    showPregnancySafeOnly: false,
    darkMode: false,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          id: data.id,
          showPregnancySafeOnly: data.show_pregnancy_safe_only || false,
          darkMode: data.dark_mode || false,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          show_pregnancy_safe_only: updatedPreferences.showPregnancySafeOnly,
          dark_mode: updatedPreferences.darkMode,
        });

      if (error) {
        console.error('Error updating preferences:', error);
        toast({
          title: "Error updating preferences",
          description: "Failed to save your preferences.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !preferences.darkMode;
    updatePreferences({ darkMode: newDarkMode });
  };

  const togglePregnancySafeOnly = () => {
    updatePreferences({ showPregnancySafeOnly: !preferences.showPregnancySafeOnly });
  };

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
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
  };
};
