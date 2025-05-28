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
import { Edit, Save, X, Plus, Trash2, Clock, Dumbbell, Target, Shield, Image as ImageIcon, Heart } from 'lucide-react';
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

  const getSpringColor = () => {
    switch (exercise.springs) {
      case 'light': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'heavy': return 'bg-red-500';
      case 'mixed': return 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-3xl max-h-[85vh] overflow-y-auto p-0 ${
        preferences.darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'
      }`}>
        {/* Main header */}
        <div className="sticky top-0 z-10 p-4 bg-white border-b flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-sage-800">{exercise.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize text-xs">{exercise.category}</Badge>
              <Badge variant="outline" className="capitalize text-xs">{exercise.difficulty}</Badge>
              {exercise.isPregnancySafe && (
                <Badge className="bg-pink-100 text-pink-800 border border-pink-300 text-xs">
                  <Heart className="h-3 w-3 mr-1 text-pink-600" />
                  Pregnancy Safe
                </Badge>
              )}
            </div>
          </div>
          
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
        </div>

        {/* Exercise image */}
        <div className="relative h-52 overflow-hidden">
          {exercise.image ? (
            <img 
              src={exercise.image} 
              alt={exercise.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="h-full bg-sage-50 flex flex-col items-center justify-center border-b border-sage-200">
              <ImageIcon className="h-12 w-12 text-sage-400 mb-2" />
              <span className="text-sage-500">No image available</span>
            </div>
          )}
        </div>

        {/* Exercise stats row */}
        <div className="grid grid-cols-4 border-b">
          <div className="flex flex-col items-center p-3 border-r">
            <Clock className="h-5 w-5 mb-1 text-sage-500" />
            <div className="text-center">
              <div className="font-bold text-sm">{exercise.duration} min</div>
              <div className="text-xs text-sage-500">Duration</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 border-r">
            <div className="mb-1">
              <div className={`w-5 h-5 rounded-full ${getSpringColor()} mx-auto`}></div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm capitalize">{exercise.springs}</div>
              <div className="text-xs text-sage-500">Springs</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 border-r">
            <Target className="h-5 w-5 mb-1 text-sage-500" />
            <div className="text-center">
              <div className="font-bold text-sm capitalize">
                {exercise.muscleGroups[0] || 'Various'}
              </div>
              <div className="text-xs text-sage-500">Target</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3">
            <Dumbbell className="h-5 w-5 mb-1 text-sage-500" />
            <div className="text-center">
              <div className="font-bold text-sm capitalize">{exercise.intensityLevel}</div>
              <div className="text-xs text-sage-500">Intensity</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Description */}
          {exercise.description && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-sage-700 mb-1">Description</h3>
              <p className="text-sm text-sage-600">{exercise.description}</p>
            </div>
          )}

          {/* Target Muscles */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-sage-700 mb-1">Target Muscles</h3>
            <div className="flex flex-wrap gap-1">
              {exercise.muscleGroups.map(group => (
                <Badge key={group} variant="outline" className="capitalize text-xs">
                  {group}
                </Badge>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Teaching Cues */}
            <div>
              <h3 className="text-sm font-semibold text-sage-700 mb-1">Teaching Cues</h3>
              <ul className="text-sm space-y-1">
                {(exercise.cues || []).map((cue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-sage-400 mt-1">•</span>
                    <span className="text-sage-600">{cue}</span>
                  </li>
                ))}
                {(!exercise.cues || exercise.cues.length === 0) && (
                  <li className="text-sage-400 italic">No teaching cues added</li>
                )}
              </ul>
            </div>

            {/* Modifications */}
            <div>
              <h3 className="text-sm font-semibold text-sage-700 mb-1">Modifications</h3>
              
              {(exercise.progressions && exercise.progressions.length > 0) ? (
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-green-600">Progressions</h4>
                  <ul className="text-sm">
                    {exercise.progressions.map((item, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 text-xs mt-1">▲</span>
                        <span className="text-sage-600 text-xs">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              
              {(exercise.regressions && exercise.regressions.length > 0) ? (
                <div>
                  <h4 className="text-xs font-medium text-blue-600">Regressions</h4>
                  <ul className="text-sm">
                    {exercise.regressions.map((item, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-500 text-xs mt-1">▼</span>
                        <span className="text-sage-600 text-xs">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(!exercise.progressions?.length && !exercise.regressions?.length) && (
                <p className="text-sage-400 italic text-sm">No modifications added</p>
              )}
            </div>
          </div>

          {/* Safety Notes */}
          {exercise.contraindications && exercise.contraindications.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-amber-600 flex items-center gap-1 mb-1">
                <Shield className="h-4 w-4" />
                Safety Notes
              </h3>
              <ul className="text-sm">
                {exercise.contraindications.map((item, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-amber-500 text-xs mt-1">⚠️</span>
                    <span className="text-sage-600 text-xs">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Editing form would be here when isEditing is true */}
        {isEditing && (
          <div className="p-4 border-t">
            {/* We're keeping the edit form simple for now since you want to focus on the viewing experience */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Exercise Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Other form fields would be here */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
