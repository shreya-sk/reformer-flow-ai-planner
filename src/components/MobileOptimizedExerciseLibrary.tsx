import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useLazyLoading } from '@/hooks/usePerformanceOptimization';
import { Exercise, ExerciseCategory, MuscleGroup } from '@/types/reformer';
import { MobileExerciseGrid } from './mobile/MobileExerciseGrid';
import { MobileLibraryHeader } from './mobile/MobileLibraryHeader';
import { MobileExerciseModal } from './MobileExerciseModal';
import { MobileFilterPanel } from './MobileFilterPanel';
import { InteractiveExerciseForm } from './InteractiveExerciseForm';
import { toast } from '@/hooks/use-toast';

interface MobileOptimizedExerciseLibraryProps {
  onExerciseSelect?: (exercise: Exercise) => void;
}

export const MobileOptimizedExerciseLibrary = ({ onExerciseSelect }: MobileOptimizedExerciseLibraryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { exercises, loading, duplicateExercise, deleteUserExercise, resetSystemExerciseToOriginal, createUserExercise } = useExercises();
  const { addExercise } = usePersistedClassPlan();
  const isMobile = useIsMobile();
  const { observeImage } = useLazyLoading();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPregnancySafe, setShowPregnancySafe] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [feedbackState, setFeedbackState] = useState<{[key: string]: 'success' | 'error' | null}>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');

  // Touch gestures for mobile navigation
  const { isPulling, pullDistance } = useTouchGestures({
    onPullToRefresh: async () => {
      setIsRefreshing(true);
      try {
        // Trigger refresh of exercises data
        window.location.reload();
      } finally {
        setIsRefreshing(false);
      }
    },
    onSwipeLeft: () => {
      if (!showFilters && !selectedExercise) {
        navigate('/plan');
      }
    },
    onSwipeRight: () => {
      if (!showFilters && !selectedExercise) {
        navigate('/');
      }
    },
  });

  // Show feedback for actions
  const showFeedback = useCallback((exerciseId: string, type: 'success' | 'error') => {
    setFeedbackState(prev => ({ ...prev, [exerciseId]: type }));
    setTimeout(() => {
      setFeedbackState(prev => ({ ...prev, [exerciseId]: null }));
    }, 2000);
  }, []);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    return exercises.filter(exercise => {
      const matchesSearch = !searchTerm || 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const isHidden = preferences.hiddenExercises?.includes(exercise.id);
      const matchesHiddenFilter = showHidden || !isHidden;
      
      const matchesPregnancy = !showPregnancySafe || exercise.isPregnancySafe;
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesMuscleGroup = selectedMuscleGroup === 'all' ||
        exercise.muscleGroups.includes(selectedMuscleGroup);

      return matchesSearch && matchesHiddenFilter && matchesPregnancy && matchesCategory && matchesMuscleGroup;
    });
  }, [exercises, searchTerm, preferences.hiddenExercises, showHidden, showPregnancySafe, selectedCategory, selectedMuscleGroup]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (showPregnancySafe) count++;
    if (showHidden) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedMuscleGroup !== 'all') count++;
    return count;
  }, [showPregnancySafe, showHidden, selectedCategory, selectedMuscleGroup]);

  const handleAddToClass = useCallback((exercise: Exercise) => {
    console.log('🔵 Adding exercise to class:', exercise.name);
    
    // Haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      if (onExerciseSelect) {
        onExerciseSelect(exercise);
        toast({
          title: "Added to class",
          description: `"${exercise.name}" has been added to your class plan.`,
        });
      } else {
        addExercise(exercise);
        console.log('🔵 Exercise added successfully, navigating to plan');
        toast({
          title: "Added to class",
          description: `"${exercise.name}" has been added to your class plan.`,
        });
        navigate('/plan');
      }
      showFeedback(exercise.id, 'success');
    } catch (error) {
      console.error('🔴 Error adding exercise:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to class.",
        variant: "destructive",
      });
      showFeedback(exercise.id, 'error');
    }
  }, [onExerciseSelect, addExercise, navigate, showFeedback, toast]);

  const handleExerciseSelect = useCallback((exercise: Exercise) => {
    setSelectedExercise(exercise);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedExercise(null);
    setEditingExercise(null);
  }, []);

  const handleEditExercise = useCallback((exercise: Exercise) => {
    setEditingExercise(exercise);
    setSelectedExercise(null);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedMuscleGroup('all');
    setShowPregnancySafe(false);
    setShowHidden(false);
    setShowFilters(false);
  }, []);

  const handleCreateExercise = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleSaveExercise = useCallback(async (exercise: Exercise) => {
    try {
      await createUserExercise(exercise);
      showFeedback(exercise.id, 'success');
      toast({
        title: "Exercise saved",
        description: `"${exercise.name}" has been saved to your library.`,
      });
    } catch (error) {
      showFeedback(exercise.id, 'error');
      toast({
        title: "Error",
        description: "Failed to save exercise.",
        variant: "destructive",
      });
    }
    setIsCreating(false);
    setEditingExercise(null);
  }, [createUserExercise, showFeedback, toast]);

  const handleCancelExercise = useCallback(() => {
    setIsCreating(false);
    setEditingExercise(null);
  }, []);

  const handleToggleFavorite = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    toggleFavoriteExercise(exerciseId);
    showFeedback(exerciseId, 'success');
  }, [toggleFavoriteExercise, showFeedback]);

  const handleToggleHidden = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHiddenExercise(exerciseId);
    showFeedback(exerciseId, 'success');
  }, [toggleHiddenExercise, showFeedback]);

  const handleEdit = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditExercise(exercise);
  }, [handleEditExercise]);

  const handleDuplicate = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await duplicateExercise(exercise);
      showFeedback(exercise.id, 'success');
      toast({
        title: "Exercise duplicated",
        description: `"${exercise.name}" has been duplicated.`,
      });
    } catch (error) {
      showFeedback(exercise.id, 'error');
      toast({
        title: "Error",
        description: "Failed to duplicate exercise.",
        variant: "destructive",
      });
    }
  }, [duplicateExercise, showFeedback, toast]);

  const handleDelete = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exercise.isCustom) return;
    
    try {
      await deleteUserExercise(exercise.id);
      showFeedback(exercise.id, 'success');
      toast({
        title: "Exercise deleted",
        description: `"${exercise.name}" has been deleted.`,
      });
    } catch (error) {
      showFeedback(exercise.id, 'error');
      toast({
        title: "Error",
        description: "Failed to delete exercise.",
        variant: "destructive",
      });
    }
  }, [deleteUserExercise, showFeedback, toast]);

  const handleResetToOriginal = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exercise.isSystemExercise || !exercise.isCustomized) return;
    
    try {
      await resetSystemExerciseToOriginal(exercise.id);
      showFeedback(exercise.id, 'success');
      toast({
        title: "Exercise reset",
        description: `"${exercise.name}" has been reset to original.`,
      });
    } catch (error) {
      showFeedback(exercise.id, 'error');
      toast({
        title: "Error",
        description: "Failed to reset exercise.",
        variant: "destructive",
      });
    }
  }, [resetSystemExerciseToOriginal, showFeedback, toast]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sage-600">Please sign in to access the exercise library.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sage-600">Loading exercises...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 relative overflow-hidden">
      {/* Pull to Refresh Indicator */}
      {isPulling && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-sage-100 transition-all duration-200"
          style={{ 
            height: `${Math.min(pullDistance, 80)}px`,
            opacity: Math.min(pullDistance / 60, 1)
          }}
        >
          <div className="text-sage-600 text-sm font-medium">
            {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}

      {/* Header */}
      <MobileLibraryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterClick={handleToggleFilters}
        activeFiltersCount={activeFiltersCount}
        exerciseCount={filteredExercises.length}
        showPregnancySafe={showPregnancySafe}
        onPregnancySafeToggle={() => setShowPregnancySafe(prev => !prev)}
        onAddExercise={handleCreateExercise}
        showFilters={showFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Filter Panel */}
      {showFilters && (
        <MobileFilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedMuscleGroup={selectedMuscleGroup}
          onMuscleGroupChange={setSelectedMuscleGroup}
          showPregnancySafe={showPregnancySafe}
          onPregnancySafeChange={setShowPregnancySafe}
          showHidden={showHidden}
          onShowHiddenChange={setShowHidden}
          onClearAll={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Exercise Grid */}
      <div className="pb-20">
        <MobileExerciseGrid
          exercises={filteredExercises}
          showHidden={showHidden}
          onExerciseSelect={handleExerciseSelect}
          onAddToClass={handleAddToClass}
          onToggleFavorite={handleToggleFavorite}
          onToggleHidden={handleToggleHidden}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onResetToOriginal={handleResetToOriginal}
          observeImage={observeImage}
          favoriteExercises={preferences.favoriteExercises || []}
          hiddenExercises={preferences.hiddenExercises || []}
          darkMode={preferences.darkMode || false}
          feedbackState={feedbackState}
        />
      </div>

      {/* Enhanced Exercise Modal */}
      {selectedExercise && (
        <MobileExerciseModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={handleCloseModal}
          onAddToClass={handleAddToClass}
          onEdit={handleEditExercise}
        />
      )}

      {/* Interactive Exercise Form Modal */}
      {(isCreating || editingExercise) && (
        <InteractiveExerciseForm
          exercise={editingExercise || undefined}
          onSave={handleSaveExercise}
          onCancel={handleCancelExercise}
        />
      )}
    </div>
  );
};
