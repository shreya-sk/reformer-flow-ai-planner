import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Edit, Copy, Heart, Baby, Check, Search, Trash2, EyeOff, Eye, Plus, ArrowLeft, RotateCcw } from 'lucide-react';
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

// Default detail preferences
const defaultDetailPreferences = {
  showSpringsEquipment: true,
  showTeachingCues: true,
  showBreathingCues: true,
  showSetupInstructions: true,
  showMuscleGroups: true,
  showProgressions: true,
  showRegressions: true,
  showModifications: true,
  showSafetyNotes: true,
  showDescription: true,
  showMedia: true,
  showPregnancySafety: true,
};

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const navigate = useNavigate();
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { exercises, loading, createUserExercise, updateUserExercise, deleteUserExercise, customizeSystemExercise, resetSystemExerciseToOriginal } = useExercises();
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
        if (exercise.isSystemExercise) {
          await customizeSystemExercise(exercise.id, {
            custom_name: exercise.name,
            custom_duration: exercise.duration,
            custom_springs: exercise.springs,
            custom_cues: exercise.cues,
            custom_notes: exercise.notes,
            custom_difficulty: exercise.difficulty,
            custom_setup: exercise.setup,
            custom_reps_or_duration: exercise.repsOrDuration,
            custom_tempo: exercise.tempo,
            custom_target_areas: exercise.targetAreas,
            custom_breathing_cues: exercise.breathingCues,
            custom_teaching_focus: exercise.teachingFocus,
            custom_modifications: exercise.modifications,
          });
        } else {
          await updateUserExercise(exercise.id, exercise);
        }
      } else {
        await createUserExercise(exercise);
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
      isSystemExercise: false,
    };
    
    try {
      await createUserExercise(duplicated);
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
    
    if (!exercise.isCustom) {
      toast({
        title: "Cannot delete",
        description: "Only custom exercises can be deleted.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteUserExercise(exercise.id);
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleResetToOriginal = async (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!exercise.isSystemExercise || !exercise.isCustomized) {
      toast({
        title: "Cannot reset",
        description: "Only modified system exercises can be reset.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetSystemExerciseToOriginal(exercise.id);
    } catch (error) {
      console.error('Error resetting exercise:', error);
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

  const clearFilters = () => {
    setSelectedMuscleGroup('all');
    setSelectedPosition('all');
    setSearchTerm('');
  };

  const activeFiltersCount = (selectedMuscleGroup !== 'all' ? 1 : 0) + (selectedPosition !== 'all' ? 1 : 0);
  const hiddenCount = preferences.hiddenExercises?.length || 0;

  const detailPrefs = {
    ...defaultDetailPreferences,
    ...(preferences.exerciseDetailPreferences || {})
  };

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
              showHidden={showHidden}
              onToggleShowHidden={() => setShowHidden(!showHidden)}
              hiddenCount={hiddenCount}
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
                const isSystemExercise = exercise.isSystemExercise || false;
                const isCustomized = exercise.isCustomized || false;
                
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
                    {/* Status Indicators - Top Left */}
                    <div className="absolute top-2 left-2 z-10 flex gap-1">
                      {isHidden && (
                        <Badge variant="secondary" className="text-xs bg-gray-500 text-white">
                          Hidden
                        </Badge>
                      )}
                      {isCustomized && isSystemExercise && (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50">
                          Modified
                        </Badge>
                      )}
                      {isCustom && (
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-300 bg-blue-50">
                          Custom
                        </Badge>
                      )}
                    </div>

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

                    <CardContent className="p-4">
                      {/* Exercise Thumbnail */}
                      {detailPrefs.showMedia && (
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
                      )}

                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className={`font-semibold text-sm leading-tight ${
                            preferences.darkMode ? 'text-white' : 'text-sage-800'
                          }`}>
                            {exercise.name}
                          </h4>
                          
                          {/* Universal Edit Button - Always Visible */}
                          <Button
                            size="sm"
                            onClick={(e) => handleEditExercise(exercise, e)}
                            className="h-6 w-8 p-0 bg-sage-600 hover:bg-sage-700 text-white ml-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Action Icons - Only in hover state */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDuplicateExercise(exercise, e)}
                            className={`h-6 w-6 p-0 ${
                              preferences.darkMode 
                                ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                                : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'
                            }`}
                            title="Duplicate"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleToggleHidden(exercise, e)}
                            className={`h-6 w-6 p-0 ${
                              isHidden ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
                            }`}
                            title={isHidden ? "Show Exercise" : "Hide Exercise"}
                          >
                            {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </Button>

                          {/* Reset to Original - Modified System Exercises Only */}
                          {isCustomized && isSystemExercise && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                  title="Reset to Original"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reset to Original</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reset "{exercise.name}" to its original system version? All your customizations will be lost.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={(e) => handleResetToOriginal(exercise, e)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    Reset
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                          {/* Delete - Custom Exercises Only */}
                          {isCustom && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  title="Delete Exercise"
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

                        {/* Basic info - always visible */}
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {exercise.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{exercise.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="capitalize">{exercise.difficulty}</span>
                          </div>
                          {detailPrefs.showPregnancySafety && exercise.isPregnancySafe && (
                            <div className="flex items-center gap-1">
                              <Baby className="h-3 w-3 text-pink-500" />
                              <Check className="h-2 w-2 text-green-500" />
                            </div>
                          )}
                        </div>

                        {/* Springs and Equipment - conditional */}
                        {detailPrefs.showSpringsEquipment && (
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>Springs:</span>
                              {getSpringVisual(exercise.springs)}
                            </div>
                          </div>
                        )}

                        {/* Equipment - conditional */}
                        {detailPrefs.showSpringsEquipment && exercise.equipment && exercise.equipment.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Equipment:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {exercise.equipment.map(equip => (
                                <Badge key={equip} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  {equip}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Muscle groups - conditional */}
                        {detailPrefs.showMuscleGroups && (
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
                        )}

                        {/* Description - conditional */}
                        {detailPrefs.showDescription && exercise.description && (
                          <p className={`text-xs leading-relaxed line-clamp-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                            {exercise.description}
                          </p>
                        )}

                        {/* Teaching cues - conditional */}
                        {detailPrefs.showTeachingCues && exercise.cues && exercise.cues.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Teaching Cues:
                            </span>
                            <div className="space-y-1">
                              {exercise.cues.slice(0, 2).map((cue, index) => (
                                <p key={index} className={`text-xs leading-relaxed ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                                  • {cue}
                                </p>
                              ))}
                              {exercise.cues.length > 2 && (
                                <p className={`text-xs ${preferences.darkMode ? 'text-gray-500' : 'text-sage-500'}`}>
                                  +{exercise.cues.length - 2} more cues
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Breathing cues - conditional */}
                        {detailPrefs.showBreathingCues && exercise.breathingCues && exercise.breathingCues.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Breathing:
                            </span>
                            <div className="space-y-1">
                              {exercise.breathingCues.slice(0, 1).map((cue, index) => (
                                <p key={index} className={`text-xs leading-relaxed ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                                  • {cue}
                                </p>
                              ))}
                              {exercise.breathingCues.length > 1 && (
                                <p className={`text-xs ${preferences.darkMode ? 'text-gray-500' : 'text-sage-500'}`}>
                                  +{exercise.breathingCues.length - 1} more
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Setup instructions - conditional */}
                        {detailPrefs.showSetupInstructions && exercise.setup && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Setup:
                            </span>
                            <p className={`text-xs leading-relaxed line-clamp-2 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                              {exercise.setup}
                            </p>
                          </div>
                        )}

                        {/* Progressions - conditional */}
                        {detailPrefs.showProgressions && exercise.progressions && exercise.progressions.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Progressions:
                            </span>
                            <p className={`text-xs leading-relaxed line-clamp-1 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                              {exercise.progressions.length} available
                            </p>
                          </div>
                        )}

                        {/* Regressions - conditional */}
                        {detailPrefs.showRegressions && exercise.regressions && exercise.regressions.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Regressions:
                            </span>
                            <p className={`text-xs leading-relaxed line-clamp-1 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                              {exercise.regressions.length} available
                            </p>
                          </div>
                        )}

                        {/* Modifications - conditional */}
                        {detailPrefs.showModifications && exercise.modifications && exercise.modifications.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                              Modifications:
                            </span>
                            <p className={`text-xs leading-relaxed line-clamp-1 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                              {exercise.modifications.length} available
                            </p>
                          </div>
                        )}

                        {/* Safety notes - conditional */}
                        {detailPrefs.showSafetyNotes && exercise.contraindications && exercise.contraindications.length > 0 && (
                          <div className="space-y-1">
                            <span className={`text-xs font-medium text-red-600`}>
                              Safety Notes:
                            </span>
                            <p className={`text-xs leading-relaxed line-clamp-1 text-red-600`}>
                              {exercise.contraindications.length} contraindications
                            </p>
                          </div>
                        )}

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
          onEditExercise={handleUpdateExercise}
        />
      )}
    </>
  );
};

export default Library;
