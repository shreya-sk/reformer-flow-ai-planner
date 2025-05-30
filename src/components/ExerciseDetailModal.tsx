
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Dumbbell, Settings, Edit, Plus, Eye } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { ImprovedExerciseForm } from './ImprovedExerciseForm';
import { useCustomExercises } from '@/hooks/useCustomExercises';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToClass?: (exercise: Exercise) => void;
  onEditExercise?: (exercise: Exercise) => void;
  showEditButton?: boolean;
}

export const ExerciseDetailModal = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onAddToClass,
  onEditExercise,
  showEditButton = false
}: ExerciseDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateCustomExercise, isCustomExercise } = useCustomExercises();
  const { preferences } = useUserPreferences();

  if (!exercise) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (updatedExercise: Exercise) => {
    updateCustomExercise(updatedExercise);
    if (onEditExercise) {
      onEditExercise(updatedExercise);
    }
    setIsEditing(false);
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

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`w-[98vw] max-w-3xl max-h-[98vh] overflow-y-auto p-2 sm:p-6 ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ImprovedExerciseForm
            exercise={exercise}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[98vw] max-w-2xl max-h-[98vh] overflow-y-auto ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <DialogHeader className="space-y-4">
          <DialogTitle className={`text-xl sm:text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            {exercise.name}
          </DialogTitle>
          
          {/* Mobile-optimized header info */}
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {/* Basic info - stack on mobile */}
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

            {/* Springs visualization */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                Springs:
              </span>
              <SpringVisual setting={exercise.springs} size="sm" />
            </div>

            {/* Muscle groups - wrap on mobile */}
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

            {/* Equipment - wrap on mobile */}
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

            {/* Pregnancy safe indicator */}
            {exercise.isPregnancySafe && (
              <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg border border-pink-200">
                <span className="text-pink-600">👶✓</span>
                <span className="text-sm font-medium text-pink-800">Pregnancy Safe</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Exercise image - responsive */}
          {exercise.image && (
            <div className="w-full">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          {exercise.description && (
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

          {/* Teaching cues - mobile optimized */}
          {exercise.cues && exercise.cues.length > 0 && (
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
          
          {showEditButton && isCustomExercise(exercise.id) && (
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="h-12 border-sage-300 hover:bg-sage-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Edit Exercise</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          )}
          
          {exercise.videoUrl && (
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
