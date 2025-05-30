import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useIsMobile } from '@/hooks/use-mobile';
import { Exercise, ExerciseCategory, MuscleGroup } from '@/types/reformer';
import { MobileExerciseGrid } from './mobile/MobileExerciseGrid';
import { MobileLibraryHeader } from './mobile/MobileLibraryHeader';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { MobileFilterPanel } from './MobileFilterPanel';
import { ImprovedExerciseForm } from './ImprovedExerciseForm';
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

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPregnancySafe, setShowPregnancySafe] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Filter states - matching MobileFilterPanel interface
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');

  // Filter exercises
  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    return exercises.filter(exercise => {
      // Search filter
      const matchesSearch = !searchTerm || 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Hidden exercises filter
      const isHidden = preferences.hiddenExercises?.includes(exercise.id);
      const matchesHiddenFilter = showHidden || !isHidden;
      
      // Pregnancy safe filter
      const matchesPregnancy = !showPregnancySafe || exercise.isPregnancySafe;

      // Category filter
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;

      // Muscle group filter
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

  // Debug: Add to class function
  const handleAddToClass = useCallback((exercise: Exercise) => {
    console.log('🔵 MobileOptimizedExerciseLibrary handleAddToClass called with:', exercise);
    console.log('🔵 Current user:', user?.id);
    console.log('🔵 onExerciseSelect prop:', !!onExerciseSelect);
    
    try {
      if (onExerciseSelect) {
        console.log('🔵 Calling onExerciseSelect prop');
        onExerciseSelect(exercise);
      } else {
        console.log('🔵 Using addExercise from usePersistedClassPlan');
        console.log('🔵 Exercise being added:', {
          id: exercise.id,
          name: exercise.name,
          duration: exercise.duration,
          category: exercise.category
        });
        
        addExercise(exercise);
        
        toast({
          title: "Added to class",
          description: `"${exercise.name}" has been added to your class plan.`,
        });
        
        console.log('🔵 Exercise added successfully, navigating to plan');
        navigate('/plan');
      }
    } catch (error) {
      console.error('🔴 Error in MobileOptimizedExerciseLibrary handleAddToClass:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to class plan.",
        variant: "destructive",
      });
    }
  }, [onExerciseSelect, addExercise, navigate, user]);

  const handleExerciseSelect = useCallback((exercise: Exercise) => {
    console.log('🔵 Exercise selected:', exercise.name);
    setSelectedExercise(exercise);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedExercise(null);
    setEditingExercise(null);
  }, []);

  const handleEditExercise = useCallback((exercise: Exercise) => {
    console.log('🔵 Edit exercise:', exercise.name);
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
      toast({
        title: "Exercise created",
        description: `"${exercise.name}" has been added to your library.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create exercise.",
        variant: "destructive",
      });
    }
    setIsCreating(false);
    setEditingExercise(null);
  }, [createUserExercise]);

  const handleCancelExercise = useCallback(() => {
    setIsCreating(false);
    setEditingExercise(null);
  }, []);

  // FIXED: Proper favorite functionality
  const handleToggleFavorite = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('❤️ Toggling favorite for exercise:', exerciseId);
    
    const isFavorite = preferences.favoriteExercises?.includes(exerciseId) || false;
    const exerciseName = exercises.find(ex => ex.id === exerciseId)?.name || 'Exercise';
    
    toggleFavoriteExercise(exerciseId);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `"${exerciseName}" ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  }, [preferences.favoriteExercises, exercises, toggleFavoriteExercise]);

  // FIXED: Proper hidden functionality
  const handleToggleHidden = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('👁️ Toggling hidden for exercise:', exerciseId);
    
    const isHidden = preferences.hiddenExercises?.includes(exerciseId) || false;
    const exerciseName = exercises.find(ex => ex.id === exerciseId)?.name || 'Exercise';
    
    toggleHiddenExercise(exerciseId);
    
    toast({
      title: isHidden ? "Exercise unhidden" : "Exercise hidden",
      description: isHidden 
        ? `"${exerciseName}" is now visible in your library.`
        : `"${exerciseName}" has been hidden from your library.`,
    });
  }, [preferences.hiddenExercises, exercises, toggleHiddenExercise]);

  const handleEdit = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditExercise(exercise);
  }, [handleEditExercise]);

  const handleDuplicate = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
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
  }, [duplicateExercise]);

  const handleDelete = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exercise.isCustom) return;
    
    try {
      await deleteUserExercise(exercise.id);
      toast({
        title: "Exercise deleted",
        description: `"${exercise.name}" has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exercise.",
        variant: "destructive",
      });
    }
  }, [deleteUserExercise]);

  const handleResetToOriginal = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exercise.isSystemExercise || !exercise.isCustomized) return;
    
    try {
      await resetSystemExerciseToOriginal(exercise.id);
      toast({
        title: "Exercise reset",
        description: `"${exercise.name}" has been reset to its original version.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset exercise.",
        variant: "destructive",
      });
    }
  }, [resetSystemExerciseToOriginal]);

  const observeImage = useCallback((element: HTMLImageElement, src: string) => {
    // Simple lazy loading implementation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(element);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Header - Fixed at top */}
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
        />
      </div>

      {/* Consolidated Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={handleCloseModal}
          onAddToClass={handleAddToClass}
          onEditExercise={handleEditExercise}
          onSave={handleSaveExercise}
        />
      )}

      {/* Create/Edit Exercise Form */}
      {(isCreating || editingExercise) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ImprovedExerciseForm
              exercise={editingExercise || undefined}
              onSave={handleSaveExercise}
              onCancel={handleCancelExercise}
            />
          </div>
        </div>
      )}
    </div>
  );
};