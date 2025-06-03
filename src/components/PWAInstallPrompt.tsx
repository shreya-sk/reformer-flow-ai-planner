
import React, { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installApp, updateAvailable, updateApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show install prompt after 5 seconds if app is installable and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !dismissed) {
        const lastDismissed = localStorage.getItem('pwa-install-dismissed');
        const now = Date.now();
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        
        if (!lastDismissed || parseInt(lastDismissed) < oneWeekAgo) {
          setShowPrompt(true);
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, dismissed]);

  const handleInstall = async () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
    const success = await installApp();
    if (success) {
      toast({
        title: "App Installed!",
        description: "Reformer Flow has been added to your device.",
      });
      setShowPrompt(false);
    } else {
      toast({
        title: "Installation Failed",
        description: "Please try again or add to home screen manually.",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleUpdate = () => {
    updateApp();
    toast({
      title: "Updating App",
      description: "The app will refresh with the latest version.",
    });
  };

  // Show update notification
  if (updateAvailable) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <Card className="bg-blue-50 border-blue-200 shadow-lg animate-slide-in-down">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Update Available</p>
                <p className="text-xs text-blue-700">New features and improvements</p>
              </div>
              <Button 
                size="sm" 
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show install prompt
  if (showPrompt && isInstallable && !isInstalled) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <Card className="bg-sage-50 border-sage-200 shadow-lg animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sage-100 rounded-lg">
                <Smartphone className="h-4 w-4 text-sage-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-sage-900 mb-1">
                  Install Reformer Flow
                </h3>
                <p className="text-xs text-sage-700 mb-3">
                  Get quick access and work offline by installing our app
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleInstall}
                    className="bg-sage-600 hover:bg-sage-700 text-white text-xs px-3 py-1.5 hover:scale-105 transition-transform"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Install
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleDismiss}
                    className="text-sage-600 hover:bg-sage-100 text-xs px-2 py-1.5"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
