import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Dumbbell, Heart, Clock, Search, Filter, Baby, Plus, Copy, Edit, Settings } from 'lucide-react';
import { Exercise, ExerciseCategory } from '@/types/reformer';
import { useExercises } from '@/hooks/useExercises';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ModernExerciseModal } from './ModernExerciseModal';
import { InteractiveExerciseForm } from './InteractiveExerciseForm';
import { SmartAddButton } from './SmartAddButton';
import { MobileExerciseCard } from './mobile/MobileExerciseCard';

interface CategoryExerciseLibraryProps {
  onExerciseSelect?: (exercise: Exercise) => void;
}

// Category mapping to group exercises
const categoryMapping = {
  'warm-up': 'Warm-up',
  'arms': 'Arms', 
  'core': 'Core',
  'legs': 'Legs',
  'back': 'Back',
  'cool-down': 'Cool-down'
};

const getCategoryForExercise = (exercise: Exercise): string => {
  // Check category first
  if (exercise.category === 'warm-up') return 'Warm-up';
  if (exercise.category === 'cool-down') return 'Cool-down';
  
  // Check muscle groups
  if (exercise.muscleGroups.includes('core') || exercise.muscleGroups.includes('upper-abs') || exercise.muscleGroups.includes('lower-abs')) return 'Core';
  if (exercise.muscleGroups.includes('arms') || exercise.muscleGroups.includes('biceps') || exercise.muscleGroups.includes('triceps')) return 'Arms';
  if (exercise.muscleGroups.includes('legs') || exercise.muscleGroups.includes('quadriceps') || exercise.muscleGroups.includes('hamstrings')) return 'Legs';
  if (exercise.muscleGroups.includes('back') || exercise.muscleGroups.includes('lats') || exercise.muscleGroups.includes('rhomboids')) return 'Back';
  
  return 'Core'; // Default
};

