import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, X, Plus, Trash2, Dumbbell, Target, Clock, Image as ImageIcon, Shield } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory, Equipment } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ImprovedExerciseFormProps {
  exercise?: Exercise | null;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const muscleGroups: MuscleGroup[] = ['core', 'arms', 'legs', 'back', 'chest', 'shoulders', 'glutes', 'calves'];

const categories: ExerciseCategory[] = ['supine', 'prone', 'standing', 'sitting', 'side-lying', 'kneeling'];

const springOptions = [
  { value: 'light', label: 'Light', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'heavy', label: 'Heavy', color: 'bg-red-500' },
  { value: 'mixed', label: 'Mixed', color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500' }
];

const equipmentOptions: Equipment[] = ['reformer', 'tower', 'chair', 'cadillac', 'mat', 'props', 'barrels'];

export const ImprovedExerciseForm = ({ exercise, onSave, onCancel }: ImprovedExerciseFormProps) => {
  const { preferences } = useUserPreferences();
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: exercise?.name || '',
    description: exercise?.description || '',
    category: exercise?.category || 'supine',
    difficulty: exercise?.difficulty || 'beginner',
    duration: exercise?.duration || 5,
    muscleGroups: exercise?.muscleGroups || [],
    equipment: exercise?.equipment || ['reformer'],
    springs: exercise?.springs || 'medium',
    isPregnancySafe: exercise?.isPregnancySafe || false,
    cues: exercise?.cues || [],
    progressions: exercise?.progressions || [],
    regressions: exercise?.regressions || [],
    contraindications: exercise?.contraindications || [],
    notes: exercise?.notes || '',
    image: exercise?.image || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Exercise name is required';
    if (!formData.muscleGroups?.length) newErrors.muscleGroups = 'At least one muscle group is required';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newExercise: Exercise = {
      id: exercise?.id || `exercise-${Date.now()}`,
      name: formData.name!,
      description: formData.description || '',
      category: formData.category!,
      difficulty: formData.difficulty!,
      intensityLevel: formData.difficulty === 'beginner' ? 'low' : formData.difficulty === 'intermediate' ? 'medium' : 'high',
      duration: formData.duration!,
      repsOrDuration: `${formData.duration} min`,
      muscleGroups: formData.muscleGroups!,
      equipment: formData.equipment!,
      springs: formData.springs!,
      isPregnancySafe: formData.isPregnancySafe!,
      cues: formData.cues!,
      progressions: formData.progressions,
      regressions: formData.regressions,
      contraindications: formData.contraindications,
      notes: formData.notes,
      image: formData.image
    };

    onSave(newExercise);
  };

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups?.includes(muscleGroup)
        ? prev.muscleGroups.filter(mg => mg !== muscleGroup)
        : [...(prev.muscleGroups || []), muscleGroup]
    }));
  };

  const toggleEquipment = (equipment: Equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.includes(equipment)
        ? prev.equipment.filter(eq => eq !== equipment)
        : [...(prev.equipment || []), equipment]
    }));
  };

  const addCue = () => {
    setFormData(prev => ({
      ...prev,
      cues: [...(prev.cues || []), '']
    }));
  };

  const updateCue = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      cues: prev.cues?.map((cue, i) => i === index ? value : cue) || []
    }));
  };

  const removeCue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cues: prev.cues?.filter((_, i) => i !== index) || []
    }));
  };

  const addProgression = () => {
    setFormData(prev => ({
      ...prev,
      progressions: [...(prev.progressions || []), '']
    }));
  };

  const updateProgression = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      progressions: prev.progressions?.map((p, i) => i === index ? value : p) || []
    }));
  };

  const removeProgression = (index: number) => {
    setFormData(prev => ({
      ...prev,
      progressions: prev.progressions?.filter((_, i) => i !== index) || []
    }));
  };

  const addRegression = () => {
    setFormData(prev => ({
      ...prev,
      regressions: [...(prev.regressions || []), '']
    }));
  };

  const updateRegression = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      regressions: prev.regressions?.map((r, i) => i === index ? value : r) || []
    }));
  };

  const removeRegression = (index: number) => {
    setFormData(prev => ({
      ...prev,
      regressions: prev.regressions?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className={`p-6 max-h-[80vh] overflow-y-auto ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          {exercise ? 'Edit Exercise' : 'Create New Exercise'}
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="bg-sage-600 hover:bg-sage-700">
            <Save className="h-4 w-4 mr-2" />
            Save Exercise
          </Button>
          <Button onClick={onCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          {/* Exercise Details */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-sage-600" />
                Exercise Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Exercise Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter exercise name..."
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the exercise..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ExerciseCategory }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration (minutes) *</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className={`mt-1 ${errors.duration ? 'border-red-500' : ''}`}
                    min="1"
                  />
                  {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
                </div>

                <div>
                  <label className="text-sm font-medium">Springs</label>
                  <Select
                    value={formData.springs}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, springs: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {springOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pregnancy-safe"
                  checked={formData.isPregnancySafe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnancySafe: !!checked }))}
                />
                <label htmlFor="pregnancy-safe" className="text-sm font-medium">
                  Pregnancy Safe
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Target Muscles */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-sage-600" />
                Target Muscles *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {muscleGroups.map(group => (
                  <div key={group} className="flex items-center space-x-2">
                    <Checkbox
                      id={group}
                      checked={formData.muscleGroups?.includes(group) || false}
                      onCheckedChange={() => toggleMuscleGroup(group)}
                    />
                    <label htmlFor={group} className="text-sm font-medium capitalize">
                      {group}
                    </label>
                  </div>
                ))}
              </div>
              {errors.muscleGroups && <span className="text-red-500 text-xs">{errors.muscleGroups}</span>}
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map(equipment => (
                  <Badge
                    key={equipment}
                    variant={formData.equipment?.includes(equipment) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleEquipment(equipment)}
                  >
                    {equipment}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Advanced Options */}
        <div className="space-y-4">
          {/* Teaching Cues */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Teaching Cues
                <Button onClick={addCue} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(formData.cues || []).map((cue, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cue}
                      onChange={(e) => updateCue(index, e.target.value)}
                      placeholder="Add teaching cue..."
                    />
                    <Button
                      onClick={() => removeCue(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progressions */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-green-600">
                Progressions
                <Button onClick={addProgression} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(formData.progressions || []).map((progression, index) => (
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
            </CardContent>
          </Card>

          {/* Regressions */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-600">
                Regressions
                <Button onClick={addRegression} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(formData.regressions || []).map((regression, index) => (
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
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
