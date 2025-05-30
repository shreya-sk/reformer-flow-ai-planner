
import { Wifi, WifiOff, Cloud, CloudOff, RotateCw } from 'lucide-react';
import { useDataSync } from '@/hooks/useDataSync';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SyncStatusIndicator = () => {
  const { syncStatus, forceSyncNow } = useDataSync();

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
    
    if (syncStatus.isSyncing) {
      return <RotateCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    
    if (syncStatus.hasPendingChanges) {
      return <CloudOff className="h-4 w-4 text-orange-500" />;
    }
    
    return <Cloud className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline';
    if (syncStatus.isSyncing) return 'Syncing...';
    if (syncStatus.hasPendingChanges) return 'Pending sync';
    return 'Synced';
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'bg-red-100 text-red-800';
    if (syncStatus.isSyncing) return 'bg-blue-100 text-blue-800';
    if (syncStatus.hasPendingChanges) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor()} flex items-center gap-1`}>
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </Badge>
            {syncStatus.isOnline && syncStatus.hasPendingChanges && (
              <Button
                size="sm"
                variant="ghost"
                onClick={forceSyncNow}
                className="h-6 px-2"
              >
                <Cloud className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>Connection: {syncStatus.isOnline ? 'Online' : 'Offline'}</p>
            {syncStatus.lastSyncTime && (
              <p>Last sync: {syncStatus.lastSyncTime.toLocaleTimeString()}</p>
            )}
            {syncStatus.hasPendingChanges && (
              <p>You have unsaved changes</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
