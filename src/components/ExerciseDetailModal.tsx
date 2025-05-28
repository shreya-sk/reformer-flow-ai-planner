
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
import { Edit, Save, X, Plus, Trash2, Clock, Dumbbell, Target, Shield, Image as ImageIcon } from 'lucide-react';
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
      <DialogContent className={`max-w-5xl max-h-[85vh] overflow-y-auto ${
        preferences.darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'
      }`}>
        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <DialogTitle className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            {isEditing ? 'Edit Exercise' : exercise.name}
          </DialogTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className="bg-sage-600 hover:bg-sage-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="bg-sage-600 hover:bg-sage-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Basic Info & Image */}
          <div className="space-y-3">
            {/* Exercise Image */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              {exercise.image ? (
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/60 text-white text-xs">
                      Reference
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-sage-600/10 flex flex-col items-center justify-center border-2 border-dashed border-sage-400/30 rounded-lg m-2">
                  <ImageIcon className="h-8 w-8 mb-1 text-sage-400" />
                  <span className="text-xs text-sage-400">No image</span>
                </div>
              )}
            </Card>

            {/* Basic Info */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  Exercise Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-xs font-medium">Exercise Name</label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Description</label>
                      <Textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium">Duration</label>
                        <Input
                          type="number"
                          value={editForm.duration}
                          onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Difficulty</label>
                        <Select
                          value={editForm.difficulty}
                          onValueChange={(value) => setEditForm(prev => ({ ...prev, difficulty: value as any }))}
                        >
                          <SelectTrigger className="mt-1 text-sm">
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
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sage-600" />
                        <span>{exercise.duration}min</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Springs:</span>
                      <SpringVisual springs={exercise.springs} />
                    </div>
                    {exercise.description && (
                      <p className={`text-xs ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                        {exercise.description}
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Muscle Groups */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Target Muscles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-1">
                    {muscleGroups.map(group => (
                      <div key={group} className="flex items-center space-x-1">
                        <Checkbox
                          id={group}
                          checked={editForm.muscleGroups.includes(group)}
                          onCheckedChange={() => toggleMuscleGroup(group)}
                        />
                        <label htmlFor={group} className="text-xs font-medium capitalize">
                          {group}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.map(group => (
                      <Badge key={group} variant="secondary" className="capitalize text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Progressions & Regressions */}
          <div className="space-y-3">
            {/* Progressions */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="text-green-600">Progressions</span>
                  {isEditing && (
                    <Button onClick={addProgression} size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-1">
                    {(editForm.progressions || []).map((progression, index) => (
                      <div key={index} className="flex gap-1">
                        <Input
                          value={progression}
                          onChange={(e) => updateProgression(index, e.target.value)}
                          placeholder="Add progression..."
                          className="text-xs"
                        />
                        <Button
                          onClick={() => removeProgression(index)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(exercise.progressions || []).map((progression, index) => (
                      <li key={index} className="text-xs flex items-start gap-2">
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="text-blue-600">Regressions</span>
                  {isEditing && (
                    <Button onClick={addRegression} size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-1">
                    {(editForm.regressions || []).map((regression, index) => (
                      <div key={index} className="flex gap-1">
                        <Input
                          value={regression}
                          onChange={(e) => updateRegression(index, e.target.value)}
                          placeholder="Add regression..."
                          className="text-xs"
                        />
                        <Button
                          onClick={() => removeRegression(index)}
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(exercise.regressions || []).map((regression, index) => (
                      <li key={index} className="text-xs flex items-start gap-2">
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                    <Shield className="h-4 w-4" />
                    Safety Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {exercise.contraindications.map((item, index) => (
                      <li key={index} className="text-xs flex items-start gap-2">
                        <span className="text-amber-500">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Teaching Cues */}
          <div className="space-y-3">
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Teaching Cues</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {(exercise.cues || []).map((cue, index) => (
                    <li key={index} className="text-xs flex items-start gap-2">
                      <span className="text-sage-400">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exercise.equipment.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
