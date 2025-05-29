import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Edit, Copy, Heart, Baby, Check, Search, Trash2, EyeOff, Eye, Plus, ArrowLeft } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SmartAddButton } from './SmartAddButton';
import { ExerciseLibraryHeader } from './ExerciseLibraryHeader';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const navigate = useNavigate();
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { exercises, loading, addExercise, updateExercise, deleteExercise } = useExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [selectedPosition, setSelectedPosition] = useState<ExerciseCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [localExercises, setLocalExercises] = useState<Exercise[]>([]);

  // Keep local state in sync with exercises from hook
  useEffect(() => {
    setLocalExercises(exercises);
  }, [exercises]);

  const filteredExercises = localExercises.filter(exercise => {
    // Filter hidden exercises unless explicitly showing them
    const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
    if (!showHidden && isHidden) return false;
    if (showHidden && !isHidden) return false;

    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || 
                              exercise.muscleGroups.includes(selectedMuscleGroup);
    
    const matchesPosition = selectedPosition === 'all' || exercise.category === selectedPosition;
    
    const matchesPregnancy = !preferences.showPregnancySafeOnly || exercise.isPregnancySafe;
    
    return matchesSearch && matchesMuscleGroup && matchesPosition && matchesPregnancy;
  });

  const getSpringVisual = (springs: string) => {
    const springConfig = {
      'light': [{ color: 'bg-green-500', count: 1 }],
      'medium': [{ color: 'bg-yellow-500', count: 1 }],
      'heavy': [{ color: 'bg-red-500', count: 2 }],
      'mixed': [
        { color: 'bg-red-500', count: 1 },
        { color: 'bg-yellow-500', count: 1 },
        { color: 'bg-green-500', count: 1 }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-1">
        {config.map((spring, index) => (
          <div key={index} className="flex gap-0.5">
            {Array.from({ length: spring.count }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${spring.color}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return preferences.darkMode ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return preferences.darkMode ? 'bg-amber-900/50 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return preferences.darkMode ? 'bg-rose-900/50 text-rose-300 border-rose-700' : 'bg-rose-100 text-rose-800 border-rose-200';
      default: return preferences.darkMode ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveExercise = async (exercise: Exercise) => {
    try {
      if (editingExercise) {
        await updateExercise(exercise);
        // Update local state immediately
        setLocalExercises(prev => prev.map(ex => ex.id === exercise.id ? exercise : ex));
      } else {
        await addExercise(exercise);
        // Add to local state immediately
        setLocalExercises(prev => [...prev, exercise]);
      }
      setShowForm(false);
      setEditingExercise(null);
    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  };

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDuplicateExercise = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: Exercise = {
      ...exercise,
      id: `${exercise.id}-copy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${exercise.name} (Copy)`,
      isCustom: true,
      exerciseType: 'Custom'
    };
    
    try {
      await addExercise(duplicated);
      // Add to local state immediately for instant UI update
      setLocalExercises(prev => [...prev, duplicated]);
      toast({
        title: "Exercise duplicated",
        description: `"${duplicated.name}" has been created.`,
      });
    } catch (error) {
      console.error('Error duplicating exercise:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate exercise.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExercise = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only allow deleting custom exercises
    if (!exercise.isCustom) {
      toast({
        title: "Cannot delete",
        description: "Only custom exercises can be deleted.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteExercise(exercise.id);
      // Remove from local state immediately
      setLocalExercises(prev => prev.filter(ex => ex.id !== exercise.id));
      toast({
        title: "Exercise deleted",
        description: `"${exercise.name}" has been permanently deleted.`,
      });
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleToggleHidden = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHiddenExercise(exercise.id);
    const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
    toast({
      title: isHidden ? "Exercise unhidden" : "Exercise hidden",
      description: isHidden 
        ? `"${exercise.name}" is now visible in your library.`
        : `"${exercise.name}" has been hidden from your library.`,
    });
  };

  const handleCardClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    try {
      await updateExercise(updatedExercise);
      setLocalExercises(prev => prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex));
      setSelectedExercise(updatedExercise);
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const clearFilters = () => {
    setSelectedMuscleGroup('all');
    setSelectedPosition('all');
    setSearchTerm('');
  };

  const activeFiltersCount = (selectedMuscleGroup !== 'all' ? 1 : 0) + (selectedPosition !== 'all' ? 1 : 0);
  const hiddenCount = preferences.hiddenExercises?.length || 0;

  if (loading) {
    return (
      <div className={`w-full ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white to-sage-25'} flex items-center justify-center h-full`}>
        <div className={preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}>Loading exercises...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white to-sage-25'} flex flex-col h-full`}>
        {/* Header */}
        <div className={`p-6 border-b ${preferences.darkMode ? 'border-gray-700 bg-gray-800' : 'border-sage-200 bg-white'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'}`}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                
                <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
                
                <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Exercise Library</h1>
              </div>

              <Button 
                onClick={() => navigate('/plan')}
                className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
              >
                Plan New Class
              </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
                  <input
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 w-full h-10 rounded-md border px-3 py-2 text-sm ${
                      preferences.darkMode 
                        ? 'border-gray-600 focus:border-gray-500 bg-gray-700 text-white' 
                        : 'border-sage-300 focus:border-sage-500 bg-white'
                    }`}
                  />
                </div>

                {/* Show Hidden Toggle */}
                <Button
                  variant={showHidden ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowHidden(!showHidden)}
                  className="gap-2"
                >
                  {showHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {showHidden ? `Showing Hidden (${hiddenCount})` : `Show Hidden (${hiddenCount})`}
                </Button>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className={`text-xs ${preferences.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-sage-500 hover:text-sage-700'}`}
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              <Button 
                onClick={() => setShowForm(true)}
                size="sm" 
                className="bg-sage-600 hover:bg-sage-700 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </div>

            <ExerciseLibraryHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedMuscleGroup={selectedMuscleGroup}
              onMuscleGroupChange={setSelectedMuscleGroup}
              selectedPosition={selectedPosition}
              onPositionChange={setSelectedPosition}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onAddExercise={() => setShowForm(true)}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExercises.map((exercise) => {
                const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;
                const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
                const isCustom = exercise.isCustom || false;
                
                return (
                  <Card 
                    key={exercise.id} 
                    className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative ${
                      preferences.darkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-800' 
                        : 'border-sage-200 hover:border-sage-300 bg-white'
                    } ${isHidden ? 'opacity-60' : ''}`}
                    onClick={() => handleCardClick(exercise)}
                  >
                    {/* Favorite Icon - Top Right */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteExercise(exercise.id);
                      }}
                      size="sm"
                      variant="ghost"
                      className={`absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full ${
                        isFavorite 
                          ? 'text-red-500 hover:text-red-600 bg-white/90 hover:bg-white' 
                          : 'text-gray-400 hover:text-red-500 bg-white/60 hover:bg-white/90'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>

                    {/* Hidden indicator */}
                    {isHidden && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge variant="secondary" className="text-xs bg-gray-500 text-white">
                          Hidden
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-4">
                      {/* Exercise Thumbnail */}
                      <div className={`w-full h-32 rounded-xl overflow-hidden border mb-3 ${
                        preferences.darkMode 
                          ? 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-600' 
                          : 'bg-gradient-to-br from-sage-100 to-sage-200 border-sage-200'
                      }`}>
                        {exercise.image ? (
                          <img 
                            src={exercise.image} 
                            alt={exercise.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
                            alt="Default exercise"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className={`font-semibold text-sm leading-tight ${
                            preferences.darkMode ? 'text-white' : 'text-sage-800'
                          }`}>
                            {exercise.name}
                          </h4>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleEditExercise(exercise, e)}
                              className={`h-6 w-6 p-0 ${
                                preferences.darkMode 
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                                  : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'
                              }`}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDuplicateExercise(exercise, e)}
                              className={`h-6 w-6 p-0 ${
                                preferences.darkMode 
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                                  : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'
                              }`}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleToggleHidden(exercise, e)}
                              className={`h-6 w-6 p-0 ${
                                preferences.darkMode 
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                                  : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'
                              }`}
                            >
                              {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            {isCustom && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently delete "{exercise.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={(e) => handleDeleteExercise(exercise, e)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                              <span className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                                {exercise.duration}min
                              </span>
                            </div>
                            
                            {/* Pregnancy Safe Indicator */}
                            {exercise.isPregnancySafe && (
                              <div className="flex items-center gap-1">
                                <Baby className="h-3 w-3 text-pink-500" />
                                <Check className="h-2 w-2 text-green-500" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>Springs:</span>
                            {getSpringVisual(exercise.springs)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge className={`text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </Badge>
                          {isCustom && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Custom
                            </Badge>
                          )}
                          {exercise.muscleGroups.slice(0, 2).map(group => (
                            <Badge 
                              key={group} 
                              variant="secondary" 
                              className={`text-xs ${
                                preferences.darkMode 
                                  ? 'bg-gray-700 text-gray-300 border-gray-600' 
                                  : 'bg-sage-100 text-sage-700 border-sage-200'
                              }`}
                            >
                              {group}
                            </Badge>
                          ))}
                        </div>

                        <div className="pt-2">
                          <SmartAddButton
                            exercise={exercise}
                            className="w-full"
                            size="sm"
                            showFeedback={true}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredExercises.length === 0 && (
              <div className="text-center py-12">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${
                  preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'
                }`}>
                  <Search className={`h-8 w-8 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  {showHidden ? 'No hidden exercises found' : 'No exercises found'}
                </h3>
                <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                  {showHidden 
                    ? 'You haven\'t hidden any exercises yet.'
                    : 'Try adjusting your search or filters'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="p-0 max-w-lg">
          <ExerciseForm
            exercise={editingExercise}
            onSave={handleSaveExercise}
            onCancel={() => {
              setShowForm(false);
              setEditingExercise(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExercise(null);
          }}
          onUpdate={handleUpdateExercise}
        />
      )}
    </>
  );
};
