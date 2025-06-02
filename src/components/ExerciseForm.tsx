import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment, PrimaryMuscle, ExercisePosition } from '@/types/reformer';

interface ExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => Promise<void>;
  onCancel: () => void;
}

export const ExerciseForm = ({ exercise, onSave, onCancel }: ExerciseFormProps) => {
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    category: exercise?.category || 'supine' as ExerciseCategory,
    duration: exercise?.duration || 1,
    springs: exercise?.springs || 'medium' as SpringSetting,
    difficulty: exercise?.difficulty || 'beginner' as DifficultyLevel,
    intensityLevel: exercise?.intensityLevel || 'medium' as IntensityLevel,
    description: exercise?.description || '',
    isPregnancySafe: exercise?.isPregnancySafe || false
  });
  
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>(exercise?.muscleGroups || []);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(exercise?.equipment || []);

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setSelectedMuscleGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const toggleEquipment = (item: Equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const exerciseData: Exercise = {
      ...formData,
      id: exercise?.id || Date.now().toString(),
      position: exercise?.position || 'supine' as ExercisePosition,
      primaryMuscle: exercise?.primaryMuscle || 'core' as PrimaryMuscle,
      muscleGroups: selectedMuscleGroups,
      equipment: selectedEquipment,
      isCustom: true,
      createdAt: exercise?.createdAt || new Date(),
      updatedAt: new Date(),
      image: exercise?.image || '',
      videoUrl: exercise?.videoUrl || '',
      setup: exercise?.setup || '',
      repsOrDuration: exercise?.repsOrDuration || '',
      tempo: exercise?.tempo || '',
      targetAreas: exercise?.targetAreas || [],
      breathingCues: exercise?.breathingCues || [],
      teachingFocus: exercise?.teachingFocus || [],
      modifications: exercise?.modifications || [],
      progressions: exercise?.progressions || [],
      regressions: exercise?.regressions || [],
      transitions: exercise?.transitions || [],
      contraindications: exercise?.contraindications || [],
      cues: exercise?.cues || [],
      notes: exercise?.notes || ''
    };
    
    await onSave(exerciseData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{exercise ? 'Edit Exercise' : 'Create New Exercise'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Exercise Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value: ExerciseCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                min={1}
                required
              />
            </div>

            <div>
              <Label htmlFor="springs">Spring Setting</Label>
              <Select value={formData.springs} onValueChange={(value: SpringSetting) => setFormData(prev => ({ ...prev, springs: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select spring setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value: DifficultyLevel) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Muscle Groups</Label>
              <ScrollArea className="h-32 rounded-md border p-2">
                <div className="grid grid-cols-2 gap-2">
                  {(['core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body'] as MuscleGroup[]).map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={`muscle-${group}`}
                        checked={selectedMuscleGroups.includes(group)}
                        onCheckedChange={() => toggleMuscleGroup(group)}
                      />
                      <Label htmlFor={`muscle-${group}`} className="text-sm">
                        {group}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <Label>Equipment</Label>
              <ScrollArea className="h-32 rounded-md border p-2">
                <div className="grid grid-cols-2 gap-2">
                  {(['reformer', 'mat', 'magic-circle', 'weights', 'resistance-band', 'none'] as Equipment[]).map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`equipment-${item}`}
                        checked={selectedEquipment.includes(item)}
                        onCheckedChange={() => toggleEquipment(item)}
                      />
                      <Label htmlFor={`equipment-${item}`} className="text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pregnancy-safe"
                checked={formData.isPregnancySafe}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnancySafe: checked as boolean }))}
              />
              <Label htmlFor="pregnancy-safe">Pregnancy Safe</Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {exercise ? 'Update Exercise' : 'Create Exercise'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
