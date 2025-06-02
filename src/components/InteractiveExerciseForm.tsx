
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus,
  X,
  Clock,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { Exercise, ExerciseCategory, MuscleGroup, SpringSetting, DifficultyLevel } from '@/types/reformer';

interface InteractiveExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exercise?: Exercise;
}

export const InteractiveExerciseForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  exercise 
}: InteractiveExerciseFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: exercise?.name || '',
    category: exercise?.category || 'movement' as ExerciseCategory,
    duration: exercise?.duration || 60,
    springs: exercise?.springs || 'medium' as SpringSetting,
    difficulty: exercise?.difficulty || 'beginner' as DifficultyLevel,
    muscleGroups: exercise?.muscleGroups || [],
    description: exercise?.description || '',
    cues: exercise?.cues || [],
    setup: exercise?.setup || '',
    repsOrDuration: exercise?.repsOrDuration || '',
    notes: exercise?.notes || '',
    contraindications: exercise?.contraindications || [],
    modifications: exercise?.modifications || [],
    progressions: exercise?.progressions || [],
    regressions: exercise?.regressions || [],
  });

  const steps = [
    { title: 'Basic Info', icon: Target, description: 'Name and category' },
    { title: 'Details', icon: Clock, description: 'Duration and difficulty' },
    { title: 'Body Focus', icon: Zap, description: 'Muscle groups and setup' },
    { title: 'Safety & Cues', icon: Shield, description: 'Instructions and safety' },
    { title: 'Review', icon: Check, description: 'Final check' }
  ];

  const categories: ExerciseCategory[] = ['movement', 'transition', 'stretch', 'callout'];
  const muscleGroups: MuscleGroup[] = ['core', 'legs', 'arms', 'back', 'glutes', 'shoulders', 'full-body'];
  const springs: SpringSetting[] = ['light', 'medium', 'heavy', 'variable'];
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

  const toggleMuscleGroup = (group: MuscleGroup) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups?.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...(prev.muscleGroups || []), group]
    }));
  };

  const addListItem = (field: 'cues' | 'contraindications' | 'modifications' | 'progressions' | 'regressions', item: string) => {
    if (item.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), item.trim()]
      }));
    }
  };

  const removeListItem = (field: 'cues' | 'contraindications' | 'modifications' | 'progressions' | 'regressions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const newExercise: Exercise = {
      id: exercise?.id || `custom-${Date.now()}`,
      name: formData.name || 'Untitled Exercise',
      category: formData.category || 'movement',
      duration: formData.duration || 60,
      springs: formData.springs || 'medium',
      difficulty: formData.difficulty || 'beginner',
      intensityLevel: 'medium' as const,
      muscleGroups: formData.muscleGroups || [],
      equipment: [],
      description: formData.description || '',
      image: '',
      videoUrl: '',
      notes: formData.notes || '',
      cues: formData.cues || [],
      setup: formData.setup || '',
      repsOrDuration: formData.repsOrDuration || '',
      tempo: '',
      targetAreas: [],
      breathingCues: [],
      teachingFocus: [],
      modifications: formData.modifications || [],
      progressions: formData.progressions || [],
      regressions: formData.regressions || [],
      transitions: [],
      contraindications: formData.contraindications || [],
      isPregnancySafe: false,
      isCustom: true,
      isSystemExercise: false,
    };

    onSave(newExercise);
    onClose();
    setCurrentStep(0);
    setFormData({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Roll Down, Teaser, Single Leg Stretch"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={formData.category === cat ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    className="h-12 text-left justify-start"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1: // Details
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Spring Setting</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {springs.map((spring) => (
                  <Button
                    key={spring}
                    type="button"
                    variant={formData.springs === spring ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, springs: spring }))}
                    className="h-12"
                  >
                    {spring.charAt(0).toUpperCase() + spring.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {difficulties.map((diff) => (
                  <Button
                    key={diff}
                    type="button"
                    variant={formData.difficulty === diff ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: diff }))}
                    className="h-12"
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Body Focus
        return (
          <div className="space-y-4">
            <div>
              <Label>Target Muscle Groups</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {muscleGroups.map((group) => (
                  <Button
                    key={group}
                    type="button"
                    variant={formData.muscleGroups?.includes(group) ? "default" : "outline"}
                    onClick={() => toggleMuscleGroup(group)}
                    className="h-12 text-left justify-start"
                  >
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="setup">Setup Instructions</Label>
              <Textarea
                id="setup"
                value={formData.setup || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, setup: e.target.value }))}
                placeholder="Describe how to set up for this exercise..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="repsOrDuration">Reps or Duration</Label>
              <Input
                id="repsOrDuration"
                value={formData.repsOrDuration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, repsOrDuration: e.target.value }))}
                placeholder="e.g., 8-10 reps, 30 seconds, Hold for 3 breaths"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3: // Safety & Cues
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Exercise Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the exercise..."
                className="mt-1"
              />
            </div>

            <ListInputSection
              title="Teaching Cues"
              items={formData.cues || []}
              onAdd={(item) => addListItem('cues', item)}
              onRemove={(index) => removeListItem('cues', index)}
              placeholder="Add a teaching cue..."
            />

            <ListInputSection
              title="Contraindications"
              items={formData.contraindications || []}
              onAdd={(item) => addListItem('contraindications', item)}
              onRemove={(index) => removeListItem('contraindications', index)}
              placeholder="Add a contraindication..."
            />
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">{formData.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{formData.duration}s</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Springs:</span>
                    <p className="font-medium">{formData.springs}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
                    <p className="font-medium">{formData.difficulty}</p>
                  </div>
                </div>
                
                {formData.muscleGroups && formData.muscleGroups.length > 0 && (
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Muscle Groups:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.muscleGroups.map((group) => (
                        <Badge key={group} variant="secondary" className="text-xs">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <steps[currentStep].icon className="h-5 w-5 text-sage-600" />
            {steps[currentStep].title}
          </DialogTitle>
          <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                index === currentStep
                  ? 'bg-sage-600 text-white'
                  : index < currentStep
                  ? 'bg-sage-200 text-sage-800'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px] mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSave}
              className="bg-sage-600 hover:bg-sage-700"
              disabled={!formData.name}
            >
              Save Exercise
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center gap-1"
              disabled={currentStep === 0 && !formData.name}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for list inputs
interface ListInputSectionProps {
  title: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}

const ListInputSection = ({ title, items, onAdd, onRemove, placeholder }: ListInputSectionProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    onAdd(inputValue);
    setInputValue('');
  };

  return (
    <div>
      <Label>{title}</Label>
      <div className="flex gap-2 mt-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          type="button"
          size="icon"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {items.length > 0 && (
        <div className="mt-2 space-y-1">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
              <span>{item}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => onRemove(index)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
