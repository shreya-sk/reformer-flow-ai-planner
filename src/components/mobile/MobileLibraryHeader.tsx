
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Download, Wifi, WifiOff, Filter } from 'lucide-react';

interface MobileLibraryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isOnline: boolean;
  isInstallable: boolean;
  onInstallClick: () => void;
  onFilterClick: () => void;
  activeFiltersCount: number;
  exerciseCount: number;
  onRefresh?: () => void;
  isRefreshing: boolean;
}

export const MobileLibraryHeader = ({
  searchTerm,
  onSearchChange,
  isOnline,
  isInstallable,
  onInstallClick,
  onFilterClick,
  activeFiltersCount,
  exerciseCount,
  onRefresh,
  isRefreshing
}: MobileLibraryHeaderProps) => {
  return (
    <>
      {/* Status bar */}
      <div className="flex items-center justify-between p-3 border-b bg-sage-50 text-xs">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <><Wifi className="h-3 w-3 text-green-600" /><span>Online</span></>
          ) : (
            <><WifiOff className="h-3 w-3 text-red-600" /><span>Offline</span></>
          )}
        </div>
        
        {isInstallable && (
          <Button 
            onClick={onInstallClick}
            size="sm" 
            variant="outline" 
            className="h-6 text-xs py-1 px-2"
          >
            <Download className="h-3 w-3 mr-1" />
            Install App
          </Button>
        )}
      </div>

      {/* Search and filter header */}
      <div className="p-4 border-b bg-white sticky top-0 z-20 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-sage-400"
          />
        </div>
        
        {/* Filter button and results */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onFilterClick}
            className="h-10 px-4 rounded-xl border-gray-200 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-sage-600 text-white text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {exerciseCount} exercises
            </span>
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
