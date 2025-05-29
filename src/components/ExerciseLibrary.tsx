
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Copy, Heart, Baby, Check, Search } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SmartAddButton } from './SmartAddButton';
import { ExerciseLibraryHeader } from './ExerciseLibraryHeader';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from '@/hooks/use-toast';

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const { exercises, loading, createUserExercise, customizeSystemExercise } = useExercises();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [selectedPosition, setSelectedPosition] = useState<ExerciseCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredExercises = exercises.filter(exercise => {
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
      if (editingExercise && (editingExercise as any).isSystemExercise) {
        await customizeSystemExercise(editingExercise.id, {
          custom_name: exercise.name !== editingExercise.name ? exercise.name : null,
          custom_duration: exercise.duration !== editingExercise.duration ? exercise.duration : null,
          custom_springs: exercise.springs !== editingExercise.springs ? exercise.springs : null,
          custom_cues: exercise.cues !== editingExercise.cues ? exercise.cues : null,
          custom_notes: exercise.notes !== editingExercise.notes ? exercise.notes : null,
          custom_difficulty: exercise.difficulty !== editingExercise.difficulty ? exercise.difficulty : null,
        });
        
        toast({
          title: "Exercise customized!",
          description: `Your customization of "${exercise.name}" has been saved.`,
        });
      } else {
        await createUserExercise(exercise);
        
        toast({
          title: "Exercise created!",
          description: `"${exercise.name}" has been added to your library.`,
        });
      }
      
      setShowForm(false);
      setEditingExercise(null);
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast({
        title: "Error saving exercise",
        description: "Failed to save the exercise.",
        variant: "destructive",
      });
    }
  };

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDuplicateExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = {
      ...exercise,
      id: `${exercise.id}-copy-${Date.now()}`,
      name: `${exercise.name} (Copy)`,
      isCustom: true,
      isSystemExercise: false,
    };
    setEditingExercise(duplicated);
    setShowForm(true);
  };

  const handleCardClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setSelectedExercise(updatedExercise);
  };

  const clearFilters = () => {
    setSelectedMuscleGroup('all');
    setSelectedPosition('all');
    setSearchTerm('');
  };

  const activeFiltersCount = (selectedMuscleGroup !== 'all' ? 1 : 0) + (selectedPosition !== 'all' ? 1 : 0);

  if (loading) {
    return (
      <div className={`w-full ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white to-sage-25'} flex flex-col h-full`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className={preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}>Loading exercises...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white to-sage-25'} flex flex-col h-full`}>
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExercises.map((exercise) => {
                const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;
                const isCustomized = (exercise as any).isCustomized;
                const isUserCreated = (exercise as any).isCustom;
                
                return (
                  <Card 
                    key={exercise.id} 
                    className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative ${
                      preferences.darkMode 
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-800' 
                        : 'border-sage-200 hover:border-sage-300 bg-white'
                    } ${isCustomized ? 'ring-2 ring-blue-200' : ''}`}
                    onClick={() => handleCardClick(exercise)}
                  >
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      {isUserCreated && (
                        <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                          Custom
                        </Badge>
                      )}
                      {isCustomized && !isUserCreated && (
                        <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                          Modified
                        </Badge>
                      )}
                    </div>

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

                    <CardContent className="p-4">
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
                  No exercises found
                </h3>
                <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                  Try adjusting your search or filters
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
