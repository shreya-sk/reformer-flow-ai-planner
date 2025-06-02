
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { Exercise, ExerciseCategory, MuscleGroup } from '@/types/reformer';
import { MobileExerciseModal } from './MobileExerciseModal';
import { InteractiveExerciseForm } from './InteractiveExerciseForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Plus, ChevronDown, ChevronUp, Heart, Edit, Copy, EyeOff, Eye, Clock, Baby } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MuscleGroupExerciseLibraryProps {
  onExerciseSelect?: (exercise: Exercise) => void;
}

const muscleGroupMapping = {
  'Warm-up': ['warm-up'],
  'Core': ['core', 'upper-abs', 'lower-abs'],
  'Arms': ['arms', 'biceps', 'triceps'],
  'Legs': ['legs', 'quadriceps', 'hamstrings', 'glutes', 'calves'],
  'Back': ['back', 'lats', 'rhomboids'],
  'Cool-down': ['cool-down']
};

const getCategoryForExercise = (exercise: Exercise): string => {
  if (exercise.category === 'warm-up') return 'Warm-up';
  if (exercise.category === 'cool-down') return 'Cool-down';
  
  for (const [category, muscleGroups] of Object.entries(muscleGroupMapping)) {
    if (exercise.muscleGroups.some(mg => muscleGroups.includes(mg))) {
      return category;
    }
  }
  
  return 'Core'; // Default
};

