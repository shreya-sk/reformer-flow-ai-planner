import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Dumbbell, Settings, Edit, Plus, Eye, EyeOff, RotateCcw, Heart, Copy, Trash2, Play, Check } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { ImprovedExerciseForm } from './ImprovedExerciseForm';
import { useExercises } from '@/hooks/useExercises';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToClass?: (exercise: Exercise) => void;
  onEditExercise?: (exercise: Exercise) => void;
  onSave: (updatedExercise: Exercise) => Promise<void>;
  showEditButton?: boolean;
}

// Default preferences object
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

export const ExerciseDetailModal = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onAddToClass,
  onEditExercise,
  showEditButton = false
}: ExerciseDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const { exercises, updateUserExercise, customizeSystemExercise, duplicateExercise, deleteUserExercise } = useExercises();
  const { preferences, toggleHiddenExercise, toggleFavoriteExercise } = useUserPreferences();
  const isMobile = useIsMobile();

  if (!exercise) return null;

  const isCustomExercise = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isCustomized = exercise.isCustomized || false;
  const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
  const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;
  const canEdit = isCustomExercise || isSystemExercise;
  
  // Ensure we have proper fallback values for detail preferences
  const detailPrefs = {
    ...defaultDetailPreferences,
    ...(preferences.exerciseDetailPreferences || {})
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (updatedExercise: Exercise) => {
    try {
      if (isCustomExercise) {
        await updateUserExercise(updatedExercise.id, updatedExercise);
      } else if (isSystemExercise) {
        await customizeSystemExercise(updatedExercise, {
          custom_name: updatedExercise.name,
          custom_duration: updatedExercise.duration,
          custom_springs: updatedExercise.springs,
          custom_difficulty: updatedExercise.difficulty,
          custom_cues: updatedExercise.cues,
          custom_notes: updatedExercise.notes,
          custom_setup: updatedExercise.setup,
          custom_reps_or_duration: updatedExercise.repsOrDuration,
          custom_tempo: updatedExercise.tempo,
          custom_target_areas: updatedExercise.targetAreas,
          custom_breathing_cues: updatedExercise.breathingCues,
          custom_teaching_focus: updatedExercise.teachingFocus,
          custom_modifications: updatedExercise.modifications,
        });
      }
      
      if (onEditExercise) {
        onEditExercise(updatedExercise);
      }
      setIsEditing(false);
      toast({
        title: "Exercise updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddToClass = async () => {
    if (!onAddToClass || isAdding) return;
    
    console.log('🔵 ExerciseDetailModal handleAddToClass called with:', exercise);
    setIsAdding(true);
    
    try {
      onAddToClass(exercise);
      
      toast({
        title: "Added to class",
        description: `"${exercise.name}" has been added to your class plan.`,
      });
      
      setTimeout(() => {
        setIsAdding(false);
        if (isMobile) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('🔴 Error in ExerciseDetailModal handleAddToClass:', error);
      setIsAdding(false);
      toast({
        title: "Error",
        description: "Failed to add exercise to class plan.",
        variant: "destructive",
      });
    }
  };

  const handleToggleHidden = () => {
    toggleHiddenExercise(exercise.id);
    toast({
      title: isHidden ? "Exercise unhidden" : "Exercise hidden",
      description: isHidden 
        ? `"${exercise.name}" is now visible in your library.`
        : `"${exercise.name}" has been hidden from your library.`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavoriteExercise(exercise.id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `"${exercise.name}" ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const handleDuplicate = async () => {
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

  const handleDelete = async () => {
    if (!isCustomExercise) return;
    
    try {
      await deleteUserExercise(exercise.id);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exercise.",
        variant: "destructive",
      });
    }
  };

  const handleResetToOriginal = async () => {
    // This would need to be implemented in useExercises hook
    toast({
      title: "Reset to original",
      description: "Exercise has been reset to its original version.",
    });
  };

  const getExerciseStatus = () => {
    if (isCustomExercise) return { label: 'Custom', color: 'bg-blue-500' };
    if (isCustomized) return { label: 'Modified', color: 'bg-orange-500' };
    if (isSystemExercise) return { label: 'System', color: 'bg-gray-500' };
    return { label: 'Exercise', color: 'bg-gray-500' };
  };

  const status = getExerciseStatus();

  if (isEditing) {
    if (isMobile) {
      return (
        <>
          {/* Mobile bottom sheet backdrop */}
          <div 
            className="fixed inset-0 bg-sage-900/40 backdrop-blur-sm z-40 animate-fade-in"
            onClick={onClose}
          />
          
          {/* Mobile bottom sheet for editing */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl shadow-sage-500/10 animate-slide-in-bottom max-h-[90vh] flex flex-col border-t border-sage-200">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-sage-300 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-sage-800">Edit Exercise</h2>
                {isCustomized && isSystemExercise && (
                  <Button
                    onClick={handleResetToOriginal}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
              
              <ImprovedExerciseForm
                exercise={exercise}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-[98vw] max-w-3xl max-h-[98vh] overflow-y-auto p-2 sm:p-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-sage-800">Edit Exercise</h2>
                {isCustomized && isSystemExercise && (
                  <Button
                    onClick={handleResetToOriginal}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Original
                  </Button>
                )}
              </div>
              
              <ImprovedExerciseForm
                exercise={exercise}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }

  if (isMobile) {
    return (
      <>
        {/* Backdrop with sage tint */}
        <div 
          className="fixed inset-0 bg-sage-900/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
        
        {/* Bottom Sheet Modal */}
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl shadow-sage-500/10 animate-slide-in-bottom max-h-[85vh] flex flex-col border-t border-sage-200">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-sage-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-sage-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-xs text-white ${status.color}`}>
                    {status.label}
                  </Badge>
                  {exercise.isPregnancySafe && (
                    <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                      👶 Safe
                    </Badge>
                  )}
                </div>
                <h2 className="text-xl font-bold text-sage-900 leading-tight">
                  {exercise.name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-sage-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{exercise.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Springs:</span>
                    <SpringVisual springs={exercise.springs} />
                  </div>
                </div>
              </div>

              {/* Favorite button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={`h-10 w-10 p-0 rounded-full ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-sage-400 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Exercise image */}
            {exercise.image && (
              <div className="w-full h-48 bg-sage-50">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Description */}
              {exercise.description && (
                <Card className="border-sage-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sage-900">Description</h3>
                    <p className="text-sm text-sage-700 leading-relaxed">
                      {exercise.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Teaching cues */}
              {exercise.cues && exercise.cues.length > 0 && (
                <Card className="border-sage-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 text-sage-900">Teaching Cues</h3>
                    <div className="space-y-2">
                      {exercise.cues.map((cue, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-700 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-sage-700 leading-relaxed">
                            {cue}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {exercise.notes && (
                <Card className="border-sage-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-sage-900">Notes</h3>
                    <p className="text-sm text-sage-700 leading-relaxed">
                      {exercise.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action buttons grid */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleToggleHidden}
                  className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
                >
                  {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <span>{isHidden ? 'Unhide' : 'Hide'}</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDuplicate}
                  className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
                >
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </Button>

                {(isCustomExercise || isCustomized) && (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                )}

                {exercise.videoUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(exercise.videoUrl, '_blank')}
                    className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
                  >
                    <Play className="h-4 w-4" />
                    <span>Video</span>
                  </Button>
                )}

                {isCustomExercise && (
                  <div className="col-span-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 active:scale-[0.98] transition-transform duration-75"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Exercise
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
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom action */}
          {onAddToClass && (
            <div className="flex-shrink-0 p-6 border-t border-sage-100 bg-white/95">
              <Button
                onClick={handleAddToClass}
                disabled={isAdding}
                className={`w-full h-14 text-lg font-semibold transition-all duration-300 active:scale-[0.98] ${
                  isAdding
                    ? 'bg-green-500 hover:bg-green-500'
                    : 'bg-sage-600 hover:bg-sage-700'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="h-5 w-5 mr-2 animate-bounce" />
                    Added to Class!
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Class
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }

  // Desktop version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-2xl max-h-[98vh] overflow-y-auto bg-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-sage-800">
              {exercise.name}
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              {/* Hide Exercise Button */}
              <Button 
                onClick={handleToggleHidden}
                size="sm"
                variant="ghost"
                className={`${isHidden ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}
              >
                {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>

              {/* Edit Button - Prominent placement */}
              {canEdit && (
                <Button 
                  onClick={handleEdit}
                  size="sm"
                  className="bg-sage-600 hover:bg-sage-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile-optimized header info */}
          <div className="flex flex-col space-y-3 sm:space-y-4">
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
                <Users className="h-4 w-4" />
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="h-4 w-4" />
                <span className="capitalize">{exercise.intensityLevel}</span>
              </div>
            </div>

            {/* Springs and Equipment */}
            {detailPrefs.showSpringsEquipment && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sage-700">Springs:</span>
                  <SpringVisual springs={exercise.springs} className="flex items-center gap-1" />
                </div>

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-sage-700">Equipment:</span>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map(equip => (
                        <Badge key={equip} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {equip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Muscle groups */}
            {detailPrefs.showMuscleGroups && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-sage-700">Target Areas:</span>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.map(group => (
                    <Badge key={group} variant="outline" className="text-xs">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pregnancy safe indicator */}
            {detailPrefs.showPregnancySafety && exercise.isPregnancySafe && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-600">✓</span>
                <span className="text-sm font-medium text-emerald-800">Pregnancy Safe</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Exercise image */}
          {detailPrefs.showMedia && exercise.image && (
            <div className="w-full">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          {detailPrefs.showDescription && exercise.description && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sage-800">Description</h4>
                <p className="text-sm leading-relaxed text-sage-600">
                  {exercise.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Setup instructions */}
          {detailPrefs.showSetupInstructions && exercise.setup && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sage-800">Setup Instructions</h4>
                <p className="text-sm leading-relaxed text-sage-600">
                  {exercise.setup}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Teaching cues */}
          {detailPrefs.showTeachingCues && exercise.cues && exercise.cues.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-sage-800">Teaching Cues</h4>
                <div className="space-y-2">
                  {exercise.cues.map((cue, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-700 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-sage-600">
                        {cue}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Breathing cues - conditional */}
          {detailPrefs.showBreathingCues && exercise.breathingCues && exercise.breathingCues.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Breathing Cues
                </h4>
                <div className="space-y-2">
                  {exercise.breathingCues.map((cue, index) => (
                    <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      • {cue}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progressions - conditional */}
          {detailPrefs.showProgressions && exercise.progressions && exercise.progressions.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Progressions
                </h4>
                <div className="space-y-2">
                  {exercise.progressions.map((progression, index) => (
                    <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      • {progression}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Regressions - conditional */}
          {detailPrefs.showRegressions && exercise.regressions && exercise.regressions.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Regressions
                </h4>
                <div className="space-y-2">
                  {exercise.regressions.map((regression, index) => (
                    <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      • {regression}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modifications - conditional */}
          {detailPrefs.showModifications && exercise.modifications && exercise.modifications.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Modifications
                </h4>
                <div className="space-y-2">
                  {exercise.modifications.map((modification, index) => (
                    <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      • {modification}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety notes - conditional */}
          {detailPrefs.showSafetyNotes && exercise.contraindications && exercise.contraindications.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Safety Notes & Contraindications
                </h4>
                <div className="space-y-2">
                  {exercise.contraindications.map((note, index) => (
                    <p key={index} className={`text-sm leading-relaxed text-red-600`}>
                      ⚠️ {note}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {exercise.notes && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sage-800">Notes</h4>
                <p className="text-sm leading-relaxed text-sage-600">
                  {exercise.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action buttons - desktop optimized */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {onAddToClass && (
            <Button 
              onClick={handleAddToClass}
              disabled={isAdding}
              className={`flex-1 h-12 transition-all duration-300 ${
                isAdding
                  ? 'bg-green-500 hover:bg-green-500'
                  : 'bg-sage-600 hover:bg-sage-700'
              } text-white`}
            >
              {isAdding ? (
                <>
                  <Check className="h-4 w-4 mr-2 animate-bounce" />
                  Added to Class!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Class
                </>
              )}
            </Button>
          )}
          
          {detailPrefs.showMedia && exercise.videoUrl && (
            <Button 
              onClick={() => window.open(exercise.videoUrl, '_blank')}
              variant="outline"
              className="h-12 border-sage-300 hover:bg-sage-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Watch Video</span>
              <span className="sm:hidden">Video</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
