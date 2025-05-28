
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Sparkles, Clock, Target, Settings } from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment } from '@/types/reformer';

interface ImprovedExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export const ImprovedExerciseForm = ({ exercise, onSave, onCancel }: ImprovedExerciseFormProps) => {
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
  const [isGeneratingCues, setIsGeneratingCues] = useState(false);

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

  const generateAICues = async () => {
    if (!formData.name || !formData.description) return;
    
    setIsGeneratingCues(true);
    try {
      // Simulate AI cue generation - in real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiCues = [
        "Engage your core throughout the movement",
        "Keep your shoulders away from your ears",
        "Breathe steadily and controlled",
        "Focus on quality over quantity"
      ];
      
      setFormData(prev => ({
        ...prev,
        cues: [...prev.cues, ...aiCues]
      }));
    } catch (error) {
      console.error('Error generating AI cues:', error);
    } finally {
      setIsGeneratingCues(false);
    }
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
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-sage-50 to-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-sage-800">
            {exercise ? 'Edit Exercise' : 'Create New Exercise'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Basics
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="cues" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Cues
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-sage-700 mb-2 block">
                  Exercise Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Footwork - Parallel"
                  className="border-sage-300 focus:border-sage-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">Position</Label>
                  <Select value={formData.category} onValueChange={(value: ExerciseCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="border-sage-300">
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
                  <Label className="text-sm font-medium text-sage-700 mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration (min)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
                    className="border-sage-300 focus:border-sage-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">Springs</Label>
                  <Select value={formData.springs} onValueChange={(value: SpringSetting) => setFormData(prev => ({ ...prev, springs: value }))}>
                    <SelectTrigger className="border-sage-300">
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
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: DifficultyLevel) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="border-sage-300">
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
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">Intensity</Label>
                  <Select value={formData.intensityLevel} onValueChange={(value: IntensityLevel) => setFormData(prev => ({ ...prev, intensityLevel: value }))}>
                    <SelectTrigger className="border-sage-300">
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
                  <div className="text-pink-600">
                    👶✓
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-6">
              <div>
                <Label className="text-sm font-medium text-sage-700 mb-2 block">
                  Muscle Groups *
                </Label>
                <div className="flex flex-wrap gap-2">
                  {muscleGroupOptions.map(group => (
                    <Button
                      key={group}
                      type="button"
                      variant={formData.muscleGroups.includes(group) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleMuscleGroup(group)}
                      className="text-xs h-8"
                    >
                      {group}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-sage-700 mb-2 block">Equipment</Label>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.map(equip => (
                    <Button
                      key={equip}
                      type="button"
                      variant={formData.equipment.includes(equip) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEquipment(equip)}
                      className="text-xs h-8"
                    >
                      {equip}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-sage-700 mb-2 block">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the exercise..."
                  rows={3}
                  className="border-sage-300 focus:border-sage-500"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-sage-700 mb-2 block">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or modifications..."
                  rows={2}
                  className="border-sage-300 focus:border-sage-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="border-sage-300 focus:border-sage-500"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-sage-700 mb-2 block">Video URL</Label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="border-sage-300 focus:border-sage-500"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cues" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-sage-700">Teaching Cues</Label>
                <Button
                  type="button"
                  onClick={generateAICues}
                  disabled={isGeneratingCues || !formData.name}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  {isGeneratingCues ? 'Generating...' : 'AI Suggest Cues'}
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {formData.cues.map((cue, index) => (
                  <div key={index} className="flex gap-2 p-3 bg-sage-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-sage-200 flex items-center justify-center text-xs font-bold text-sage-700 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <Input
                      value={cue}
                      onChange={(e) => {
                        const newCues = [...formData.cues];
                        newCues[index] = e.target.value;
                        setFormData(prev => ({ ...prev, cues: newCues }));
                      }}
                      className="flex-1 border-sage-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCue(index)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0"
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
                  className="flex-1 border-sage-300"
                />
                <Button type="button" onClick={addCue} size="sm" className="bg-sage-600 hover:bg-sage-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t border-sage-200">
            <Button 
              type="submit" 
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
              disabled={!formData.name.trim() || formData.muscleGroups.length === 0}
            >
              {exercise ? 'Update Exercise' : 'Create Exercise'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="border-sage-300">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
