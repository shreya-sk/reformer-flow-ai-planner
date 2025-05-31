import { useState, useEffect, useCallback } from 'react';
import { CustomCallout } from '@/types/reformer';
import { useDataSync } from './useDataSync';

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

interface TeachingModePreferences {
  showSetupInstructions: boolean;
  showTeachingCues: boolean;
  showBreathingCues: boolean;
  showSafetyNotes: boolean;
  showProgressionsRegressions: boolean;
  showTimer: boolean;
  showExerciseImage: boolean;
}

interface UserPreferences {
  darkMode: boolean;
  showPregnancySafeOnly?: boolean;
  profileImage?: string;
  customCallouts?: CustomCallout[];
  favoriteExercises?: string[];
  hiddenExercises?: string[];
  exerciseDetailPreferences?: ExerciseDetailPreferences;
  teachingModePreferences?: TeachingModePreferences;
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

const defaultTeachingModePreferences: TeachingModePreferences = {
  showSetupInstructions: true,
  showTeachingCues: true,
  showBreathingCues: true,
  showSafetyNotes: true,
  showProgressionsRegressions: true,
  showTimer: true,
  showExerciseImage: true,
};

export const useUserPreferences = () => {
  const { markPendingChanges } = useDataSync();
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('🔵 Loading preferences from localStorage:', parsed);
        return {
          ...parsed,
          exerciseDetailPreferences: {
            ...defaultDetailPreferences,
            ...parsed.exerciseDetailPreferences
          },
          teachingModePreferences: {
            ...defaultTeachingModePreferences,
            ...parsed.teachingModePreferences
          },
          customCallouts: (parsed.customCallouts || []).map((callout: any) => ({
            ...callout,
            createdAt: new Date(callout.createdAt)
          })),
          favoriteExercises: parsed.favoriteExercises || [],
          hiddenExercises: parsed.hiddenExercises || []
        };
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
    
    const defaultPrefs = { 
      darkMode: false, 
      showPregnancySafeOnly: false,
      profileImage: '',
      customCallouts: [],
      favoriteExercises: [],
      hiddenExercises: [],
      exerciseDetailPreferences: defaultDetailPreferences,
      teachingModePreferences: defaultTeachingModePreferences
    };
    
    console.log('🔵 Using default preferences:', defaultPrefs);
    return defaultPrefs;
  });

  // Save to localStorage immediately when preferences change
  const saveToLocalStorage = useCallback((newPreferences: UserPreferences) => {
    try {
      console.log('💾 Saving preferences to localStorage:', newPreferences);
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
      markPendingChanges(); // Mark for sync
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [markPendingChanges]);

  // Effect to save when preferences change
  useEffect(() => {
    saveToLocalStorage(preferences);
  }, [preferences, saveToLocalStorage]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    console.log('🔄 Updating preferences with:', updates);
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      console.log('🔄 New preferences state:', newPrefs);
      return newPrefs;
    });
  }, []);

  const updateDetailPreferences = useCallback((updates: Partial<ExerciseDetailPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      exerciseDetailPreferences: {
        ...defaultDetailPreferences,
        ...prev.exerciseDetailPreferences,
        ...updates
      }
    }));
  }, []);

  const updateTeachingModePreferences = useCallback((updates: Partial<TeachingModePreferences>) => {
    setPreferences(prev => ({
      ...prev,
      teachingModePreferences: {
        ...defaultTeachingModePreferences,
        ...prev.teachingModePreferences,
        ...updates
      }
    }));
  }, []);

  const addCustomCallout = useCallback((name: string, color: string) => {
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
  }, [preferences.customCallouts, updatePreferences]);

  const updateCustomCallout = useCallback((id: string, updates: Partial<Pick<CustomCallout, 'name' | 'color'>>) => {
    const updatedCallouts = (preferences.customCallouts || []).map(callout =>
      callout.id === id ? { ...callout, ...updates, updatedAt: new Date() } : callout
    );
    updatePreferences({ customCallouts: updatedCallouts });
  }, [preferences.customCallouts, updatePreferences]);

  const deleteCustomCallout = useCallback((id: string) => {
    setPreferences(prev => ({
      ...prev,
      customCallouts: (prev.customCallouts || []).filter(callout => callout.id !== id)
    }));
  }, []);

  const toggleFavoriteExercise = useCallback((exerciseId: string) => {
    console.log('⭐ Toggling favorite for:', exerciseId);
    console.log('⭐ Current favorites:', preferences.favoriteExercises);
    
    setPreferences(prev => {
      const favorites = prev.favoriteExercises || [];
      const isAlreadyFavorite = favorites.includes(exerciseId);
      
      const newFavorites = isAlreadyFavorite
        ? favorites.filter(id => id !== exerciseId)
        : [...favorites, exerciseId];
      
      console.log('⭐ New favorites:', newFavorites);
      console.log('⭐ Action:', isAlreadyFavorite ? 'REMOVED' : 'ADDED');
      
      const newPrefs = {
        ...prev,
        favoriteExercises: newFavorites
      };
      
      // Immediately save to localStorage
      setTimeout(() => {
        try {
          localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPrefs));
          console.log('⭐ Favorites saved to localStorage immediately');
        } catch (error) {
          console.error('Failed to save favorites immediately:', error);
        }
      }, 0);
      
      return newPrefs;
    });
  }, [preferences.favoriteExercises]);

  const toggleHiddenExercise = useCallback((exerciseId: string) => {
    console.log('👁️ Toggling hidden for:', exerciseId);
    console.log('👁️ Current hidden:', preferences.hiddenExercises);
    
    setPreferences(prev => {
      const hidden = prev.hiddenExercises || [];
      const isAlreadyHidden = hidden.includes(exerciseId);
      
      const newHidden = isAlreadyHidden
        ? hidden.filter(id => id !== exerciseId)
        : [...hidden, exerciseId];
      
      console.log('👁️ New hidden:', newHidden);
      console.log('👁️ Action:', isAlreadyHidden ? 'UNHIDDEN' : 'HIDDEN');
      
      const newPrefs = {
        ...prev,
        hiddenExercises: newHidden
      };
      
      // Immediately save to localStorage
      setTimeout(() => {
        try {
          localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPrefs));
          console.log('👁️ Hidden exercises saved to localStorage immediately');
        } catch (error) {
          console.error('Failed to save hidden exercises immediately:', error);
        }
      }, 0);
      
      return newPrefs;
    });
  }, [preferences.hiddenExercises]);

  const togglePregnancySafeOnly = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      showPregnancySafeOnly: !prev.showPregnancySafeOnly
    }));
  }, []);

  // Debug: Log current preferences
  console.log('🎯 Current preferences state:', {
    favoritesCount: preferences.favoriteExercises?.length || 0,
    hiddenCount: preferences.hiddenExercises?.length || 0,
    favorites: preferences.favoriteExercises,
    darkMode: preferences.darkMode
  });

  return {
    preferences,
    updatePreferences,
    updateDetailPreferences,
    updateTeachingModePreferences,
    addCustomCallout,
    updateCustomCallout,
    deleteCustomCallout,
    toggleFavoriteExercise,
    toggleHiddenExercise,
    togglePregnancySafeOnly
  };
};
