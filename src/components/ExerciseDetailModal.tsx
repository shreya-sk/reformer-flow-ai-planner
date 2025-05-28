
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Clock, Users, Target, AlertTriangle, Baby, Save, X, Plus, Trash2 } from 'lucide-react';
import { Exercise, MuscleGroup } from '@/types/reformer';
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
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);
  const [newProgression, setNewProgression] = useState('');
  const [newRegression, setNewRegression] = useState('');

  useEffect(() => {
    setEditedExercise(exercise);
  }, [exercise]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedExercise);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExercise(exercise);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const addProgression = () => {
    if (newProgression.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        progressions: [...(prev.progressions || []), newProgression.trim()]
      }));
      setNewProgression('');
    }
  };

  const removeProgression = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      progressions: prev.progressions?.filter((_, i) => i !== index) || []
    }));
  };

  const addRegression = () => {
    if (newRegression.trim()) {
      setEditedExercise(prev => ({
        ...prev,
        regressions: [...(prev.regressions || []), newRegression.trim()]
      }));
      setNewRegression('');
    }
  };

  const removeRegression = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      regressions: prev.regressions?.filter((_, i) => i !== index) || []
    }));
  };

  // Helper function to validate muscle groups
  const isValidMuscleGroup = (group: string): group is MuscleGroup => {
    const validGroups: MuscleGroup[] = [
      'core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body',
      'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs', 'obliques',
      'transverse-abdominis', 'traps', 'deltoids', 'biceps', 'triceps', 'lats',
      'chest', 'rhomboids', 'erector-spinae', 'hip-flexors', 'adductors', 'abductors',
      'pelvic-floor', 'deep-stabilizers', 'spinal-extensors', 'neck', 'forearms',
      'wrists', 'ankles', 'feet', 'hip-abductors', 'hip-adductors', 'rotator-cuff',
      'serratus-anterior', 'psoas', 'iliotibial-band', 'thoracic-spine', 'lumbar-spine',
      'cervical-spine', 'diaphragm', 'intercostals'
    ];
    return validGroups.includes(group as MuscleGroup);
  };

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-sage-800">
              Edit Exercise
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1 block">Exercise Name</label>
                <Input
                  value={editedExercise.name}
                  onChange={(e) => setEditedExercise(prev => ({ ...prev, name: e.target.value }))}
                  className="border-sage-300 focus:border-sage-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-sage-700 mb-1 block">Duration (minutes)</label>
                <Input
                  type="number"
                  value={editedExercise.duration}
                  onChange={(e) => setEditedExercise(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="border-sage-300 focus:border-sage-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1 block">Description</label>
              <Textarea
                value={editedExercise.description || ''}
                onChange={(e) => setEditedExercise(prev => ({ ...prev, description: e.target.value }))}
                className="border-sage-300 focus:border-sage-500"
                rows={3}
              />
            </div>

            {/* Muscle Groups */}
            <div>
              <label className="text-sm font-medium text-sage-700 mb-1 block">Target Muscles (comma separated)</label>
              <Input
                value={editedExercise.muscleGroups.join(', ')}
                onChange={(e) => {
                  const groups = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                  const validGroups = groups.filter(isValidMuscleGroup);
                  setEditedExercise(prev => ({ 
                    ...prev, 
                    muscleGroups: validGroups
                  }));
                }}
                className="border-sage-300 focus:border-sage-500"
                placeholder="core, glutes, legs"
              />
            </div>

            {/* Progressions */}
            <div>
              <label className="text-sm font-medium text-sage-700 mb-2 block">Progressions</label>
              <div className="space-y-2">
                {editedExercise.progressions?.map((progression, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={progression}
                      onChange={(e) => {
                        const newProgressions = [...(editedExercise.progressions || [])];
                        newProgressions[index] = e.target.value;
                        setEditedExercise(prev => ({ ...prev, progressions: newProgressions }));
                      }}
                      className="flex-1 border-sage-300 focus:border-sage-500"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeProgression(index)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newProgression}
                    onChange={(e) => setNewProgression(e.target.value)}
                    placeholder="Add new progression..."
                    className="flex-1 border-sage-300 focus:border-sage-500"
                    onKeyPress={(e) => e.key === 'Enter' && addProgression()}
                  />
                  <Button
                    size="sm"
                    onClick={addProgression}
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Regressions */}
            <div>
              <label className="text-sm font-medium text-sage-700 mb-2 block">Regressions</label>
              <div className="space-y-2">
                {editedExercise.regressions?.map((regression, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={regression}
                      onChange={(e) => {
                        const newRegressions = [...(editedExercise.regressions || [])];
                        newRegressions[index] = e.target.value;
                        setEditedExercise(prev => ({ ...prev, regressions: newRegressions }));
                      }}
                      className="flex-1 border-sage-300 focus:border-sage-500"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRegression(index)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newRegression}
                    onChange={(e) => setNewRegression(e.target.value)}
                    placeholder="Add new regression..."
                    className="flex-1 border-sage-300 focus:border-sage-500"
                    onKeyPress={(e) => e.key === 'Enter' && addRegression()}
                  />
                  <Button
                    size="sm"
                    onClick={addRegression}
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="bg-sage-600 hover:bg-sage-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-sage-300 text-sage-700">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
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
                      No Equipment
                    </span>
                  )}
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
                 {exercise.repsOrDuration || `${exercise.duration}min`}
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
                
                
                {exercise.muscleGroups.map(group => (
                  <span key={group} className="inline-block mr-1">
                    {group} 
                  </span>
                ))}
                    
                      
                      
               
              
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
                  Progressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exercise.progressions.map((cue, index) => (
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

            <Card className={`${
              preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm ${
                  preferences.darkMode ? 'text-white' : 'text-sage-800'
                }`}>
                  Regressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exercise.regressions.map((cue, index) => (
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
          </div>

          {/* Progressions & Contraindications */}
          {(exercise.progressions && exercise.progressions.length > 0) || 
           (exercise.regressions && exercise.regressions.length > 0) || 
           (exercise.contraindications && exercise.contraindications.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progressions & Regressions */}
              {((exercise.progressions && exercise.progressions.length > 0) || 
                (exercise.regressions && exercise.regressions.length > 0)) && (
                <Card className={`${
                  preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-600">
                      Modifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {exercise.progressions && exercise.progressions.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold text-green-600 mb-1">Progressions:</h5>
                        <ul className="space-y-1">
                          {exercise.progressions.map((progression, index) => (
                            <li key={index} className={`text-xs ${
                              preferences.darkMode ? 'text-gray-300' : 'text-green-700'
                            }`}>
                              ▲ {progression}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exercise.regressions && exercise.regressions.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold text-blue-600 mb-1">Regressions:</h5>
                        <ul className="space-y-1">
                          {exercise.regressions.map((regression, index) => (
                            <li key={index} className={`text-xs ${
                              preferences.darkMode ? 'text-gray-300' : 'text-blue-700'
                            }`}>
                              ▼ {regression}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
