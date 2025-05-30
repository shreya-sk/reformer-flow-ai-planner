
import { RefreshCw } from 'lucide-react';

interface MobilePullToRefreshProps {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export const MobilePullToRefresh = ({ isPulling, pullDistance, isRefreshing }: MobilePullToRefreshProps) => {
  if (!isPulling) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-sage-600 text-white transition-all duration-300"
      style={{ 
        height: `${Math.min(pullDistance, 60)}px`,
        opacity: pullDistance / 60 
      }}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span className="text-sm">
        {pullDistance >= 60 ? 'Release to refresh' : 'Pull to refresh'}
      </span>
    </div>
  );
};
