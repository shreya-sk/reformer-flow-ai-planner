
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useIsMobile } from '@/hooks/use-mobile';
import { Exercise, ExerciseCategory } from '@/types/reformer';
import { MobileExerciseGrid } from './mobile/MobileExerciseGrid';
import { MobileLibraryHeader } from './mobile/MobileLibraryHeader';
import { MobileExerciseModal } from './MobileExerciseModal';
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
  const [isCreating, setIsCreating] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<ExerciseCategory[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

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
      
      // Pregnancy safe filter
      const matchesPregnancy = !showPregnancySafe || exercise.isPregnancySafe;

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(exercise.category);

      // Muscle group filter
      const matchesMuscleGroup = selectedMuscleGroups.length === 0 ||
        selectedMuscleGroups.some(group => exercise.muscleGroups.includes(group as any));

      return matchesSearch && !isHidden && matchesPregnancy && matchesCategory && matchesMuscleGroup;
    });
  }, [exercises, searchTerm, preferences.hiddenExercises, showPregnancySafe, selectedCategories, selectedMuscleGroups]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (showPregnancySafe) count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedMuscleGroups.length > 0) count += selectedMuscleGroups.length;
    return count;
  }, [showPregnancySafe, selectedCategories, selectedMuscleGroups]);

  // Debug: Add to class function
  const handleAddToClass = useCallback((exercise: Exercise) => {
    console.log('🔵 MobileOptimizedExerciseLibrary handleAddToClass called with:', exercise);
    
    try {
      if (onExerciseSelect) {
        console.log('🔵 Calling onExerciseSelect prop');
        onExerciseSelect(exercise);
      } else {
        console.log('🔵 Using addExercise from usePersistedClassPlan');
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
  }, [onExerciseSelect, addExercise, navigate]);

  const handleExerciseClick = useCallback((exercise: Exercise) => {
    console.log('🔵 Exercise clicked:', exercise.name);
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
    setSelectedCategories([]);
    setSelectedMuscleGroups([]);
    setShowPregnancySafe(false);
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
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          selectedMuscleGroups={selectedMuscleGroups}
          onMuscleGroupsChange={setSelectedMuscleGroups}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Exercise Grid */}
      <div className="pb-20">
        <MobileExerciseGrid
          exercises={filteredExercises}
          onExerciseClick={handleExerciseClick}
          onAddToClass={handleAddToClass}
        />
      </div>

      {/* Modals */}
      {selectedExercise && (
        isMobile ? (
          <MobileExerciseModal
            exercise={selectedExercise}
            isOpen={!!selectedExercise}
            onClose={handleCloseModal}
            onAddToClass={handleAddToClass}
            onEdit={handleEditExercise}
          />
        ) : (
          <ExerciseDetailModal
            exercise={selectedExercise}
            isOpen={!!selectedExercise}
            onClose={handleCloseModal}
            onAddToClass={handleAddToClass}
            onEditExercise={handleEditExercise}
          />
        )
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
