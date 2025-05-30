import { useState, useEffect } from 'react';
import { CustomCallout } from '@/types/reformer';

interface UserPreferences {
  darkMode: boolean;
  showPregnancySafeOnly?: boolean;
  profileImage?: string;
  customCallouts?: CustomCallout[];
  favoriteExercises?: string[];
  hiddenExercises?: string[];
}

const PREFERENCES_KEY = 'user-preferences';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          customCallouts: (parsed.customCallouts || []).map((callout: any) => ({
            ...callout,
            createdAt: new Date(callout.createdAt)
          }))
        };
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

  const addCustomCallout = (name: string, color: string) => {
    const newCallout: CustomCallout = {
      id: `callout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      text: '',
      color,
      backgroundColor: `${color}-50`,
      fontSize: 16,
      fontWeight: 'medium',
      textAlign: 'left',
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    };

    const updatedCallouts = [...(preferences.customCallouts || []), newCallout];
    updatePreferences({ customCallouts: updatedCallouts });
  };

  const updateCustomCallout = (id: string, updates: Partial<Pick<CustomCallout, 'name' | 'color'>>) => {
    const updatedCallouts = (preferences.customCallouts || []).map(callout =>
      callout.id === id ? { ...callout, ...updates, updatedAt: new Date() } : callout
    );
    updatePreferences({ customCallouts: updatedCallouts });
  };

  const deleteCustomCallout = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: (prev.customCallouts || []).filter(callout => callout.id !== id)
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
    updateCustomCallout,
    deleteCustomCallout,
    toggleFavoriteExercise,
    toggleHiddenExercise,
    togglePregnancySafeOnly
  };
};
