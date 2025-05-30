
import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Download, Wifi, WifiOff, Plus, Heart, Filter } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLazyLoading } from '@/hooks/usePerformanceOptimization';
import { usePWA } from '@/hooks/usePWA';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ExerciseDetailModal } from '@/components/ExerciseDetailModal';

interface MobileOptimizedExerciseLibraryProps {
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
  onRefresh?: () => void;
}

const categoryOptions = [
  { value: 'all', label: 'All', color: 'bg-sage-600' },
  { value: 'supine', label: 'Supine', color: 'bg-blue-500' },
  { value: 'prone', label: 'Prone', color: 'bg-purple-500' },
  { value: 'sitting', label: 'Sitting', color: 'bg-green-500' },
  { value: 'side-lying', label: 'Side-lying', color: 'bg-pink-500' },
  { value: 'kneeling', label: 'Kneeling', color: 'bg-yellow-500' },
];

const difficultyOptions = [
  { value: 'all', label: 'All Levels', color: 'bg-gray-500' },
  { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-500' },
];

export const MobileOptimizedExerciseLibrary = ({
  exercises,
  onExerciseSelect,
  onRefresh
}: MobileOptimizedExerciseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const { observeImage } = useLazyLoading();
  const { isOnline, isInstallable, installApp } = usePWA();

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some(group => 
          group.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      const matchesPregnancy = !preferences.showPregnancySafeOnly || exercise.isPregnancySafe;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPregnancy;
    });
  }, [exercises, searchTerm, selectedCategory, selectedDifficulty, preferences.showPregnancySafeOnly]);

  // Touch gestures for pull to refresh
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

  const handleAddToClass = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    onExerciseSelect(exercise);
  };

  const handleToggleFavorite = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteExercise(exerciseId);
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
        <div className="p-4 border-b bg-white sticky top-0 z-20 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-sage-400"
            />
          </div>
          
          {/* Filter chips */}
          <div className="space-y-3">
            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedCategory(option.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === option.value
                      ? `${option.color} text-white shadow-md transform scale-105`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Difficulty filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDifficulty(option.value)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDifficulty === option.value
                      ? `${option.color} text-white shadow-md transform scale-105`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredExercises.length} exercises
            </span>
            <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Two-column exercise grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-3">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={handleCardClick}
                onAddToClass={handleAddToClass}
                onToggleFavorite={handleToggleFavorite}
                observeImage={observeImage}
                isFavorite={preferences.favoriteExercises?.includes(exercise.id) || false}
                darkMode={preferences.darkMode}
              />
            ))}
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
  onAddToClass: (exercise: Exercise, e: React.MouseEvent) => void;
  onToggleFavorite: (exerciseId: string, e: React.MouseEvent) => void;
  observeImage: (element: HTMLImageElement, src: string) => void;
  isFavorite: boolean;
  darkMode: boolean;
}

const ExerciseCard = ({ 
  exercise, 
  onSelect, 
  onAddToClass, 
  onToggleFavorite, 
  observeImage, 
  isFavorite, 
  darkMode 
}: ExerciseCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current && exercise.image) {
      observeImage(imageRef.current, exercise.image);
    }
  }, [exercise.image, observeImage]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-lg"
      onClick={() => onSelect(exercise)}
    >
      {/* Image container with overlay elements */}
      <div className="relative aspect-square overflow-hidden">
        {/* Exercise image */}
        {exercise.image ? (
          <img
            ref={imageRef}
            alt={exercise.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
            <img 
              src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
              alt="Default exercise"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        
        {/* Favorite heart - top right */}
        <button
          onClick={(e) => onToggleFavorite(exercise.id, e)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite 
              ? 'bg-white/90 text-red-500 scale-110' 
              : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Difficulty badge - top left */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(exercise.difficulty)}`}>
          {exercise.difficulty}
        </div>

        {/* Pregnancy safe indicator */}
        {exercise.isPregnancySafe && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
            👶
          </div>
        )}

        {/* Custom exercise indicator */}
        {exercise.isCustom && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Custom
          </div>
        )}
      </div>
      
      {/* Exercise info overlay at bottom */}
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {exercise.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {exercise.duration}min • {exercise.category}
            </p>
          </div>
          
          {/* Add button */}
          <button
            onClick={(e) => onAddToClass(exercise, e)}
            className="ml-2 w-8 h-8 bg-sage-600 hover:bg-sage-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
