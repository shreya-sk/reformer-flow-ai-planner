
import { useState, useEffect } from 'react';
import { Workbox } from 'workbox-window';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [workbox, setWorkbox] = useState<Workbox | null>(null);

  useEffect(() => {
    // Check if already installed
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);

    // Initialize Workbox
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      
      wb.addEventListener('waiting', () => {
        setUpdateAvailable(true);
      });

      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      wb.register().catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

      setWorkbox(wb);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for visibility change to sync data
    const handleVisibilityChange = () => {
      if (!document.hidden && navigator.onLine) {
        // Trigger background sync when app becomes visible and online
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SYNC_DATA'
          });
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Install failed:', error);
      return false;
    }
  };

  const updateApp = () => {
    if (workbox) {
      workbox.messageSkipWaiting();
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    installApp,
    updateApp,
  };
};
