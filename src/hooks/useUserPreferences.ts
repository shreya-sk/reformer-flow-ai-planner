import { useState, useEffect } from 'react';

interface UserPreferences {
  darkMode: boolean;
  showPregnancySafeOnly?: boolean;
  profileImage?: string;
  customCallouts?: string[];
  favoriteExercises?: string[];
  hiddenExercises?: string[];
}

const PREFERENCES_KEY = 'user-preferences';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
    return { 
      darkMode: false, 
      showPregnancySafeOnly: false,
      profileImage: '',
      customCallouts: [],
      favoriteExercises: [],
      hiddenExercises: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const addCustomCallout = (callout: string) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: [...(prev.customCallouts || []), callout]
    }));
  };

  const removeCustomCallout = (callout: string) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: (prev.customCallouts || []).filter(c => c !== callout)
    }));
  };

  const updateCustomCallouts = (callouts: string[]) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: callouts
    }));
  };

  const toggleFavoriteExercise = (exerciseId: string) => {
    setPreferences(prev => {
      const favorites = prev.favoriteExercises || [];
      const isAlreadyFavorite = favorites.includes(exerciseId);
      
      return {
        ...prev,
        favoriteExercises: isAlreadyFavorite
          ? favorites.filter(id => id !== exerciseId)
          : [...favorites, exerciseId]
      };
    });
  };

  const toggleHiddenExercise = (exerciseId: string) => {
    setPreferences(prev => {
      const hidden = prev.hiddenExercises || [];
      const isAlreadyHidden = hidden.includes(exerciseId);
      
      return {
        ...prev,
        hiddenExercises: isAlreadyHidden
          ? hidden.filter(id => id !== exerciseId)
          : [...hidden, exerciseId]
      };
    });
  };

  const togglePregnancySafeOnly = () => {
    setPreferences(prev => ({
      ...prev,
      showPregnancySafeOnly: !prev.showPregnancySafeOnly
    }));
  };

  return {
    preferences,
    updatePreferences,
    addCustomCallout,
    removeCustomCallout,
    updateCustomCallouts,
    toggleFavoriteExercise,
    toggleHiddenExercise,
    togglePregnancySafeOnly
  };
};