export const MuscleGroupExerciseLibrary = ({ onExerciseSelect }: MuscleGroupExerciseLibraryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { exercises, loading, duplicateExercise, deleteUserExercise, resetSystemExerciseToOriginal, createUserExercise } = useExercises();
  const { addExercise } = usePersistedClassPlan();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showPregnancySafe, setShowPregnancySafe] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group exercises by muscle groups
  const categorizedExercises = useMemo(() => {
    const grouped: Record<string, Exercise[]> = {
      'Warm-up': [],
      'Core': [],
      'Arms': [],
      'Legs': [],
      'Back': [],
      'Cool-down': []
    };

    if (!exercises) return grouped;

    exercises.forEach(exercise => {
      const category = getCategoryForExercise(exercise);
      if (grouped[category]) {
        grouped[category].push(exercise);
      }
    });

    return grouped;
  }, [exercises]);

  // Filter exercises based on search and filters
  const filteredCategorizedExercises = useMemo(() => {
    const filtered: Record<string, Exercise[]> = {};

    Object.entries(categorizedExercises).forEach(([category, exercises]) => {
      const categoryExercises = exercises.filter(exercise => {
        const matchesSearch = !searchTerm || 
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const isHidden = preferences.hiddenExercises?.includes(exercise.id);
        const matchesHiddenFilter = showHidden || !isHidden;
        
        const matchesPregnancy = !showPregnancySafe || exercise.isPregnancySafe;
        
        const isFavorite = preferences.favoriteExercises?.includes(exercise.id);
        const matchesFavorites = !showFavorites || isFavorite;

        return matchesSearch && matchesHiddenFilter && matchesPregnancy && matchesFavorites;
      });

      if (categoryExercises.length > 0) {
        filtered[category] = categoryExercises;
      }
    });

    return filtered;
  }, [categorizedExercises, searchTerm, preferences.hiddenExercises, preferences.favoriteExercises, showHidden, showPregnancySafe, showFavorites]);

  const handleAddToClass = useCallback((exercise: Exercise) => {
    try {
      if (onExerciseSelect) {
        onExerciseSelect(exercise);
      } else {
        addExercise(exercise);
        navigate('/plan');
      }
      
      toast({
        title: "Added to class",
        description: `"${exercise.name}" has been added to your class plan.`,
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to class.",
        variant: "destructive",
      });
    }
  }, [onExerciseSelect, addExercise, navigate]);

  const handleExerciseSelect = useCallback((exercise: Exercise) => {
    setSelectedExercise(exercise);
  }, []);

  const handleToggleGroup = useCallback((groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  }, [expandedGroups]);

  const handleToggleFavorite = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteExercise(exerciseId);
  }, [toggleFavoriteExercise]);

  const handleToggleHidden = useCallback((exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHiddenExercise(exerciseId);
  }, [toggleHiddenExercise]);

  const handleEdit = useCallback((exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExercise(exercise);
  }, []);

  const handleDuplicate = useCallback(async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await duplicateExercise(exercise);
      toast({
        title: "Exercise duplicated",
        description: `"${exercise.name}" has been duplicated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate exercise.",
        variant: "destructive",
      });
    }
  }, [duplicateExercise]);

  const handleCreateExercise = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleSaveExercise = useCallback(async (exercise: Exercise) => {
    try {
      await createUserExercise(exercise);
      toast({
        title: "Exercise saved",
        description: `"${exercise.name}" has been saved to your library.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save exercise.",
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
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-sage-200/50 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-sage-800 mb-4">Exercise Library</h1>
          
          {/* Search and Filters */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-sage-300 focus:ring-sage-500"
              />
            </div>
            <Button
              onClick={handleCreateExercise}
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={showPregnancySafe ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPregnancySafe(!showPregnancySafe)}
              className={showPregnancySafe ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Baby className="h-3 w-3 mr-1" />
              Pregnancy Safe
            </Button>
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
              className={showFavorites ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <Heart className="h-3 w-3 mr-1" />
              Favorites
            </Button>
            <Button
              variant={showHidden ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHidden(!showHidden)}
              className={showHidden ? "bg-gray-600 hover:bg-gray-700" : ""}
            >
              <EyeOff className="h-3 w-3 mr-1" />
              Show Hidden
            </Button>
          </div>
        </div>
      </div>

      {/* Muscle Group Pills and Exercise Grid */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {Object.entries(filteredCategorizedExercises).map(([groupName, exercises]) => {
          const isExpanded = expandedGroups.has(groupName);
          
          return (
            <Card key={groupName} className="bg-white/90 backdrop-blur-xl border-sage-200/50">
              <CardContent className="p-0">
                {/* Muscle Group Pill Header */}
                <button
                  onClick={() => handleToggleGroup(groupName)}
                  className="w-full p-4 flex items-center justify-between hover:bg-sage-50 transition-colors rounded-t-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-sage-600 text-white rounded-full font-medium">
                      {groupName}
                    </div>
                    <Badge variant="outline" className="text-sage-600">
                      {exercises.length} exercises
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-sage-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-sage-600" />
                  )}
                </button>

                {/* 2-Column Exercise Grid */}
                {isExpanded && (
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      {exercises.map((exercise) => {
                        const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;
                        const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
                        
                        return (
                          <Card 
                            key={exercise.id}
                            className={`cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 rounded-xl overflow-hidden ${
                              isHidden ? 'opacity-60' : ''
                            }`}
                            onClick={() => handleExerciseSelect(exercise)}
                          >
                            <CardContent className="p-0">
                              <div className="relative aspect-square">
                                <img
                                  src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                                  alt={exercise.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                
                                {/* Action buttons */}
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                  <button
                                    onClick={(e) => handleToggleFavorite(exercise.id, e)}
                                    className={`w-6 h-6 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                                      isFavorite 
                                        ? 'bg-red-500/90 text-white' 
                                        : 'bg-white/80 text-gray-600 hover:bg-red-500/90 hover:text-white'
                                    }`}
                                  >
                                    <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
                                  </button>

                                  <button
                                    onClick={(e) => handleEdit(exercise, e)}
                                    className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-xl text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-sage-500/90 hover:text-white shadow-sm"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>

                                  <button
                                    onClick={(e) => handleDuplicate(exercise, e)}
                                    className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-xl text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-500/90 hover:text-white shadow-sm"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>

                                  <button
                                    onClick={(e) => handleToggleHidden(exercise.id, e)}
                                    className={`w-6 h-6 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                                      isHidden 
                                        ? 'bg-green-500/90 text-white' 
                                        : 'bg-white/80 text-gray-600 hover:bg-gray-500/90 hover:text-white'
                                    }`}
                                  >
                                    {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                  </button>
                                </div>

                                {/* Bottom info */}
                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                  <div className="flex items-center justify-between">
                                    {exercise.isPregnancySafe && (
                                      <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] px-1.5 py-1 rounded-md flex items-center gap-1">
                                        <Baby className="h-2 w-2" />
                                        <span>Safe</span>
                                      </div>
                                    )}

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToClass(exercise);
                                      }}
                                      className="ml-auto w-6 h-6 rounded-full bg-sage-600/90 hover:bg-sage-700/90 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Exercise info */}
                              <div className="p-3">
                                <h3 className="font-semibold text-sm text-gray-900 truncate leading-tight mb-1">
                                  {exercise.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{exercise.duration}min</span>
                                  <span>•</span>
                                  <span className="capitalize">{exercise.difficulty}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <MobileExerciseModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToClass={handleAddToClass}
          onEdit={() => setEditingExercise(selectedExercise)}
        />
      )}

      {/* Exercise Form Modal */}
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
