
import { useState, useMemo } from 'react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLazyLoading } from '@/hooks/usePerformanceOptimization';
import { usePWA } from '@/hooks/usePWA';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { MobileFilterPanel } from './MobileFilterPanel';
import { MobileExerciseModal } from './MobileExerciseModal';
import { MobileLibraryHeader } from './mobile/MobileLibraryHeader';
import { MobilePullToRefresh } from './mobile/MobilePullToRefresh';
import { MobileExerciseGrid } from './mobile/MobileExerciseGrid';
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
  
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { duplicateExercise, updateUserExercise, customizeSystemExercise, deleteUserExercise, resetSystemExerciseToOriginal } = useExercises();
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

  const handleToggleHidden = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHiddenExercise(exerciseId);
  };

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleDuplicateExercise = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await duplicateExercise(exercise);
      toast({
        title: "Exercise duplicated",
        description: `"${exercise.name} (Copy)" has been created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate exercise.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExercise = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exercise.isCustom) return;
    
    try {
      await deleteUserExercise(exercise.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exercise.",
        variant: "destructive",
      });
    }
  };

  const handleResetToOriginal = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exercise.isSystemExercise || !exercise.isCustomized) return;
    
    try {
      await resetSystemExerciseToOriginal(exercise.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset exercise.",
        variant: "destructive",
      });
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedMuscleGroup('all');
    setShowHidden(false);
  };

  const handleEditExerciseUpdate = async (updatedExercise: Exercise) => {
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
        <MobilePullToRefresh 
          isPulling={isPulling}
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
        />

        {/* Header */}
        <MobileLibraryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isOnline={isOnline}
          isInstallable={isInstallable}
          onInstallClick={handleInstallClick}
          onFilterClick={() => setShowFilterPanel(true)}
          activeFiltersCount={activeFiltersCount}
          exerciseCount={filteredExercises.length}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Exercise grid */}
        <MobileExerciseGrid
          exercises={filteredExercises}
          showHidden={showHidden}
          onExerciseSelect={handleCardClick}
          onAddToClass={handleAddToClass}
          onToggleFavorite={handleToggleFavorite}
          onToggleHidden={handleToggleHidden}
          onEdit={handleEditExercise}
          onDuplicate={handleDuplicateExercise}
          onDelete={handleDeleteExercise}
          onResetToOriginal={handleResetToOriginal}
          observeImage={observeImage}
          favoriteExercises={preferences.favoriteExercises || []}
          hiddenExercises={preferences.hiddenExercises || []}
          darkMode={preferences.darkMode}
        />
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
        onEdit={handleEditExerciseUpdate}
      />
    </>
  );
};