export const CategoryExerciseLibrary = ({ onExerciseSelect }: CategoryExerciseLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<{[key: string]: 'success' | 'error' | null}>({});
  const { exercises, createUserExercise, updateUserExercise, customizeSystemExercise } = useExercises();
  const { preferences, toggleFavoriteExercise, togglePregnancySafeOnly, toggleHiddenExercise } = useUserPreferences();

  // Group exercises by category
  const categorizedExercises = useMemo(() => {
    const grouped: Record<string, Exercise[]> = {
      'Warm-up': [],
      'Arms': [],
      'Core': [],
      'Legs': [],
      'Back': [],
      'Cool-down': []
    };

    exercises.forEach(exercise => {
      const category = getCategoryForExercise(exercise);
      if (grouped[category]) {
        grouped[category].push(exercise);
      }
    });

    return grouped;
  }, [exercises]);

  // Filter exercises based on search and preferences
  const filteredExercises = useMemo(() => {
    if (!selectedCategory) {
      // Main library view - filter all exercises
      let allExercises = exercises;
      
      // Apply search filter
      if (searchTerm) {
        allExercises = allExercises.filter(exercise =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply pregnancy safe filter
      if (preferences.showPregnancySafeOnly) {
        allExercises = allExercises.filter(exercise => exercise.isPregnancySafe);
      }
      
      return allExercises;
    }
    
    let categoryExercises = categorizedExercises[selectedCategory] || [];
    
    // Apply search filter
    if (searchTerm) {
      categoryExercises = categoryExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply pregnancy safe filter
    if (preferences.showPregnancySafeOnly) {
      categoryExercises = categoryExercises.filter(exercise => exercise.isPregnancySafe);
    }
    
    return categoryExercises;
  }, [selectedCategory, categorizedExercises, exercises, searchTerm, preferences.showPregnancySafeOnly]);

  const categoryColors = {
    'Warm-up': 'from-sage-400 to-sage-500',
    'Arms': 'from-sage-500 to-sage-600', 
    'Core': 'from-burgundy-700 to-burgundy-800',
    'Legs': 'from-sage-600 to-sage-700',
    'Back': 'from-sage-400 to-sage-500',
    'Cool-down': 'from-sage-300 to-sage-400'
  };

  const handleExerciseClick = (exercise: Exercise) => {
    // This will be handled by the card's internal expansion
    console.log('Exercise selected:', exercise.name);
  };

  const handleAddToClass = (exercise: Exercise) => {
    if (onExerciseSelect) {
      console.log('🔵 CategoryExerciseLibrary: Adding exercise to class:', exercise.name);
      
      // Show success feedback
      setFeedbackState(prev => ({ ...prev, [exercise.id]: 'success' }));
      
      // Call the parent handler
      onExerciseSelect(exercise);
      
      // Clear feedback after delay
      setTimeout(() => {
        setFeedbackState(prev => ({ ...prev, [exercise.id]: null }));
      }, 2000);
    }
  };

  const handleAddExercise = () => {
    setExerciseToEdit(null);
    setShowExerciseForm(true);
  };

  const handleDuplicateExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setExerciseToEdit({
      ...exercise,
      id: '',
      name: `${exercise.name} (Copy)`,
      isCustom: true
    });
    setShowExerciseForm(true);
  };

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setExerciseToEdit(exercise);
    setShowExerciseForm(true);
    setSelectedExercise(null);
  };

  const handleDeleteExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log('Delete exercise:', exercise.name);
  };

  const handleCustomizeSystemExercise = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await customizeSystemExercise(exercise, {});
      setSaveSuccess("Exercise customized successfully!");
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error('Error customizing system exercise:', error);
      setSaveError("Failed to customize exercise.");
      setTimeout(() => setSaveError(null), 3000);
    }
  };

  const handleSaveExercise = async (exercise: Exercise) => {
    try {
      if (exerciseToEdit?.id && exerciseToEdit.id !== '') {
        // Editing existing exercise
        await updateUserExercise(exerciseToEdit.id, exercise);
        setSaveSuccess("Exercise updated successfully!");
      } else {
        // Adding new exercise
        const exerciseData = {
          ...exercise,
          isCustom: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        // Remove id from exercise data when creating
        const { id, ...exerciseWithoutId } = exerciseData;
        await createUserExercise(exerciseWithoutId);
        setSaveSuccess("Exercise created successfully!");
      }
      setShowExerciseForm(false);
      setExerciseToEdit(null);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving exercise:', error);
      setSaveError("Failed to save exercise.");
      setTimeout(() => setSaveError(null), 3000);
    }
  };

  // Image observer for lazy loading
  const observeImage = (element: HTMLElement) => {
    // Simple implementation - in a real app you'd use IntersectionObserver
    console.log('Observing image:', element);
  };

  if (showExerciseForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 p-4">
        {/* Status Messages */}
        {saveError && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            {saveError}
          </div>
        )}
        
        {saveSuccess && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            {saveSuccess}
          </div>
        )}
        
        <InteractiveExerciseForm
          exercise={exerciseToEdit || undefined}
          onSave={handleSaveExercise}
          onCancel={() => {
            setShowExerciseForm(false);
            setExerciseToEdit(null);
          }}
        />
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
        {/* Status Messages */}
        {saveError && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            {saveError}
          </div>
        )}
        
        {saveSuccess && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            {saveSuccess}
          </div>
        )}

        {/* Enhanced Header with Search and Icons */}
        <div className="space-y-4 mb-6 p-4">
          {/* Top row with back button and category name */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full hover:bg-sage-100"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <h2 className="text-2xl font-bold text-sage-800">{selectedCategory}</h2>
            <Badge className="bg-sage-100 text-sage-700">
              {filteredExercises.length} exercises
            </Badge>
          </div>
        </div>

        {/* 2-Column Mobile Exercise Grid with expansion functionality */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {filteredExercises.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center h-64 text-center p-8">
              <div className="text-4xl mb-4">🏋️‍♀️</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No exercises found</h3>
              <p className="text-gray-600 text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <MobileExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFavorite={preferences.favoriteExercises?.includes(exercise.id) || false}
                isHidden={preferences.hiddenExercises?.includes(exercise.id) || false}
                darkMode={preferences.darkMode}
                feedbackState={feedbackState[exercise.id]}
                onSelect={() => handleExerciseClick(exercise)}
                onAddToClass={() => handleAddToClass(exercise)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  toggleFavoriteExercise(exercise.id);
                }}
                onToggleHidden={(e) => {
                  e.stopPropagation();
                  toggleHiddenExercise(exercise.id);
                }}
                onEdit={handleEditExercise}
                onDuplicate={handleDuplicateExercise}
                onDelete={handleDeleteExercise}
                onCustomizeSystemExercise={handleCustomizeSystemExercise}
                observeImage={observeImage}
                className="h-fit" // Allow cards to expand naturally
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 p-4">
      {/* Status Messages */}
      {saveError && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          {saveSuccess}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sage-800 mb-2">Exercise Library</h1>
        <p className="text-sage-600">Choose a category to explore exercises</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4 mb-6">
        {/* Search bar with tiny icons */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-sage-300 focus:border-sage-500 bg-white rounded-xl"
            />
          </div>

          {/* Tiny action icons */}
          <div className="flex items-center gap-2">
            {/* Filter */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 h-8 w-8 rounded-full hover:bg-sage-100"
            >
              <Filter className="h-4 w-4 text-sage-600" />
            </Button>

            {/* Pregnancy Safe */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePregnancySafeOnly}
              className={`p-2 h-8 w-8 rounded-full hover:bg-sage-100 ${preferences.showPregnancySafeOnly ? 'bg-pink-100' : ''}`}
            >
              <Baby className={`h-4 w-4 ${preferences.showPregnancySafeOnly ? 'text-pink-600' : 'text-sage-600'}`} />
            </Button>

            {/* Add Exercise */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddExercise}
              className="p-2 h-8 w-8 rounded-full hover:bg-sage-100"
            >
              <Plus className="h-4 w-4 text-sage-600" />
            </Button>
          </div>
        </div>

        {/* Filters panel (if shown) */}
        {showFilters && (
          <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
            <p className="text-sm text-sage-600">Additional filters coming soon...</p>
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        {Object.entries(categoryMapping).map(([key, label]) => {
          const exerciseCount = categorizedExercises[label]?.length || 0;
          
          return (
            <Card 
              key={key}
              className="cursor-pointer hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white/60 backdrop-blur-xl border-0 rounded-3xl overflow-hidden group"
              onClick={() => setSelectedCategory(label)}
            >
              <CardContent className="p-0">
                <div className={`relative h-20 bg-gradient-to-r ${categoryColors[label]} flex items-center justify-between px-6`}>
                  {/* Category info */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{label}</h3>
                      <p className="text-white/80 text-sm">{exerciseCount} exercises</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
