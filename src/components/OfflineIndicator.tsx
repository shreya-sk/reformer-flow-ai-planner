
import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { WifiOff, Wifi } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-40 max-w-sm mx-auto">
      <Card className="bg-orange-50 border-orange-200 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900">You're offline</p>
              <p className="text-xs text-orange-700">Some features may be limited</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
