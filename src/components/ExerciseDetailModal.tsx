
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Clock, Users, Target, AlertTriangle, Baby, Save, X, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Exercise, MuscleGroup } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedExercise: Exercise) => void;
}

export const ExerciseDetailModal = ({
  exercise,
  isOpen,
  onClose,
  onUpdate
}: ExerciseDetailModalProps) => {
  const { preferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);

  useEffect(() => {
    setEditedExercise(exercise);
  }, [exercise]);

  const handleSave = () => {
    onUpdate(editedExercise);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExercise(exercise);
    setIsEditing(false);
  };

  const addProgression = () => {
    setEditedExercise(prev => ({
      ...prev,
      progressions: [...(prev.progressions || []), '']
    }));
  };

  const updateProgression = (index: number, value: string) => {
    setEditedExercise(prev => ({
      ...prev,
      progressions: prev.progressions?.map((prog, i) => i === index ? value : prog) || []
    }));
  };

  const removeProgression = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      progressions: prev.progressions?.filter((_, i) => i !== index) || []
    }));
  };

  const addRegression = () => {
    setEditedExercise(prev => ({
      ...prev,
      regressions: [...(prev.regressions || []), '']
    }));
  };

  const updateRegression = (index: number, value: string) => {
    setEditedExercise(prev => ({
      ...prev,
      regressions: prev.regressions?.map((reg, i) => i === index ? value : reg) || []
    }));
  };

  const removeRegression = (index: number) => {
    setEditedExercise(prev => ({
      ...prev,
      regressions: prev.regressions?.filter((_, i) => i !== index) || []
    }));
  };

  // Helper function to validate muscle groups
  const isValidMuscleGroup = (value: string): value is MuscleGroup => {
    const validMuscleGroups: MuscleGroup[] = [
      'core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body',
      'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs', 'obliques',
      'transverse-abdominis', 'traps', 'deltoids', 'biceps', 'triceps', 'lats',
      'chest', 'rhomboids', 'erector-spinae', 'hip-flexors', 'adductors', 'abductors',
      'pelvic-floor', 'deep-stabilizers', 'spinal-extensors', 'neck', 'forearms',
      'wrists', 'ankles', 'feet', 'hip-abductors', 'hip-adductors', 'rotator-cuff',
      'serratus-anterior', 'psoas', 'iliotibial-band', 'thoracic-spine', 'lumbar-spine',
      'cervical-spine', 'diaphragm', 'intercostals'
    ];
    return validMuscleGroups.includes(value as MuscleGroup);
  };

  if (isEditing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Exercise
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
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
                    value={editedExercise.duration || ''}
                    onChange={(e) => setEditedExercise(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    className="border-sage-300 focus:border-sage-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-sage-700 mb-1 block">Target Muscles (comma separated)</label>
                  <Input
                    value={editedExercise.muscleGroups.join(', ')}
                    onChange={(e) => {
                      const muscleGroupStrings = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                      const validMuscleGroups = muscleGroupStrings.filter(isValidMuscleGroup);
                      setEditedExercise(prev => ({ 
                        ...prev, 
                        muscleGroups: validMuscleGroups
                      }));
                    }}
                    className="border-sage-300 focus:border-sage-500"
                    placeholder="core, glutes, legs"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-sage-700 mb-1 block">Teaching Cues</label>
                  <Textarea
                    value={editedExercise.cues?.join('\n') || ''}
                    onChange={(e) => setEditedExercise(prev => ({ 
                      ...prev, 
                      cues: e.target.value.split('\n').filter(cue => cue.trim()) 
                    }))}
                    className="border-sage-300 focus:border-sage-500 min-h-[100px]"
                    placeholder="Enter each cue on a new line"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {/* Progressions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-sage-700 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Progressions
                    </label>
                    <Button onClick={addProgression} size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {editedExercise.progressions?.map((progression, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={progression}
                          onChange={(e) => updateProgression(index, e.target.value)}
                          className="border-sage-300 focus:border-sage-500 text-sm"
                          placeholder="Add progression..."
                        />
                        <Button 
                          onClick={() => removeProgression(index)}
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regressions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-sage-700 flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-blue-600" />
                      Regressions
                    </label>
                    <Button onClick={addRegression} size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {editedExercise.regressions?.map((regression, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={regression}
                          onChange={(e) => updateRegression(index, e.target.value)}
                          className="border-sage-300 focus:border-sage-500 text-sm"
                          placeholder="Add regression..."
                        />
                        <Button 
                          onClick={() => removeRegression(index)}
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-sage-700 mb-1 block">Setup Instructions</label>
                  <Textarea
                    value={editedExercise.setup || ''}
                    onChange={(e) => setEditedExercise(prev => ({ ...prev, setup: e.target.value }))}
                    className="border-sage-300 focus:border-sage-500 min-h-[80px]"
                    placeholder="Setup instructions..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-sage-600 hover:bg-sage-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className={`${preferences.darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          {/* Header */}
          <div className={`p-6 border-b ${preferences.darkMode ? 'border-gray-700' : 'border-sage-100'}`}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className={`h-6 w-6 ${preferences.darkMode ? 'text-sage-400' : 'text-sage-600'}`} />
                  <div>
                    <DialogTitle className={`text-xl ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      {exercise.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {exercise.muscleGroups.slice(0, 3).map(group => (
                        <Badge key={group} variant="secondary" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
                        <span className="font-medium">{exercise.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Springs:</span>
                        <SpringVisual springs={exercise.springs} />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
                      <Badge className={`${exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : 
                                         exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}`}>
                        {exercise.difficulty}
                      </Badge>
                      {exercise.isPregnancySafe && (
                        <Badge className="bg-pink-100 text-pink-800 ml-2">
                          <Baby className="h-3 w-3 mr-1" />
                          Pregnancy Safe
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Teaching Cues */}
                {exercise.cues && exercise.cues.length > 0 && (
                  <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'}`}>
                    <CardContent className="p-4">
                      <h4 className={`font-medium mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Teaching Cues</h4>
                      <ul className="space-y-1">
                        {exercise.cues.map((cue, index) => (
                          <li key={index} className={`text-sm flex items-start gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                            <span className="text-sage-500 mt-1">•</span>
                            <span>{cue}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Progressions & Regressions */}
                {((exercise.progressions && exercise.progressions.length > 0) || 
                  (exercise.regressions && exercise.regressions.length > 0)) && (
                  <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'}`}>
                    <CardContent className="p-4 space-y-4">
                      {exercise.progressions && exercise.progressions.length > 0 && (
                        <div>
                          <h4 className={`font-medium mb-2 flex items-center gap-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            Progressions
                          </h4>
                          <ul className="space-y-1">
                            {exercise.progressions.map((progression, index) => (
                              <li key={index} className={`text-sm flex items-start gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                                <span className="text-green-500 mt-1">▲</span>
                                <span>{progression}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exercise.regressions && exercise.regressions.length > 0 && (
                        <div>
                          <h4 className={`font-medium mb-2 flex items-center gap-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                            <TrendingDown className="h-4 w-4 text-blue-600" />
                            Regressions
                          </h4>
                          <ul className="space-y-1">
                            {exercise.regressions.map((regression, index) => (
                              <li key={index} className={`text-sm flex items-start gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                                <span className="text-blue-500 mt-1">▼</span>
                                <span>{regression}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Exercise Image */}
                <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'}`}>
                  <CardContent className="p-0">
                    <div className="h-64 bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg overflow-hidden">
                      {exercise.image ? (
                        <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                            No image available
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Setup */}
                {exercise.setup && (
                  <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'}`}>
                    <CardContent className="p-4">
                      <h4 className={`font-medium mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Setup</h4>
                      <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>{exercise.setup}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Safety */}
                {exercise.contraindications && exercise.contraindications.length > 0 && (
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 text-amber-800 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Safety Notes
                      </h4>
                      <ul className="space-y-1">
                        {exercise.contraindications.map((item, index) => (
                          <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                            <span className="text-amber-500 mt-1">⚠</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
