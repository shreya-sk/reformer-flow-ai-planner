import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Info,
  Target,
  Settings,
  Shield,
  Eye
} from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, Equipment, TeachingFocus } from '@/types/reformer';

interface InteractiveExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Info, description: 'Name and category' },
  { id: 2, title: 'Physical Details', icon: Settings, description: 'Duration, springs, difficulty' },
  { id: 3, title: 'Body Focus', icon: Target, description: 'Muscle groups and setup' },
  { id: 4, title: 'Safety & Teaching', icon: Shield, description: 'Cues and safety notes' },
  { id: 5, title: 'Review', icon: Eye, description: 'Final review' }
];

const CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: 'supine', label: 'Supine (lying down)' },
  { value: 'prone', label: 'Prone (face down)' },
  { value: 'sitting', label: 'Sitting' },
  { value: 'side-lying', label: 'Side-lying' },
  { value: 'kneeling', label: 'Kneeling' },
  { value: 'standing', label: 'Standing' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'cool-down', label: 'Cool-down' },
  { value: 'other', label: 'Other' }
];

const SPRING_SETTINGS: { value: SpringSetting; label: string; color: string }[] = [
  { value: 'light', label: 'Light', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'heavy', label: 'Heavy', color: 'bg-red-100 text-red-700' },
  { value: 'mixed', label: 'Mixed', color: 'bg-purple-100 text-purple-700' },
  { value: 'none', label: 'None', color: 'bg-gray-100 text-gray-700' }
];

const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' }
];

const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: 'core', label: 'Core' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'back', label: 'Back' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'chest', label: 'Chest' },
  { value: 'full-body', label: 'Full Body' }
];

const TEACHING_FOCUS_OPTIONS: { value: TeachingFocus; label: string }[] = [
  { value: 'alignment', label: 'Alignment' },
  { value: 'core-engagement', label: 'Core Engagement' },
  { value: 'breath', label: 'Breath' },
  { value: 'precision', label: 'Precision' },
  { value: 'control', label: 'Control' },
  { value: 'flow', label: 'Flow' },
  { value: 'stability', label: 'Stability' },
  { value: 'mobility', label: 'Mobility' }
];

