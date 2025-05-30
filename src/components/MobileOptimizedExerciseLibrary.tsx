
import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, RefreshCw, Download, Wifi, WifiOff } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLazyLoading, useVirtualScrolling } from '@/hooks/usePerformanceOptimization';
import { usePWA } from '@/hooks/usePWA';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';

interface MobileOptimizedExerciseLibraryProps {
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
  onRefresh?: () => void;
}

export const MobileOptimizedExerciseLibrary = ({
  exercises,
  onExerciseSelect,
  onRefresh
}: MobileOptimizedExerciseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { preferences } = useUserPreferences();
  const { observeImage } = useLazyLoading();
  const { isOnline, isInstallable, installApp } = usePWA();

  // Filter exercises based on search
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroups.some(group => 
        group.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [exercises, searchTerm]);

  // Virtual scrolling for performance
  const { containerRef, visibleItems, totalHeight, offsetY, handleScroll, visibleStart } = 
    useVirtualScrolling(filteredExercises, 120, 600);

  // Touch gestures
  const { isPulling, pullDistance } = useTouchGestures({
    onPullToRefresh: async () => {
      if (onRefresh) {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      }
    },
    pullToRefreshThreshold: 80
  });

  const handleInstallClick = async () => {
    const success = await installApp();
    if (success) {
      console.log('App installed successfully!');
    }
  };

  const handleCardClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className={`h-full flex flex-col ${preferences.darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Pull to refresh indicator */}
        {isPulling && (
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
        )}

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
              onClick={handleInstallClick}
              size="sm" 
              variant="outline" 
              className="h-6 text-xs py-1 px-2"
            >
              <Download className="h-3 w-3 mr-1" />
              Install App
            </Button>
          )}
        </div>

        {/* Search header */}
        <div className="p-4 border-b bg-white sticky top-0 z-20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-600">
              {filteredExercises.length} exercises
            </span>
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Virtual scrolled exercise list */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto"
          onScroll={handleScroll}
          style={{ height: '100%' }}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleItems.map((exercise, index) => {
                const actualIndex = visibleStart + index;
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onSelect={handleCardClick}
                    onAddToClass={onExerciseSelect}
                    observeImage={observeImage}
                    darkMode={preferences.darkMode}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExercise(null);
          }}
          onAddToClass={onExerciseSelect}
        />
      )}
    </>
  );
};

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onAddToClass: (exercise: Exercise) => void;
  observeImage: (element: HTMLImageElement, src: string) => void;
  darkMode: boolean;
}

const ExerciseCard = ({ exercise, onSelect, onAddToClass, observeImage, darkMode }: ExerciseCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current && exercise.image) {
      observeImage(imageRef.current, exercise.image);
    }
  }, [exercise.image, observeImage]);

  return (
    <Card 
      className={`m-3 cursor-pointer transition-all duration-200 active:scale-95 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
      }`}
      onClick={() => onSelect(exercise)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Exercise image with lazy loading */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {exercise.image ? (
              <img
                ref={imageRef}
                alt={exercise.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-sage-100 flex items-center justify-center">
                <span className="text-sage-400 text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Exercise details */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {exercise.name}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                {exercise.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.duration}min
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {exercise.muscleGroups.slice(0, 2).map(group => (
                <Badge key={group} variant="outline" className="text-xs">
                  {group}
                </Badge>
              ))}
              {exercise.muscleGroups.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{exercise.muscleGroups.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
