
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Plus, X, Zap, Shield, Target, BookOpen } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface InteractiveExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  initialExercise?: Exercise;
}

const steps = [
  { id: 1, title: 'Basics', icon: Zap, description: 'Name and category' },
  { id: 2, title: 'Details', icon: Target, description: 'Duration and difficulty' },
  { id: 3, title: 'Safety', icon: Shield, description: 'Safety and modifications' },
  { id: 4, title: 'Teaching', icon: BookOpen, description: 'Cues and setup' }
];

export const InteractiveExerciseForm = ({ isOpen, onClose, onSave, initialExercise }: InteractiveExerciseFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: initialExercise?.name || '',
    category: initialExercise?.category || '',
    duration: initialExercise?.duration || 3,
    difficulty: initialExercise?.difficulty || 'beginner',
    springs: initialExercise?.springs || 'medium',
    description: initialExercise?.description || '',
    isPregnancySafe: initialExercise?.isPregnancySafe || false,
    muscleGroups: initialExercise?.muscleGroups || [],
    equipment: initialExercise?.equipment || [],
    cues: initialExercise?.cues || [],
    setup: initialExercise?.setup || '',
    modifications: initialExercise?.modifications || [],
    progressions: initialExercise?.progressions || [],
    regressions: initialExercise?.regressions || [],
    contraindications: initialExercise?.contraindications || [],
    teachingFocus: initialExercise?.teachingFocus || [],
    breathingCues: initialExercise?.breathingCues || [],
    targetAreas: initialExercise?.targetAreas || []
  });

  const [newCue, setNewCue] = useState('');
  const [newModification, setNewModification] = useState('');
  const [newProgression, setNewProgression] = useState('');
  const [newRegression, setNewRegression] = useState('');

  const categories = ['warm-up', 'legs', 'arms', 'core', 'full-body', 'cool-down', 'stretching'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const springs = ['light', 'medium', 'heavy', 'extra-heavy', 'mixed'];
  const muscleGroupOptions = ['Core', 'Legs', 'Arms', 'Back', 'Glutes', 'Shoulders', 'Chest'];

  if (!isOpen) return null;

  const progress = (currentStep / steps.length) * 100;

  const addArrayItem = (field: keyof Exercise, value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
      setValue('');
    }
  };

  const removeArrayItem = (field: keyof Exercise, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[])?.filter((_, i) => i !== index) || []
    }));
  };

  const toggleMuscleGroup = (muscle: string) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups?.includes(muscle)
        ? prev.muscleGroups.filter(m => m !== muscle)
        : [...(prev.muscleGroups || []), muscle]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.category;
      case 2:
        return formData.duration && formData.difficulty && formData.springs;
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleSave = () => {
    const newExercise: Exercise = {
      id: initialExercise?.id || `custom-${Date.now()}`,
      name: formData.name!,
      category: formData.category!,
      duration: formData.duration!,
      difficulty: formData.difficulty!,
      springs: formData.springs!,
      description: formData.description || '',
      isPregnancySafe: formData.isPregnancySafe || false,
      muscleGroups: formData.muscleGroups || [],
      equipment: formData.equipment || [],
      cues: formData.cues || [],
      setup: formData.setup || '',
      modifications: formData.modifications || [],
      progressions: formData.progressions || [],
      regressions: formData.regressions || [],
      contraindications: formData.contraindications || [],
      teachingFocus: formData.teachingFocus || [],
      breathingCues: formData.breathingCues || [],
      targetAreas: formData.targetAreas || [],
      intensityLevel: 'medium',
      image: '',
      videoUrl: '',
      notes: '',
      repsOrDuration: '',
      tempo: '',
      transitions: [],
      isCustom: true,
      isSystemExercise: false
    };

    onSave(newExercise);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Exercise Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Single Leg Stretch"
                className="text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the exercise..."
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <Select value={formData.duration?.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(duration => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} minute{duration > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Level</label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spring Setting</label>
              <Select value={formData.springs} onValueChange={(value) => setFormData(prev => ({ ...prev, springs: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {springs.map(spring => (
                    <SelectItem key={spring} value={spring}>
                      {spring.charAt(0).toUpperCase() + spring.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Muscle Groups</label>
              <div className="flex flex-wrap gap-2">
                {muscleGroupOptions.map(muscle => (
                  <Badge
                    key={muscle}
                    variant={formData.muscleGroups?.includes(muscle) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleMuscleGroup(muscle)}
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Pregnancy Safe</label>
              <Switch
                checked={formData.isPregnancySafe}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnancySafe: checked }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Modifications</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newModification}
                  onChange={(e) => setNewModification(e.target.value)}
                  placeholder="Add a modification..."
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('modifications', newModification, setNewModification)}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addArrayItem('modifications', newModification, setNewModification)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.modifications?.map((mod, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {mod}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('modifications', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Progressions (Harder)</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newProgression}
                  onChange={(e) => setNewProgression(e.target.value)}
                  placeholder="Add a progression..."
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('progressions', newProgression, setNewProgression)}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addArrayItem('progressions', newProgression, setNewProgression)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.progressions?.map((prog, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {prog}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('progressions', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Regressions (Easier)</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newRegression}
                  onChange={(e) => setNewRegression(e.target.value)}
                  placeholder="Add a regression..."
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('regressions', newRegression, setNewRegression)}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addArrayItem('regressions', newRegression, setNewRegression)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.regressions?.map((reg, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {reg}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('regressions', index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Setup Instructions</label>
              <Textarea
                value={formData.setup}
                onChange={(e) => setFormData(prev => ({ ...prev, setup: e.target.value }))}
                placeholder="How to set up the reformer for this exercise..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teaching Cues</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCue}
                  onChange={(e) => setNewCue(e.target.value)}
                  placeholder="Add a teaching cue..."
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('cues', newCue, setNewCue)}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addArrayItem('cues', newCue, setNewCue)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.cues?.map((cue, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {cue}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('cues', index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {initialExercise ? 'Edit Exercise' : 'New Exercise'}
              </CardTitle>
              <p className="text-sm text-white/80">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="bg-white/20" />
          </div>

          <div className="flex items-center justify-center mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id ? 'bg-white text-sage-600' : 'bg-white/20 text-white/60'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {step.id < steps.length && (
                    <div className={`w-8 h-0.5 transition-all ${
                      currentStep > step.id ? 'bg-white' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto">
          {renderStep()}
        </CardContent>

        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep > 1 ? 'Previous' : 'Cancel'}
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-sage-600 hover:bg-sage-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!canProceed()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Save Exercise
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
