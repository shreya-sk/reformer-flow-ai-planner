import { useState, useEffect } from 'react';
import { CustomCallout } from '@/types/reformer';

interface ExerciseDetailPreferences {
  showSpringsEquipment: boolean;
  showTeachingCues: boolean;
  showBreathingCues: boolean;
  showSetupInstructions: boolean;
  showMuscleGroups: boolean;
  showProgressions: boolean;
  showRegressions: boolean;
  showModifications: boolean;
  showSafetyNotes: boolean;
  showDescription: boolean;
  showMedia: boolean;
  showPregnancySafety: boolean;
}

interface UserPreferences {
  darkMode: boolean;
  showPregnancySafeOnly?: boolean;
  profileImage?: string;
  customCallouts?: CustomCallout[];
  favoriteExercises?: string[];
  hiddenExercises?: string[];
  exerciseDetailPreferences?: ExerciseDetailPreferences;
}

const PREFERENCES_KEY = 'user-preferences';

const defaultDetailPreferences: ExerciseDetailPreferences = {
  showSpringsEquipment: true,
  showTeachingCues: true,
  showBreathingCues: true,
  showSetupInstructions: true,
  showMuscleGroups: true,
  showProgressions: true,
  showRegressions: true,
  showModifications: true,
  showSafetyNotes: true,
  showDescription: true,
  showMedia: true,
  showPregnancySafety: true,
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          exerciseDetailPreferences: {
            ...defaultDetailPreferences,
            ...parsed.exerciseDetailPreferences
          },
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
      hiddenExercises: [],
      exerciseDetailPreferences: defaultDetailPreferences
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

  const updateDetailPreferences = (updates: Partial<ExerciseDetailPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      exerciseDetailPreferences: {
        ...prev.exerciseDetailPreferences,
        ...defaultDetailPreferences,
        ...updates
      }
    }));
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
    updateDetailPreferences,
    addCustomCallout,
    updateCustomCallout,
    deleteCustomCallout,
    toggleFavoriteExercise,
    toggleHiddenExercise,
    togglePregnancySafeOnly
  };
};