export const InteractiveExerciseForm = ({ exercise, onSave, onCancel }: InteractiveExerciseFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: exercise?.name || '',
    category: exercise?.category || 'supine',
    duration: exercise?.duration || 3,
    springs: exercise?.springs || 'medium',
    difficulty: exercise?.difficulty || 'beginner',
    intensityLevel: exercise?.intensityLevel || 'medium',
    muscleGroups: exercise?.muscleGroups || [],
    equipment: exercise?.equipment || [],
    description: exercise?.description || '',
    setup: exercise?.setup || '',
    repsOrDuration: exercise?.repsOrDuration || '',
    cues: exercise?.cues || [],
    teachingFocus: exercise?.teachingFocus || [],
    modifications: exercise?.modifications || [],
    progressions: exercise?.progressions || [],
    regressions: exercise?.regressions || [],
    contraindications: exercise?.contraindications || [],
    isPregnancySafe: exercise?.isPregnancySafe || false,
    ...exercise
  });

  const [newCue, setNewCue] = useState('');
  const [newModification, setNewModification] = useState('');
  const [newProgression, setNewProgression] = useState('');
  const [newRegression, setNewRegression] = useState('');
  const [newContraindication, setNewContraindication] = useState('');

  const progressPercentage = (currentStep / STEPS.length) * 100;

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const exerciseData: Exercise = {
      id: exercise?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category!,
      duration: formData.duration!,
      springs: formData.springs!,
      difficulty: formData.difficulty!,
      intensityLevel: formData.intensityLevel!,
      muscleGroups: formData.muscleGroups!,
      equipment: formData.equipment!,
      description: formData.description!,
      image: formData.image || '',
      videoUrl: formData.videoUrl || '',
      notes: formData.notes || '',
      cues: formData.cues!,
      setup: formData.setup!,
      repsOrDuration: formData.repsOrDuration!,
      tempo: formData.tempo || '',
      targetAreas: formData.targetAreas || [],
      breathingCues: formData.breathingCues || [],
      teachingFocus: formData.teachingFocus!,
      modifications: formData.modifications!,
      progressions: formData.progressions!,
      regressions: formData.regressions!,
      transitions: formData.transitions || [],
      contraindications: formData.contraindications!,
      isPregnancySafe: formData.isPregnancySafe!,
      isCustom: true
    };

    onSave(exerciseData);
  };

  const addArrayItem = (field: keyof Exercise, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = (formData[field] as string[]) || [];
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }));
      setter('');
    }
  };

  const removeArrayItem = (field: keyof Exercise, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    const current = formData.muscleGroups || [];
    const updated = current.includes(muscleGroup)
      ? current.filter(mg => mg !== muscleGroup)
      : [...current, muscleGroup];
    setFormData(prev => ({ ...prev, muscleGroups: updated }));
  };

  const toggleTeachingFocus = (focus: TeachingFocus) => {
    const current = formData.teachingFocus || [];
    const updated = current.includes(focus)
      ? current.filter(tf => tf !== focus)
      : [...current, focus];
    setFormData(prev => ({ ...prev, teachingFocus: updated }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.category;
      case 2:
        return formData.duration && formData.springs && formData.difficulty;
      case 3:
        return formData.muscleGroups && formData.muscleGroups.length > 0;
      case 4:
        return true; // Optional step
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-base font-semibold mb-3 block">Exercise Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Single Leg Teaser"
                className="text-lg p-4 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Category</Label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.category === cat.value
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-semibold mb-3 block">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the exercise..."
                className="min-h-20 rounded-xl"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="duration" className="text-base font-semibold mb-3 block">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                min="1"
                max="30"
                className="text-lg p-4 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Spring Setting</Label>
              <div className="grid grid-cols-2 gap-3">
                {SPRING_SETTINGS.map((spring) => (
                  <button
                    key={spring.value}
                    onClick={() => setFormData(prev => ({ ...prev, springs: spring.value }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.springs === spring.value
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <Badge className={spring.color}>{spring.label}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.difficulty === level.value
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <Badge className={level.color}>{level.label}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="repsOrDuration" className="text-base font-semibold mb-3 block">Reps or Duration (Optional)</Label>
              <Input
                id="repsOrDuration"
                value={formData.repsOrDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, repsOrDuration: e.target.value }))}
                placeholder="e.g., 8-10 reps, 30 seconds"
                className="rounded-xl"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Target Muscle Groups</Label>
              <div className="grid grid-cols-2 gap-3">
                {MUSCLE_GROUPS.map((muscle) => (
                  <button
                    key={muscle.value}
                    onClick={() => toggleMuscleGroup(muscle.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.muscleGroups?.includes(muscle.value)
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    {muscle.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="setup" className="text-base font-semibold mb-3 block">Setup Instructions (Optional)</Label>
              <Textarea
                id="setup"
                value={formData.setup}
                onChange={(e) => setFormData(prev => ({ ...prev, setup: e.target.value }))}
                placeholder="How to set up for this exercise..."
                className="min-h-20 rounded-xl"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div>
                <Label className="text-base font-semibold">Pregnancy Safe</Label>
                <p className="text-sm text-gray-600">Is this exercise safe during pregnancy?</p>
              </div>
              <Switch
                checked={formData.isPregnancySafe}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnancySafe: checked }))}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Teaching Focus</Label>
              <div className="grid grid-cols-2 gap-3">
                {TEACHING_FOCUS_OPTIONS.map((focus) => (
                  <button
                    key={focus.value}
                    onClick={() => toggleTeachingFocus(focus.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.teachingFocus?.includes(focus.value)
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    {focus.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Teaching Cues</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newCue}
                  onChange={(e) => setNewCue(e.target.value)}
                  placeholder="Add a teaching cue..."
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem('cues', newCue, setNewCue)}
                  className="rounded-xl"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cues?.map((cue, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeArrayItem('cues', index)}
                  >
                    {cue} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Contraindications</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newContraindication}
                  onChange={(e) => setNewContraindication(e.target.value)}
                  placeholder="Add a contraindication..."
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem('contraindications', newContraindication, setNewContraindication)}
                  className="rounded-xl"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.contraindications?.map((contra, index) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => removeArrayItem('contraindications', index)}
                  >
                    {contra} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Modifications</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newModification}
                  onChange={(e) => setNewModification(e.target.value)}
                  placeholder="Add a modification..."
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  onClick={() => addArrayItem('modifications', newModification, setNewModification)}
                  className="rounded-xl"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.modifications?.map((mod, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeArrayItem('modifications', index)}
                  >
                    {mod} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">Progressions</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newProgression}
                    onChange={(e) => setNewProgression(e.target.value)}
                    placeholder="Add progression..."
                    className="rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem('progressions', newProgression, setNewProgression)}
                    size="sm"
                    className="rounded-xl"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.progressions?.map((prog, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer bg-blue-100 text-blue-700"
                      onClick={() => removeArrayItem('progressions', index)}
                    >
                      {prog} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Regressions</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newRegression}
                    onChange={(e) => setNewRegression(e.target.value)}
                    placeholder="Add regression..."
                    className="rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem('regressions', newRegression, setNewRegression)}
                    size="sm"
                    className="rounded-xl"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.regressions?.map((reg, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer bg-green-100 text-green-700"
                      onClick={() => removeArrayItem('regressions', index)}
                    >
                      {reg} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-sage-800 mb-2">Review Your Exercise</h3>
              <p className="text-gray-600">Check everything looks correct before saving</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{formData.name}</h4>
                  <div className="flex gap-2 mt-2">
                    <Badge>{formData.category}</Badge>
                    <Badge variant="outline">{formData.difficulty}</Badge>
                    <Badge variant="outline">{formData.duration} min</Badge>
                    <Badge variant="outline">{formData.springs} springs</Badge>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h5 className="font-medium mb-1">Description</h5>
                    <p className="text-sm text-gray-600">{formData.description}</p>
                  </div>
                )}

                <div>
                  <h5 className="font-medium mb-1">Target Muscle Groups</h5>
                  <div className="flex flex-wrap gap-1">
                    {formData.muscleGroups?.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>

                {formData.teachingFocus && formData.teachingFocus.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-1">Teaching Focus</h5>
                    <div className="flex flex-wrap gap-1">
                      {formData.teachingFocus.map((focus) => (
                        <Badge key={focus} variant="outline" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.cues && formData.cues.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-1">Teaching Cues</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formData.cues.map((cue, index) => (
                        <li key={index}>• {cue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.isPregnancySafe && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Pregnancy Safe</span>
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
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-500 to-sage-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {exercise ? 'Edit Exercise' : 'Create New Exercise'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep} of {STEPS.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="bg-white/20" />
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-between mt-4">
              {STEPS.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      step.id === currentStep ? 'text-white' : 
                      step.id < currentStep ? 'text-white' : 'text-white/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      step.id === currentStep ? 'bg-white text-sage-600' :
                      step.id < currentStep ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {step.id < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs text-center hidden sm:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{STEPS[currentStep - 1].title}</h3>
              <p className="text-gray-600 text-sm">{STEPS[currentStep - 1].description}</p>
            </div>

            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === STEPS.length ? (
              <Button
                onClick={handleSave}
                disabled={!canProceed()}
                className="bg-sage-600 hover:bg-sage-700 rounded-xl"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Exercise
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-sage-600 hover:bg-sage-700 rounded-xl"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
