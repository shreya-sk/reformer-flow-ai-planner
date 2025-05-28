import { useState, useEffect } from 'react';

export interface UserPreferences {
  darkMode: boolean;
  favoriteExercises: string[];
  customCallouts: string[];
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  favoriteExercises: [],
  customCallouts: ['Warm-up', 'Standing', 'Supine', 'Prone', 'Cool-down'],
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const storedPreferences = localStorage.getItem('user-preferences');
      if (storedPreferences) {
        return JSON.parse(storedPreferences) as UserPreferences;
      }
    } catch (error) {
      console.error('Failed to load user preferences from localStorage:', error);
    }
    return defaultPreferences;
  });

  useEffect(() => {
    try {
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences to localStorage:', error);
    }
  }, [preferences]);

  const toggleDarkMode = () => {
    setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleFavoriteExercise = (exerciseId: string) => {
    setPreferences(prev => {
      const isFavorite = prev.favoriteExercises.includes(exerciseId);
      const updatedFavorites = isFavorite
        ? prev.favoriteExercises.filter(id => id !== exerciseId)
        : [...prev.favoriteExercises, exerciseId];
      return { ...prev, favoriteExercises: updatedFavorites };
    });
  };

  const clearFavorites = () => {
    setPreferences(prev => ({ ...prev, favoriteExercises: [] }));
  };

  const addCustomCallout = (calloutName: string) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: [...prev.customCallouts, calloutName]
    }));
  };

  const removeCustomCallout = (calloutName: string) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: prev.customCallouts.filter(c => c !== calloutName)
    }));
  };

  const updateCustomCallouts = (callouts: string[]) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: callouts
    }));
  };

  return {
    preferences,
    toggleDarkMode,
    toggleFavoriteExercise,
    clearFavorites,
    addCustomCallout,
    removeCustomCallout,
    updateCustomCallouts,
  };
};
