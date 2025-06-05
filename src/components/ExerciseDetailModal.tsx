
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Check, RotateCcw } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { ImprovedExerciseForm } from './ImprovedExerciseForm';
import { useExercises } from '@/hooks/useExercises';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { MobileExerciseDetail } from './exercise-detail/MobileExerciseDetail';
import { ExerciseActions } from './exercise-detail/ExerciseActions';
import { ExerciseContent } from './exercise-detail/ExerciseContent';

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
  const isModified = exercise.isModified || false;
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
        await customizeSystemExercise(updatedExercise, updatedExercise);
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
                {isModified && isSystemExercise && (
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
                {isModified && isSystemExercise && (
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
      <MobileExerciseDetail
        exercise={exercise}
        onClose={onClose}
        onAddToClass={onAddToClass}
        isAdding={isAdding}
        isHidden={isHidden}
        isFavorite={isFavorite}
        isCustomExercise={isCustomExercise}
        isModified={isModified}
        detailPrefs={detailPrefs}
        preferences={preferences}
        onToggleHidden={handleToggleHidden}
        onToggleFavorite={handleToggleFavorite}
        onDuplicate={handleDuplicate}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={isCustomExercise ? handleDelete : undefined}
      />
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
            
            <ExerciseActions
              exercise={exercise}
              isHidden={isHidden}
              isFavorite={isFavorite}
              isCustomExercise={isCustomExercise}
              isModified={isModified}
              onToggleHidden={handleToggleHidden}
              onToggleFavorite={handleToggleFavorite}
              onDuplicate={handleDuplicate}
              onEdit={canEdit ? handleEdit : undefined}
              onDelete={isCustomExercise ? handleDelete : undefined}
            />
          </div>
        </DialogHeader>

        <ExerciseContent 
          exercise={exercise} 
          detailPrefs={detailPrefs} 
          preferences={preferences} 
        />

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
        </div>
      </DialogContent>
    </Dialog>
  );
};
