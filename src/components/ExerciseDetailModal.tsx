
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Clock, Users, Target, AlertTriangle, Baby, Save, X } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ExerciseForm } from './ExerciseForm';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal = ({ exercise, isOpen, onClose, onUpdate }: ExerciseDetailModalProps) => {
  const { preferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedExercise: Exercise) => {
    if (onUpdate) {
      onUpdate(updatedExercise);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <ExerciseForm
            exercise={exercise}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${
        preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'
      }`}>
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-2">
            <DialogTitle className={`text-xl font-semibold ${
              preferences.darkMode ? 'text-white' : 'text-sage-800'
            }`}>
              {exercise.name}
            </DialogTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {exercise.repsOrDuration || `${exercise.duration}min`}
              </Badge>
              <Badge className={`text-xs ${
                exercise.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-800' 
                  : exercise.difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {exercise.difficulty}
              </Badge>
              <Badge className={`text-xs ${
                preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'
              }`}>
                {exercise.category}
              </Badge>
              {exercise.isPregnancySafe && (
                <Badge className="text-xs bg-pink-100 text-pink-700">
                  <Baby className="h-3 w-3 mr-1" />
                  Pregnancy Safe
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exercise Image */}
          {exercise.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Clock className={`h-8 w-8 mx-auto mb-2 ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-500'
              }`} />
              <div className={`text-sm font-medium ${
                preferences.darkMode ? 'text-white' : 'text-sage-800'
              }`}>
                Duration
              </div>
              <div className={`text-xs ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-600'
              }`}>
                {exercise.duration} min
              </div>
            </div>
            
            <div className="text-center">
              <div className="h-8 flex items-center justify-center mb-2">
                <SpringVisual springs={exercise.springs} />
              </div>
              <div className={`text-sm font-medium ${
                preferences.darkMode ? 'text-white' : 'text-sage-800'
              }`}>
                Springs
              </div>
              <div className={`text-xs ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-600'
              }`}>
                {exercise.springs}
              </div>
            </div>

            <div className="text-center">
              <Target className={`h-8 w-8 mx-auto mb-2 ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-500'
              }`} />
              <div className={`text-sm font-medium ${
                preferences.darkMode ? 'text-white' : 'text-sage-800'
              }`}>
                Intensity
              </div>
              <div className={`text-xs ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-600'
              }`}>
                {exercise.intensityLevel}
              </div>
            </div>

            <div className="text-center">
              <Users className={`h-8 w-8 mx-auto mb-2 ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-500'
              }`} />
              <div className={`text-sm font-medium ${
                preferences.darkMode ? 'text-white' : 'text-sage-800'
              }`}>
                Target
              </div>
              <div className={`text-xs ${
                preferences.darkMode ? 'text-gray-400' : 'text-sage-600'
              }`}>
                {exercise.muscleGroups[0]}
              </div>
            </div>
          </div>

          {/* Description */}
          {exercise.description && (
            <Card className={`${
              preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${
                  preferences.darkMode ? 'text-white' : 'text-sage-800'
                }`}>
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${
                  preferences.darkMode ? 'text-gray-300' : 'text-sage-700'
                }`}>
                  {exercise.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Teaching Cues */}
          {exercise.cues && exercise.cues.length > 0 && (
            <Card className={`${
              preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${
                  preferences.darkMode ? 'text-white' : 'text-sage-800'
                }`}>
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exercise.cues.map((cue, index) => (
                    <li key={index} className={`text-sm flex items-start gap-2 ${
                      preferences.darkMode ? 'text-gray-300' : 'text-sage-700'
                    }`}>
                      <span className="text-sage-500 font-bold text-xs mt-1">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Muscle Groups & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={`${
              preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${
                  preferences.darkMode ? 'text-white' : 'text-sage-800'
                }`}>
                  Target Muscles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscleGroups.map(group => (
                    <Badge 
                      key={group} 
                      variant="secondary" 
                      className={`text-xs ${
                        preferences.darkMode 
                          ? 'bg-gray-600 text-gray-300' 
                          : 'bg-sage-100 text-sage-700'
                      }`}
                    >
                      {group}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`${
              preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${
                  preferences.darkMode ? 'text-white' : 'text-sage-800'
                }`}>
                  Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exercise.equipment && exercise.equipment.length > 0 ? (
                    exercise.equipment.map(equip => (
                      <Badge 
                        key={equip} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {equip}
                      </Badge>
                    ))
                  ) : (
                    <span className={`text-xs ${
                      preferences.darkMode ? 'text-gray-400' : 'text-sage-500'
                    }`}>
                      No additional equipment
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progressions & Contraindications */}
          {(exercise.progressions && exercise.progressions.length > 0) || 
           (exercise.contraindications && exercise.contraindications.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercise.progressions && exercise.progressions.length > 0 && (
                <Card className={`${
                  preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-600">
                      Progressions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {exercise.progressions.map((progression, index) => (
                        <li key={index} className={`text-xs ${
                          preferences.darkMode ? 'text-gray-300' : 'text-green-700'
                        }`}>
                          • {progression}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {exercise.contraindications && exercise.contraindications.length > 0 && (
                <Card className={`${
                  preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-amber-50 border-amber-200'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Contraindications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {exercise.contraindications.map((item, index) => (
                        <li key={index} className={`text-xs ${
                          preferences.darkMode ? 'text-gray-300' : 'text-amber-700'
                        }`}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
