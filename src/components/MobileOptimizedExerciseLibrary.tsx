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
  const { preferences } = useUserPreferences();
  const { exercises, loading } = useExercises();
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

  // Updated debug: Add to class function
  const handleAddToClass = useCallback((exercise: Exercise) => {
    console.log('🔵 MobileOptimizedExerciseLibrary handleAddToClass called with:', exercise);
    console.log('🔵 Current user:', user?.id);
    console.log('🔵 onExerciseSelect prop:', !!onExerciseSelect);
    
    try {
      if (onExerciseSelect) {
        console.log('🔵 Calling onExerciseSelect prop (should add to class)');
        
        // Create unique instance for the class plan
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const uniqueId = `${exercise.id}-${timestamp}-${randomId}`;
        
        const exerciseToAdd = {
          ...exercise,
          id: uniqueId,
        };
        
        console.log('🔵 Calling onExerciseSelect with unique exercise:', exerciseToAdd);
        onExerciseSelect(exerciseToAdd);
        
        console.log('🔵 Exercise added successfully via onExerciseSelect');
      } else {
        console.log('🔴 No onExerciseSelect prop provided - exercise cannot be added to class');
        toast({
          title: "Error",
          description: "Cannot add exercise to class - no handler provided.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('🔴 Error in MobileOptimizedExerciseLibrary handleAddToClass:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to class plan.",
        variant: "destructive",
      });
    }
  }, [onExerciseSelect, user]);

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

  const handleSaveExercise = useCallback((exercise: Exercise) => {
    // Handle save logic here
    setIsCreating(false);
    setEditingExercise(null);
  }, []);

  const handleCancelExercise = useCallback(() => {
    setIsCreating(false);
    setEditingExercise(null);
  }, []);

  // Mock functions for MobileExerciseGrid props that aren't used in this simplified view
  const handleToggleFavorite = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement favorite functionality
  }, []);

  const handleToggleHidden = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement hide functionality
  }, []);

  const handleEdit = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditExercise(exercise);
  }, [handleEditExercise]);

  const handleDuplicate = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement duplicate functionality
  }, []);

  const handleDelete = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
  }, []);

  const handleResetToOriginal = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement reset functionality
  }, []);

  const observeImage = useCallback((element: HTMLImageElement, src: string) => {
    // TODO: Implement image lazy loading
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
