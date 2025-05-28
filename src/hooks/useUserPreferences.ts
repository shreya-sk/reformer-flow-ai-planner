
import { useState, useEffect } from 'react';

interface UserPreferences {
  darkMode: boolean;
  showPregnancySafeOnly?: boolean;
  profileImage?: string;
  customCallouts?: string[];
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
      customCallouts: []
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

  return {
    preferences,
    updatePreferences,
    addCustomCallout,
    removeCustomCallout
  };
};
