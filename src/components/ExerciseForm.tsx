import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment } from '@/types/reformer';

interface ExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export const ExerciseForm = ({ exercise, onSave, onCancel }: ExerciseFormProps) => {
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    category: exercise?.category || 'supine' as ExerciseCategory,
    duration: exercise?.duration || 3,
    springs: exercise?.springs || 'medium' as SpringSetting,
    difficulty: exercise?.difficulty || 'beginner' as DifficultyLevel,
    muscleGroups: exercise?.muscleGroups || [] as MuscleGroup[],
    equipment: exercise?.equipment || [] as Equipment[],
    description: exercise?.description || '',
    image: exercise?.image || '',
    videoUrl: exercise?.videoUrl || '',
    notes: exercise?.notes || '',
    cues: exercise?.cues || [] as string[],
  });

  const [newCue, setNewCue] = useState('');

  const muscleGroupOptions: MuscleGroup[] = ['core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body'];
  const equipmentOptions: Equipment[] = ['straps', 'weights', 'magic-circle', 'theraband', 'none'];

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...prev.muscleGroups, group]
    }));
  };

  const toggleEquipment = (equip: Equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equip)
        ? prev.equipment.filter(e => e !== equip)
        : [...prev.equipment, equip]
    }));
  };

  const addCue = () => {
    if (newCue.trim()) {
      setFormData(prev => ({
        ...prev,
        cues: [...prev.cues, newCue.trim()]
      }));
      setNewCue('');
    }
  };

  const removeCue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cues: prev.cues.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.muscleGroups.length === 0) return;

    const newExercise: Exercise = {
      id: exercise?.id || `custom-${Date.now()}`,
      ...formData,
    };

    onSave(newExercise);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {exercise ? 'Edit Exercise' : 'Add New Exercise'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter exercise name"
              required
            />
          </div>

          {/* Image and Video URL fields */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="image">Reference Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="videoUrl">Video Reference URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="category">Position</Label>
              <Select value={formData.category} onValueChange={(value: ExerciseCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supine">Supine</SelectItem>
                  <SelectItem value="prone">Prone</SelectItem>
                  <SelectItem value="sitting">Sitting</SelectItem>
                  <SelectItem value="side-lying">Side-lying</SelectItem>
                  <SelectItem value="kneeling">Kneeling</SelectItem>
                  <SelectItem value="standing">Standing</SelectItem>
                  <SelectItem value="warm-up">Warm-up</SelectItem>
                  <SelectItem value="cool-down">Cool-down</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="15"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="springs">Spring Setting</Label>
              <Select value={formData.springs} onValueChange={(value: SpringSetting) => setFormData(prev => ({ ...prev, springs: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value: DifficultyLevel) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
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

          <div>
            <Label>Muscle Groups *</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {muscleGroupOptions.map(group => (
                <Button
                  key={group}
                  type="button"
                  variant={formData.muscleGroups.includes(group) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMuscleGroup(group)}
                  className="text-xs h-7"
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Equipment</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {equipmentOptions.map(equip => (
                <Button
                  key={equip}
                  type="button"
                  variant={formData.equipment.includes(equip) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEquipment(equip)}
                  className="text-xs h-7"
                >
                  {equip}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Exercise description..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Exercise notes..."
              rows={2}
            />
          </div>

          <div>
            <Label>Teaching Cues</Label>
            <div className="space-y-2 mt-2">
              {formData.cues.map((cue, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cue}
                    onChange={(e) => {
                      const newCues = [...formData.cues];
                      newCues[index] = e.target.value;
                      setFormData(prev => ({ ...prev, cues: newCues }));
                    }}
                    placeholder="Teaching cue..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCue(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Input
                  value={newCue}
                  onChange={(e) => setNewCue(e.target.value)}
                  placeholder="Add a teaching cue..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCue())}
                />
                <Button type="button" onClick={addCue} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {exercise ? 'Update' : 'Add'} Exercise
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
