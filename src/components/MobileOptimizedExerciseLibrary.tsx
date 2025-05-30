
import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Download, Wifi, WifiOff, Plus, Heart, Filter, Check } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLazyLoading } from '@/hooks/usePerformanceOptimization';
import { usePWA } from '@/hooks/usePWA';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { MobileFilterPanel } from './MobileFilterPanel';
import { MobileExerciseModal } from './MobileExerciseModal';
import { toast } from '@/hooks/use-toast';

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
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const { duplicateExercise, updateUserExercise, customizeSystemExercise } = useExercises();
  const { observeImage } = useLazyLoading();
  const { isOnline, isInstallable, installApp } = usePWA();

  // Filter exercises based on search and filters
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
      if (!showHidden && isHidden) return false;
      if (showHidden && !isHidden) return false;

      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some(group => 
          group.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroups.includes(selectedMuscleGroup);
      const matchesPregnancy = !preferences.showPregnancySafeOnly || exercise.isPregnancySafe;
      
      return matchesSearch && matchesCategory && matchesMuscleGroup && matchesPregnancy;
    });
  }, [exercises, searchTerm, selectedCategory, selectedMuscleGroup, preferences.showPregnancySafeOnly, preferences.hiddenExercises, showHidden]);

  // Count active filters
  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + 
                            (selectedMuscleGroup !== 'all' ? 1 : 0) + 
                            (preferences.showPregnancySafeOnly ? 1 : 0) + 
                            (showHidden ? 1 : 0);

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

  const handleAddToClass = (exercise: Exercise) => {
    // Create a unique copy for the class plan
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const uniqueId = `${exercise.id}-${timestamp}-${randomId}`;
    
    const exerciseToAdd = {
      ...exercise,
      id: uniqueId,
    };
    
    onExerciseSelect(exerciseToAdd);
    
    toast({
      title: "Added to class",
      description: `"${exercise.name}" has been added to your class plan.`,
    });
  };

  const handleToggleFavorite = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteExercise(exerciseId);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedMuscleGroup('all');
    setShowHidden(false);
  };

  const handleEditExercise = async (updatedExercise: Exercise) => {
    try {
      if (updatedExercise.isSystemExercise) {
        await customizeSystemExercise(updatedExercise.id, {
          custom_name: updatedExercise.name,
          custom_duration: updatedExercise.duration,
          custom_springs: updatedExercise.springs,
          custom_cues: updatedExercise.cues,
          custom_notes: updatedExercise.notes,
          custom_difficulty: updatedExercise.difficulty,
          custom_setup: updatedExercise.setup,
          custom_reps_or_duration: updatedExercise.repsOrDuration,
          custom_tempo: updatedExercise.tempo,
          custom_target_areas: updatedExercise.targetAreas,
          custom_breathing_cues: updatedExercise.breathingCues,
          custom_teaching_focus: updatedExercise.teachingFocus,
          custom_modifications: updatedExercise.modifications,
        });
      } else {
        await updateUserExercise(updatedExercise.id, updatedExercise);
      }
      setSelectedExercise(updatedExercise);
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
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

        {/* Search and filter header */}
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
          
          {/* Filter button and results */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilterPanel(true)}
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
                {filteredExercises.length} exercises
              </span>
              <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Exercise grid */}
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

          {filteredExercises.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showHidden ? 'No hidden exercises' : 'No exercises found'}
              </h3>
              <p className="text-gray-500 text-sm">
                {showHidden 
                  ? 'You haven\'t hidden any exercises yet.'
                  : 'Try adjusting your search or filters'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <MobileFilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMuscleGroup={selectedMuscleGroup}
        onMuscleGroupChange={setSelectedMuscleGroup}
        showPregnancySafe={preferences.showPregnancySafeOnly || false}
        onPregnancySafeChange={(show) => {
          // This would need to be implemented in useUserPreferences
          console.log('Toggle pregnancy safe:', show);
        }}
        showHidden={showHidden}
        onShowHiddenChange={setShowHidden}
        onClearAll={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Exercise Detail Modal */}
      <MobileExerciseModal
        exercise={selectedExercise}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedExercise(null);
        }}
        onAddToClass={handleAddToClass}
        onEdit={handleEditExercise}
      />
    </>
  );
};

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onAddToClass: (exercise: Exercise) => void;
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
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (imageRef.current && exercise.image) {
      observeImage(imageRef.current, exercise.image);
    }
  }, [exercise.image, observeImage]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    
    setIsAdding(true);
    onAddToClass(exercise);
    
    // Reset button after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
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

        {/* Pregnancy safe indicator */}
        {exercise.isPregnancySafe && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-[10px]">👶</span>
            <span>Safe</span>
          </div>
        )}

        {/* Custom exercise indicator */}
        {exercise.isCustom && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Custom
          </div>
        )}

        {/* Modified exercise indicator */}
        {exercise.isCustomized && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Modified
          </div>
        )}
      </div>
      
      {/* Exercise info */}
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
          
          {/* Add button with enhanced animation */}
          <button
            onClick={handleAddClick}
            disabled={isAdding}
            className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 ${
              isAdding
                ? 'bg-green-500 text-white scale-110'
                : 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-110'
            }`}
          >
            {isAdding ? (
              <Check className="h-4 w-4 animate-bounce" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
