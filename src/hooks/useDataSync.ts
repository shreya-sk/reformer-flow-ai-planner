import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ClassPlan, Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

interface LocalData {
  classPlan?: ClassPlan;
  preferences?: any;
  lastSync?: string;
}

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: Date;
  hasPendingChanges: boolean;
}

export const useDataSync = () => {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    hasPendingChanges: false,
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      if (user) {
        syncToCloud();
      }
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Sync localStorage data to Supabase
  const syncToCloud = useCallback(async () => {
    if (!user || !syncStatus.isOnline) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Get all localStorage data
      const classPlan = localStorage.getItem('reformerly_class_plan');
      const preferences = localStorage.getItem('user-preferences');

      const syncData = {
        user_id: user.id,
        class_plan: classPlan ? JSON.parse(classPlan) : null,
        preferences: preferences ? JSON.parse(preferences) : null,
        synced_at: new Date().toISOString(),
      };

      // Upsert sync data to Supabase
      const { error } = await supabase
        .from('user_sync_data')
        .upsert(syncData, { onConflict: 'user_id' });

      if (error) throw error;

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        hasPendingChanges: false,
      }));

      console.log('Data synced to cloud successfully');
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      
      toast({
        title: "Sync failed",
        description: "Failed to sync data to cloud. Changes saved locally.",
        variant: "destructive",
      });
    }
  }, [user, syncStatus.isOnline]);

  // Load data from Supabase and merge with localStorage
  const syncFromCloud = useCallback(async () => {
    if (!user || !syncStatus.isOnline) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const { data, error } = await supabase
        .from('user_sync_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Get current localStorage data
        const localClassPlan = localStorage.getItem('reformerly_class_plan');
        const localPreferences = localStorage.getItem('user-preferences');

        // Parse cloud data
        const cloudClassPlan = data.class_plan;
        const cloudPreferences = data.preferences;

        // Merge strategy: Use cloud data if it's newer, otherwise keep local
        const cloudSyncTime = new Date(data.synced_at);
        const localSyncTime = localStorage.getItem('last_sync_time') 
          ? new Date(localStorage.getItem('last_sync_time')!)
          : new Date(0);

        if (cloudSyncTime > localSyncTime) {
          // Cloud data is newer, update localStorage
          if (cloudClassPlan) {
            localStorage.setItem('reformerly_class_plan', JSON.stringify(cloudClassPlan));
          }
          if (cloudPreferences) {
            localStorage.setItem('user-preferences', JSON.stringify(cloudPreferences));
          }
          localStorage.setItem('last_sync_time', cloudSyncTime.toISOString());

          toast({
            title: "Data restored",
            description: "Your data has been restored from the cloud.",
          });
        } else if (localClassPlan || localPreferences) {
          // Local data is newer or equal, sync to cloud
          await syncToCloud();
        }
      } else {
        // No cloud data exists, sync local data to cloud
        await syncToCloud();
      }

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
      }));
    } catch (error) {
      console.error('Error syncing from cloud:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [user, syncStatus.isOnline, syncToCloud]);

  // Auto-sync when user logs in
  useEffect(() => {
    if (user && syncStatus.isOnline) {
      syncFromCloud();
    }
  }, [user, syncFromCloud, syncStatus.isOnline]);

  // Periodic sync for authenticated users
  useEffect(() => {
    if (!user || !syncStatus.isOnline) return;

    const interval = setInterval(() => {
      if (syncStatus.hasPendingChanges) {
        syncToCloud();
      }
    }, 30000); // Sync every 30 seconds if there are pending changes

    return () => clearInterval(interval);
  }, [user, syncStatus.isOnline, syncStatus.hasPendingChanges, syncToCloud]);

  // Mark data as having pending changes
  const markPendingChanges = useCallback(() => {
    setSyncStatus(prev => ({ ...prev, hasPendingChanges: true }));
  }, []);

  // Force sync now
  const forceSyncNow = useCallback(async () => {
    if (user && syncStatus.isOnline) {
      await syncToCloud();
    }
  }, [user, syncStatus.isOnline, syncToCloud]);

  return {
    syncStatus,
    syncToCloud,
    syncFromCloud,
    markPendingChanges,
    forceSyncNow,
  };
};
