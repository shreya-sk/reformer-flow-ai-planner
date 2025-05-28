
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X, Plus, Trash2, Clock, Dumbbell, Target, Shield } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { SpringVisual } from './SpringVisual';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (exercise: Exercise) => void;
}

const muscleGroups: MuscleGroup[] = ['core', 'arms', 'legs', 'back', 'chest', 'shoulders', 'glutes', 'calves'];

export const ExerciseDetailModal = ({ exercise, isOpen, onClose, onUpdate }: ExerciseDetailModalProps) => {
  const { preferences } = useUserPreferences();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Exercise>(exercise);

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(exercise);
    setIsEditing(false);
  };

  const addProgression = () => {
    setEditForm(prev => ({
      ...prev,
      progressions: [...(prev.progressions || []), '']
    }));
  };

  const updateProgression = (index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      progressions: prev.progressions?.map((p, i) => i === index ? value : p) || []
    }));
  };

  const removeProgression = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      progressions: prev.progressions?.filter((_, i) => i !== index) || []
    }));
  };

  const addRegression = () => {
    setEditForm(prev => ({
      ...prev,
      regressions: [...(prev.regressions || []), '']
    }));
  };

  const updateRegression = (index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      regressions: prev.regressions?.map((r, i) => i === index ? value : r) || []
    }));
  };

  const removeRegression = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      regressions: prev.regressions?.filter((_, i) => i !== index) || []
    }));
  };

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setEditForm(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(muscleGroup)
        ? prev.muscleGroups.filter(mg => mg !== muscleGroup)
        : [...prev.muscleGroups, muscleGroup]
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        preferences.darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'
      }`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            {isEditing ? 'Edit Exercise' : exercise.name}
          </DialogTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className="bg-sage-600 hover:bg-sage-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="bg-sage-600 hover:bg-sage-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Exercise Details */}
          <div className="space-y-4">
            {/* Basic Info */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Exercise Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Exercise Name</label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Duration (min)</label>
                        <Input
                          type="number"
                          value={editForm.duration}
                          onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Difficulty</label>
                        <Select
                          value={editForm.difficulty}
                          onValueChange={(value) => setEditForm(prev => ({ ...prev, difficulty: value as any }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-sage-600" />
                        <span>{exercise.duration} min</span>
                      </div>
                      <Badge variant="outline">{exercise.difficulty}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Springs:</span>
                        <SpringVisual springs={exercise.springs} />
                      </div>
                    </div>
                    {exercise.description && (
                      <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                        {exercise.description}
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Muscle Groups */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Target Muscles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {muscleGroups.map(group => (
                      <div key={group} className="flex items-center space-x-2">
                        <Checkbox
                          id={group}
                          checked={editForm.muscleGroups.includes(group)}
                          onCheckedChange={() => toggleMuscleGroup(group)}
                        />
                        <label htmlFor={group} className="text-sm font-medium capitalize">
                          {group}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscleGroups.map(group => (
                      <Badge key={group} variant="secondary" className="capitalize">
                        {group}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Progressions & Regressions */}
          <div className="space-y-4">
            {/* Progressions */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-green-600">Progressions</span>
                  {isEditing && (
                    <Button onClick={addProgression} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    {(editForm.progressions || []).map((progression, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={progression}
                          onChange={(e) => updateProgression(index, e.target.value)}
                          placeholder="Add progression..."
                        />
                        <Button
                          onClick={() => removeProgression(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(exercise.progressions || []).map((progression, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-500">▲</span>
                        <span>{progression}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Regressions */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-blue-600">Regressions</span>
                  {isEditing && (
                    <Button onClick={addRegression} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    {(editForm.regressions || []).map((regression, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={regression}
                          onChange={(e) => updateRegression(index, e.target.value)}
                          placeholder="Add regression..."
                        />
                        <Button
                          onClick={() => removeRegression(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(exercise.regressions || []).map((regression, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500">▼</span>
                        <span>{regression}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Safety Notes */}
            {exercise.contraindications && exercise.contraindications.length > 0 && (
              <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <Shield className="h-5 w-5" />
                    Safety Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {exercise.contraindications.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-amber-500">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
