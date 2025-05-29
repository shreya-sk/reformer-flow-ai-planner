import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Sparkles } from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, IntensityLevel, MuscleGroup, Equipment, TeachingFocus } from '@/types/reformer';

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
    intensityLevel: exercise?.intensityLevel || 'medium' as IntensityLevel,
    muscleGroups: exercise?.muscleGroups || [] as MuscleGroup[],
    targetAreas: exercise?.targetAreas || [] as string[],
    equipment: exercise?.equipment || [] as Equipment[],
    description: exercise?.description || '',
    image: exercise?.image || '',
    videoUrl: exercise?.videoUrl || '',
    notes: exercise?.notes || '',
    cues: exercise?.cues || [] as string[],
    setup: exercise?.setup || '',
    repsOrDuration: exercise?.repsOrDuration || '',
    tempo: exercise?.tempo || '',
    contraindications: exercise?.contraindications || [] as string[],
    breathingCues: exercise?.breathingCues || [] as string[],
    teachingFocus: exercise?.teachingFocus || [] as TeachingFocus[],
    modifications: exercise?.modifications || [] as string[],
    progressions: exercise?.progressions || [] as string[],
    regressions: exercise?.regressions || [] as string[],
    isPregnancySafe: exercise?.isPregnancySafe || false,
  });

  const [newCue, setNewCue] = useState('');
  const [newContraindication, setNewContraindication] = useState('');
  const [newBreathingCue, setNewBreathingCue] = useState('');
  const [newModification, setNewModification] = useState('');
  const [newTargetArea, setNewTargetArea] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'teaching'>('basic');

  const muscleGroupOptions: MuscleGroup[] = [
    'core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body',
    'quadriceps', 'hamstrings', 'calves', 'lower-abs', 'upper-abs', 'obliques',
    'traps', 'deltoids', 'biceps', 'triceps', 'lats', 'chest', 'hip-flexors',
    'adductors', 'abductors', 'pelvic-floor', 'deep-stabilizers', 'spinal-extensors'
  ];
  
  const equipmentOptions: Equipment[] = [
    'straps', 'weights', 'magic-circle', 'theraband', 'soft-ball', 
    'short-box', 'long-box', 'jump-board', 'platform-extender', 
    'tower', 'pole', 'none'
  ];

  const teachingFocusOptions: TeachingFocus[] = [
    'alignment', 'breath', 'flow', 'stability', 'balance', 'strength', 'mobility', 'coordination'
  ];

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

  const toggleTeachingFocus = (focus: TeachingFocus) => {
    setFormData(prev => ({
      ...prev,
      teachingFocus: prev.teachingFocus.includes(focus)
        ? prev.teachingFocus.filter(f => f !== focus)
        : [...prev.teachingFocus, focus]
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

  const addContraindication = () => {
    if (newContraindication.trim()) {
      setFormData(prev => ({
        ...prev,
        contraindications: [...prev.contraindications, newContraindication.trim()]
      }));
      setNewContraindication('');
    }
  };

  const removeContraindication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contraindications: prev.contraindications.filter((_, i) => i !== index)
    }));
  };

  const addBreathingCue = () => {
    if (newBreathingCue.trim()) {
      setFormData(prev => ({
        ...prev,
        breathingCues: [...prev.breathingCues, newBreathingCue.trim()]
      }));
      setNewBreathingCue('');
    }
  };

  const removeBreathingCue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      breathingCues: prev.breathingCues.filter((_, i) => i !== index)
    }));
  };

  const addModification = () => {
    if (newModification.trim()) {
      setFormData(prev => ({
        ...prev,
        modifications: [...prev.modifications, newModification.trim()]
      }));
      setNewModification('');
    }
  };

  const removeModification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modifications: prev.modifications.filter((_, i) => i !== index)
    }));
  };

  const addTargetArea = () => {
    if (newTargetArea.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAreas: [...prev.targetAreas, newTargetArea.trim()]
      }));
      setNewTargetArea('');
    }
  };

  const removeTargetArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetAreas: prev.targetAreas.filter((_, i) => i !== index)
    }));
  };

  const generateAICues = () => {
    // Simulate AI cue generation based on exercise details
    const aiCues = [
      `Engage your ${formData.muscleGroups[0] || 'core'} throughout the movement`,
      `Maintain ${formData.difficulty === 'beginner' ? 'controlled' : 'precise'} movement quality`,
      `Focus on your breathing pattern during this ${formData.category} exercise`,
      `Keep your spine in neutral alignment`
    ];
    
    setFormData(prev => ({
      ...prev,
      cues: [...prev.cues, ...aiCues.slice(0, 2)]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.muscleGroups.length === 0) return;

    const newExercise: Exercise = {
      id: exercise?.id || `custom-${Date.now()}`,
      ...formData,
      isCustom: !exercise?.id || exercise.id.startsWith('custom-'),
      createdAt: exercise?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(newExercise);
  };

  const TabButton = ({ tab, label }: { tab: typeof activeTab, label: string }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-sage-100 text-sage-800'
          : 'text-gray-600 hover:text-sage-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {exercise ? 'Edit Exercise' : 'Add New Exercise'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <TabButton tab="basic" label="Basic" />
          <TabButton tab="details" label="Details" />
          <TabButton tab="teaching" label="Teaching" />
        </div>
      </CardHeader>
      
      <CardContent className="max-h-96 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'basic' && (
            <>
              <div>
                <Label htmlFor="name">Exercise Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter exercise name"
                  required
                />
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
                <Label htmlFor="intensityLevel">Intensity Level</Label>
                <Select value={formData.intensityLevel} onValueChange={(value: IntensityLevel) => setFormData(prev => ({ ...prev, intensityLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Muscle Groups *</Label>
                <div className="flex flex-wrap gap-1.5 mt-2 max-h-32 overflow-y-auto">
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
                <div className="flex flex-wrap gap-1.5 mt-2 max-h-32 overflow-y-auto">
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

              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Label htmlFor="pregnancy-safe" className="text-sm font-medium">
                    Pregnancy Safe
                  </Label>
                </div>
                <Switch
                  id="pregnancy-safe"
                  checked={formData.isPregnancySafe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnancySafe: checked }))}
                />
              </div>
            </>
          )}

          {activeTab === 'details' && (
            <>
              <div>
                <Label htmlFor="setup">Setup Instructions</Label>
                <Textarea
                  id="setup"
                  value={formData.setup}
                  onChange={(e) => setFormData(prev => ({ ...prev, setup: e.target.value }))}
                  placeholder="Detailed setup instructions for this exercise..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="repsOrDuration">Reps or Duration</Label>
                <Input
                  id="repsOrDuration"
                  value={formData.repsOrDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, repsOrDuration: e.target.value }))}
                  placeholder="e.g., 10 reps or 30 sec"
                />
              </div>

              <div>
                <Label htmlFor="tempo">Tempo</Label>
                <Input
                  id="tempo"
                  value={formData.tempo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tempo: e.target.value }))}
                  placeholder="e.g., slow and controlled"
                />
              </div>

              <div>
                <Label>Target Areas</Label>
                <div className="space-y-2">
                  {formData.targetAreas.map((area, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={area}
                        onChange={(e) => {
                          const newAreas = [...formData.targetAreas];
                          newAreas[index] = e.target.value;
                          setFormData(prev => ({ ...prev, targetAreas: newAreas }));
                        }}
                        placeholder="Target area..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTargetArea(index)}
                        className="text-red-600 hover:text-red-800 h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newTargetArea}
                      onChange={(e) => setNewTargetArea(e.target.value)}
                      placeholder="Add target area..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetArea())}
                    />
                    <Button type="button" onClick={addTargetArea} size="sm" className="h-9 w-9 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Exercise description..."
                  rows={3}
                />
              </div>

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
            </>
          )}

          {activeTab === 'teaching' && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Teaching Cues</Label>
                  <Button
                    type="button"
                    onClick={generateAICues}
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Suggest
                  </Button>
                </div>
                
                <div className="space-y-2">
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
                        className="text-red-600 hover:text-red-800 h-9 w-9 p-0"
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
                    <Button type="button" onClick={addCue} size="sm" className="h-9 w-9 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Safety Notes / Contraindications</Label>
                <div className="space-y-2">
                  {formData.contraindications.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newItems = [...formData.contraindications];
                          newItems[index] = e.target.value;
                          setFormData(prev => ({ ...prev, contraindications: newItems }));
                        }}
                        placeholder="Safety note or contraindication..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContraindication(index)}
                        className="text-red-600 hover:text-red-800 h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newContraindication}
                      onChange={(e) => setNewContraindication(e.target.value)}
                      placeholder="Add safety note..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addContraindication())}
                    />
                    <Button type="button" onClick={addContraindication} size="sm" className="h-9 w-9 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Breathing Cues</Label>
                <div className="space-y-2">
                  {formData.breathingCues.map((cue, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={cue}
                        onChange={(e) => {
                          const newCues = [...formData.breathingCues];
                          newCues[index] = e.target.value;
                          setFormData(prev => ({ ...prev, breathingCues: newCues }));
                        }}
                        placeholder="Breathing cue..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBreathingCue(index)}
                        className="text-red-600 hover:text-red-800 h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newBreathingCue}
                      onChange={(e) => setNewBreathingCue(e.target.value)}
                      placeholder="Add breathing cue..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBreathingCue())}
                    />
                    <Button type="button" onClick={addBreathingCue} size="sm" className="h-9 w-9 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Teaching Focus</Label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {teachingFocusOptions.map(focus => (
                    <Button
                      key={focus}
                      type="button"
                      variant={formData.teachingFocus.includes(focus) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTeachingFocus(focus)}
                      className="text-xs h-7"
                    >
                      {focus}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Modifications</Label>
                <div className="space-y-2">
                  {formData.modifications.map((mod, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={mod}
                        onChange={(e) => {
                          const newMods = [...formData.modifications];
                          newMods[index] = e.target.value;
                          setFormData(prev => ({ ...prev, modifications: newMods }));
                        }}
                        placeholder="Modification..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModification(index)}
                        className="text-red-600 hover:text-red-800 h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newModification}
                      onChange={(e) => setNewModification(e.target.value)}
                      placeholder="Add modification..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addModification())}
                    />
                    <Button type="button" onClick={addModification} size="sm" className="h-9 w-9 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1 bg-sage-600 hover:bg-sage-700">
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
