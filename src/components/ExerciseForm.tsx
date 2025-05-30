
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment } from '@/types/reformer';

interface ExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exercise: Exercise) => void;
}

export const ExerciseForm = ({ isOpen, onClose, onSubmit }: ExerciseFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'supine' as ExerciseCategory,
    duration: 1,
    springs: 'medium' as SpringSetting,
    difficulty: 'beginner' as DifficultyLevel,
    intensityLevel: 'medium' as IntensityLevel,
    description: '',
    isPregnancySafe: false
  });
  
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exerciseData: Exercise = {
      ...formData,
      id: Date.now().toString(),
      muscleGroups: selectedMuscleGroups,
      equipment: selectedEquipment,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: '',
      videoUrl: '',
      setup: '',
      repsOrDuration: '',
      tempo: '',
      targetAreas: [],
      breathingCues: [],
      teachingFocus: [],
      modifications: [],
      progressions: [],
      regressions: [],
      transitions: [],
      contraindications: [],
      cues: [],
      notes: ''
    };
    
    onSubmit(exerciseData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exercise</DialogTitle>
          <DialogDescription>
            Add a new custom exercise to your library.
          </DialogDescription>
        </DialogHeader>
        
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
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Exercise
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
