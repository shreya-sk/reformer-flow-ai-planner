import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Heart, Edit, Copy, EyeOff, Eye, Trash2, RotateCcw, Plus } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [showPregnancySafe, setShowPregnancySafe] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { exercises, duplicateExercise, updateUserExercise, customizeSystemExercise, deleteUserExercise, resetSystemExerciseToOriginal } = useExercises();

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
      const matchesPregnancy = !showPregnancySafe || exercise.isPregnancySafe;
      
      return matchesSearch && matchesCategory && matchesMuscleGroup && matchesPregnancy;
    });
  }, [exercises, searchTerm, selectedCategory, selectedMuscleGroup, showPregnancySafe, preferences.hiddenExercises, showHidden]);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsDetailModalOpen(true);
  };

  const handleAddToClass = (exercise: Exercise) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const uniqueId = `${exercise.id}-${timestamp}-${randomId}`;
    
    const exerciseToAdd = {
      ...exercise,
      id: uniqueId,
    };
    
    onAddExercise(exerciseToAdd);
    
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

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedExercise(exercise);
    setIsDetailModalOpen(true);
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
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 p-6">
      {/* Header and filters remain the same */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ExerciseCategory | 'all')}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="warm-up">Warm-up</option>
              <option value="footwork">Footwork</option>
              <option value="springs">Springs</option>
              <option value="hundred">Hundred</option>
              <option value="tower">Tower</option>
              <option value="cool-down">Cool-down</option>
            </select>

            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'all')}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Muscle Groups</option>
              <option value="core">Core</option>
              <option value="legs">Legs</option>
              <option value="arms">Arms</option>
              <option value="back">Back</option>
              <option value="glutes">Glutes</option>
              <option value="shoulders">Shoulders</option>
              <option value="full-body">Full Body</option>
            </select>

            <Button
              variant={showPregnancySafe ? "default" : "outline"}
              onClick={() => setShowPregnancySafe(!showPregnancySafe)}
              className="flex items-center gap-2"
            >
              <span className="text-xs">👶</span>
              Pregnancy Safe
            </Button>

            <Button
              variant={showHidden ? "default" : "outline"}
              onClick={() => setShowHidden(!showHidden)}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              {showHidden ? 'Show All' : 'Show Hidden'}
            </Button>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={handleExerciseClick}
              onAddToClass={handleAddToClass}
              onToggleFavorite={handleToggleFavorite}
              onToggleHidden={handleToggleHidden}
              onEdit={handleEditExercise}
              onDuplicate={handleDuplicateExercise}
              onDelete={handleDeleteExercise}
              onResetToOriginal={handleResetToOriginal}
              isFavorite={preferences.favoriteExercises?.includes(exercise.id) || false}
              isHidden={preferences.hiddenExercises?.includes(exercise.id) || false}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No exercises found</div>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Exercise Detail Modal */}
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedExercise(null);
          }}
          onAddToClass={handleAddToClass}
          onEdit={handleEditExerciseUpdate}
        />
      </div>
    </div>
  );
};

// Exercise Card Component
interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onAddToClass: (exercise: Exercise) => void;
  onToggleFavorite: (exerciseId: string, e: React.MouseEvent) => void;
  onToggleHidden: (exerciseId: string, e: React.MouseEvent) => void;
  onEdit: (exercise: Exercise, e: React.MouseEvent) => void;
  onDuplicate: (exercise: Exercise, e: React.MouseEvent) => void;
  onDelete: (exercise: Exercise, e: React.MouseEvent) => void;
  onResetToOriginal: (exercise: Exercise, e: React.MouseEvent) => void;
  isFavorite: boolean;
  isHidden: boolean;
}

const ExerciseCard = ({ 
  exercise, 
  onSelect, 
  onAddToClass, 
  onToggleFavorite,
  onToggleHidden,
  onEdit,
  onDuplicate,
  onDelete,
  onResetToOriginal,
  isFavorite,
  isHidden
}: ExerciseCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isCustom = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isCustomized = exercise.isCustomized || false;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    
    setIsAdding(true);
    onAddToClass(exercise);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${isHidden ? 'opacity-60' : ''}`}
      onClick={() => onSelect(exercise)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {exercise.image ? (
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
              <img 
                src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
                alt="Default exercise"
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          )}

          {/* Status indicators */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isHidden && (
              <Badge variant="secondary" className="text-xs bg-gray-500 text-white">
                Hidden
              </Badge>
            )}
            {isCustomized && isSystemExercise && (
              <Badge className="text-xs bg-orange-500 text-white">
                Modified
              </Badge>
            )}
            {isCustom && (
              <Badge className="text-xs bg-blue-500 text-white">
                Custom
              </Badge>
            )}
          </div>

          {/* Favorite heart */}
          <button
            onClick={(e) => onToggleFavorite(exercise.id, e)}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite 
                ? 'bg-white/90 text-red-500 scale-110' 
                : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Action buttons overlay */}
          {showActions && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                {/* Edit button */}
                <button
                  onClick={(e) => onEdit(exercise, e)}
                  className="w-8 h-8 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>

                {/* Duplicate button */}
                <button
                  onClick={(e) => onDuplicate(exercise, e)}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>

                {/* Hide/Show button */}
                <button
                  onClick={(e) => onToggleHidden(exercise.id, e)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isHidden 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                  title={isHidden ? "Show" : "Hide"}
                >
                  {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                {/* Reset button for modified system exercises */}
                {isCustomized && isSystemExercise && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors">
                        <RotateCcw className="h-4 w-4" />
                      </button>
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
                          onClick={(e) => onResetToOriginal(exercise, e)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Delete button for custom exercises */}
                {isCustom && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
                          onClick={(e) => onDelete(exercise, e)}
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
          )}
        </div>
        
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {exercise.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {exercise.duration}min • {exercise.category}
              </p>
            </div>
            
            <button
              onClick={handleAddClick}
              disabled={isAdding}
              className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                isAdding
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-110'
              }`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
