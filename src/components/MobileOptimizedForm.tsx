
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Sparkles, Clock, Target } from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface MobileOptimizedFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export const MobileOptimizedForm = ({ exercise, onSave, onCancel }: MobileOptimizedFormProps) => {
  const { preferences } = useUserPreferences();
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    category: exercise?.category || 'supine' as ExerciseCategory,
    duration: exercise?.duration || 3,
    springs: exercise?.springs || 'medium' as SpringSetting,
    difficulty: exercise?.difficulty || 'beginner' as DifficultyLevel,
    intensityLevel: exercise?.intensityLevel || 'medium' as IntensityLevel,
    muscleGroups: exercise?.muscleGroups || [] as MuscleGroup[],
    equipment: exercise?.equipment || [] as Equipment[],
    description: exercise?.description || '',
    image: exercise?.image || '',
    videoUrl: exercise?.videoUrl || '',
    notes: exercise?.notes || '',
    cues: exercise?.cues || [] as string[],
    isPregnancySafe: exercise?.isPregnancySafe || false,
  });

  const [newCue, setNewCue] = useState('');
  const [activeSection, setActiveSection] = useState('basics');

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

  const sections = [
    { id: 'basics', title: 'Basics', icon: Target },
    { id: 'details', title: 'Details', icon: Clock },
    { id: 'cues', title: 'Cues', icon: Sparkles },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Mobile navigation */}
      <div className="flex border-b bg-white sticky top-0 z-10">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'border-b-2 border-sage-600 text-sage-600 bg-sage-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <section.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {exercise ? 'Edit Exercise' : 'Create Exercise'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Basics Section */}
          {activeSection === 'basics' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Exercise Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Footwork - Parallel"
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Position</Label>
                  <Select value={formData.category} onValueChange={(value: ExerciseCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="h-12">
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
                  <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration (min)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Springs</Label>
                  <Select value={formData.springs} onValueChange={(value: SpringSetting) => setFormData(prev => ({ ...prev, springs: value }))}>
                    <SelectTrigger className="h-12">
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
                  <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: DifficultyLevel) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Intensity</Label>
                  <Select value={formData.intensityLevel} onValueChange={(value: IntensityLevel) => setFormData(prev => ({ ...prev, intensityLevel: value }))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <Switch
                  checked={formData.isPregnancySafe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnancySafe: checked }))}
                  className="data-[state=checked]:bg-pink-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-pink-800">Pregnancy Safe</span>
                  <div className="text-pink-600">👶✓</div>
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          {activeSection === 'details' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Muscle Groups *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {muscleGroupOptions.map(group => (
                    <Button
                      key={group}
                      type="button"
                      variant={formData.muscleGroups.includes(group) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleMuscleGroup(group)}
                      className="h-12 text-sm"
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Equipment</Label>
                <div className="grid grid-cols-2 gap-2">
                  {equipmentOptions.map(equip => (
                    <Button
                      key={equip}
                      type="button"
                      variant={formData.equipment.includes(equip) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEquipment(equip)}
                      className="h-12 text-sm"
                    >
                      {equip}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the exercise..."
                  rows={4}
                  className="text-base"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or modifications..."
                  rows={3}
                  className="text-base"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="h-12 text-base"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Video URL</Label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cues Section */}
          {activeSection === 'cues' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {formData.cues.map((cue, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-sage-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center text-sm font-bold text-sage-700 flex-shrink-0">
                      {index + 1}
                    </div>
                    <Input
                      value={cue}
                      onChange={(e) => {
                        const newCues = [...formData.cues];
                        newCues[index] = e.target.value;
                        setFormData(prev => ({ ...prev, cues: newCues }));
                      }}
                      className="flex-1 h-10 text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCue(index)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0 h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newCue}
                  onChange={(e) => setNewCue(e.target.value)}
                  placeholder="Add a teaching cue..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCue())}
                  className="flex-1 h-12 text-base"
                />
                <Button type="button" onClick={addCue} size="sm" className="h-12 w-12 bg-sage-600 hover:bg-sage-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Fixed bottom actions */}
        <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
          <Button 
            type="submit" 
            className="w-full h-12 bg-sage-600 hover:bg-sage-700 text-white text-base"
            disabled={!formData.name.trim() || formData.muscleGroups.length === 0}
          >
            {exercise ? 'Update Exercise' : 'Create Exercise'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="w-full h-12 border-sage-300 text-base"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
