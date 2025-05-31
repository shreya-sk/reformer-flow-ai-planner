
import { useState, useEffect, useCallback } from 'react';
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

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  hasPendingChanges: boolean;
  lastSyncTime?: Date;
}

interface UserSyncData {
  id: string;
  user_id: string;
  class_plans: any;
  preferences: UserPreferences;
  custom_exercises: any;
  sync_version: number;
  created_at: string;
  updated_at: string;
}

export const useDataSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    hasPendingChanges: false,
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const markPendingChanges = useCallback(() => {
    setSyncStatus(prev => ({ ...prev, hasPendingChanges: true }));
  }, []);

  const forceSyncNow = useCallback(async () => {
    if (!syncStatus.isOnline) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSyncStatus(prev => ({ 
        ...prev, 
        isSyncing: false, 
        hasPendingChanges: false,
        lastSyncTime: new Date()
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [syncStatus.isOnline]);

  return {
    syncStatus,
    markPendingChanges,
    forceSyncNow
  };
};
