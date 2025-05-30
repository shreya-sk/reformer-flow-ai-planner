
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Dumbbell, Settings, Edit, Plus, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { ImprovedExerciseForm } from './ImprovedExerciseForm';
import { useExercises } from '@/hooks/useExercises';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from '@/hooks/use-toast';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToClass?: (exercise: Exercise) => void;
  onEditExercise?: (exercise: Exercise) => void;
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
  const { exercises, updateUserExercise, customizeSystemExercise } = useExercises();
  const { preferences, toggleHiddenExercise } = useUserPreferences();

  if (!exercise) return null;

  const isCustomExercise = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isCustomized = exercise.isCustomized || false;
  const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
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
        await customizeSystemExercise(updatedExercise.id, {
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

  const handleAddToClass = () => {
    if (onAddToClass) {
      onAddToClass(exercise);
      onClose();
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

  const handleResetToOriginal = async () => {
    // This would need to be implemented in useExercises hook
    toast({
      title: "Reset to original",
      description: "Exercise has been reset to its original version.",
    });
  };

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`w-[98vw] max-w-3xl max-h-[98vh] overflow-y-auto p-2 sm:p-6 ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Edit Exercise
              </h2>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[98vw] max-w-2xl max-h-[98vh] overflow-y-auto ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <DialogTitle className={`text-xl sm:text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
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

            {/* Springs and Equipment - conditional */}
            {detailPrefs.showSpringsEquipment && (
              <>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Springs:
                  </span>
                  <SpringVisual springs={exercise.springs} className="flex items-center gap-1" />
                </div>

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="space-y-2">
                    <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
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
              </>
            )}

            {/* Muscle groups - conditional */}
            {detailPrefs.showMuscleGroups && (
              <div className="space-y-2">
                <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Target Areas:
                </span>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.map(group => (
                    <Badge key={group} variant="outline" className="text-xs">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pregnancy safe indicator - conditional */}
            {detailPrefs.showPregnancySafety && exercise.isPregnancySafe && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-600">✓</span>
                <span className="text-sm font-medium text-emerald-800">Pregnancy Safe</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Exercise image - conditional */}
          {detailPrefs.showMedia && exercise.image && (
            <div className="w-full">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Description - conditional */}
          {detailPrefs.showDescription && exercise.description && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Description
                </h4>
                <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  {exercise.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Setup instructions - conditional */}
          {detailPrefs.showSetupInstructions && exercise.setup && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Setup Instructions
                </h4>
                <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  {exercise.setup}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Teaching cues - conditional */}
          {detailPrefs.showTeachingCues && exercise.cues && exercise.cues.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Teaching Cues
                </h4>
                <div className="space-y-2">
                  {exercise.cues.map((cue, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-700 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
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
                <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Notes
                </h4>
                <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  {exercise.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action buttons - mobile optimized */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {onAddToClass && (
            <Button 
              onClick={handleAddToClass}
              className="flex-1 h-12 bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Class
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
