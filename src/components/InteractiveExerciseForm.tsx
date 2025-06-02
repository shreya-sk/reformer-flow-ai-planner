
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
  Eye,
  Upload,
  Camera
} from 'lucide-react';
import { Exercise, ExerciseCategory, SpringSetting, DifficultyLevel, MuscleGroup, TeachingFocus, PrimaryMuscle, ExercisePosition } from '@/types/reformer';

interface InteractiveExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Info, description: 'Name, description, categories and position' },
  { id: 2, title: 'Physical Setup', icon: Settings, description: 'Springs, duration and difficulty' },
  { id: 3, title: 'Body Focus', icon: Target, description: 'Muscle groups, focus and safety' },
  { id: 4, title: 'Teaching Details', icon: Shield, description: 'Cues, progressions and modifications' },
  { id: 5, title: 'Review', icon: Eye, description: 'Final review' }
];

const CATEGORIES: { value: PrimaryMuscle; label: string }[] = [
  { value: 'core', label: 'Core' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'back', label: 'Back' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'cool-down', label: 'Cool-down' }
];

const POSITIONS: { value: ExercisePosition; label: string }[] = [
  { value: 'supine', label: 'Supine (lying down)' },
  { value: 'prone', label: 'Prone (face down)' },
  { value: 'sitting', label: 'Sitting' },
  { value: 'side-lying', label: 'Side-lying' },
  { value: 'kneeling', label: 'Kneeling' },
  { value: 'standing', label: 'Standing' },
  { value: 'other', label: 'Other' }
];

const SPRING_COLORS = [
  { id: 'red', color: 'bg-red-500', label: 'Red (Heavy)', available: 2 },
  { id: 'yellow', color: 'bg-yellow-500', label: 'Yellow (Medium)', available: 1 },
  { id: 'blue', color: 'bg-blue-500', label: 'Blue (Light)', available: 1 },
  { id: 'green', color: 'bg-green-500', label: 'Green (Extra Light)', available: 1 }
];

const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' }
];

const MUSCLE_GROUPS: { value: MuscleGroup; label: string; category: string }[] = [
  // Core
  { value: 'core', label: 'Core', category: 'Core' },
  { value: 'lower-abs', label: 'Lower Abs', category: 'Core' },
  { value: 'upper-abs', label: 'Upper Abs', category: 'Core' },
  { value: 'obliques', label: 'Obliques', category: 'Core' },
  { value: 'transverse-abdominis', label: 'Deep Core', category: 'Core' },
  { value: 'pelvic-floor', label: 'Pelvic Floor', category: 'Core' },
  { value: 'diaphragm', label: 'Diaphragm', category: 'Core' },
  
  // Legs
  { value: 'legs', label: 'Legs', category: 'Legs' },
  { value: 'quadriceps', label: 'Quadriceps', category: 'Legs' },
  { value: 'hamstrings', label: 'Hamstrings', category: 'Legs' },
  { value: 'calves', label: 'Calves', category: 'Legs' },
  { value: 'hip-flexors', label: 'Hip Flexors', category: 'Legs' },
  { value: 'hip-adductors', label: 'Inner Thighs', category: 'Legs' },
  { value: 'hip-abductors', label: 'Outer Thighs', category: 'Legs' },
  { value: 'ankles', label: 'Ankles', category: 'Legs' },
  { value: 'feet', label: 'Feet', category: 'Legs' },
  
  // Glutes
  { value: 'glutes', label: 'Glutes', category: 'Glutes' },
  
  // Arms
  { value: 'arms', label: 'Arms', category: 'Arms' },
  { value: 'biceps', label: 'Biceps', category: 'Arms' },
  { value: 'triceps', label: 'Triceps', category: 'Arms' },
  { value: 'forearms', label: 'Forearms', category: 'Arms' },
  { value: 'wrists', label: 'Wrists', category: 'Arms' },
  
  // Back
  { value: 'back', label: 'Back', category: 'Back' },
  { value: 'lats', label: 'Lats', category: 'Back' },
  { value: 'rhomboids', label: 'Rhomboids', category: 'Back' },
  { value: 'erector-spinae', label: 'Erector Spinae', category: 'Back' },
  { value: 'traps', label: 'Trapezius', category: 'Back' },
  { value: 'thoracic-spine', label: 'Thoracic Spine', category: 'Back' },
  { value: 'lumbar-spine', label: 'Lumbar Spine', category: 'Back' },
  
  // Shoulders
  { value: 'shoulders', label: 'Shoulders', category: 'Shoulders' },
  { value: 'deltoids', label: 'Deltoids', category: 'Shoulders' },
  { value: 'rotator-cuff', label: 'Rotator Cuff', category: 'Shoulders' },
  
  // Chest
  { value: 'chest', label: 'Chest', category: 'Chest' },
  { value: 'serratus-anterior', label: 'Serratus', category: 'Chest' },
  { value: 'intercostals', label: 'Intercostals', category: 'Chest' },
  
  // Neck
  { value: 'neck', label: 'Neck', category: 'Neck' },
  { value: 'cervical-spine', label: 'Cervical Spine', category: 'Neck' },
  
  // Other
  { value: 'deep-stabilizers', label: 'Deep Stabilizers', category: 'Other' },
  { value: 'spinal-extensors', label: 'Spinal Extensors', category: 'Other' },
  { value: 'psoas', label: 'Psoas', category: 'Other' },
  { value: 'iliotibial-band', label: 'IT Band', category: 'Other' },
  { value: 'full-body', label: 'Full Body', category: 'Other' }
];

const TEACHING_FOCUS_OPTIONS: { value: TeachingFocus; label: string }[] = [
  { value: 'alignment', label: 'Alignment' },
  { value: 'core-engagement', label: 'Core Engagement' },
  { value: 'breath', label: 'Breath' },
  { value: 'precision', label: 'Precision' },
  { value: 'control', label: 'Control' },
  { value: 'flow', label: 'Flow' },
  { value: 'stability', label: 'Stability' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'balance', label: 'Balance' },
  { value: 'strength', label: 'Strength' },
  { value: 'coordination', label: 'Coordination' }
];

export const InteractiveExerciseForm = ({ exercise, onSave, onCancel }: InteractiveExerciseFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: exercise?.name || '',
    category: exercise?.category || 'supine',
    position: exercise?.position || 'supine',
    primaryMuscle: exercise?.primaryMuscle || 'core',
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
    image: exercise?.image || '',
    videoUrl: exercise?.videoUrl || '',
    ...exercise
  });

  // State for selected categories (multi-select)
  const [selectedCategories, setSelectedCategories] = useState<PrimaryMuscle[]>(
    exercise?.primaryMuscle ? [exercise.primaryMuscle] : ['core']
  );

  // State for selected springs
  const [selectedSprings, setSelectedSprings] = useState<{[key: string]: number}>({
    red: 0,
    yellow: 0,
    blue: 0,
    green: 0
  });

  const [newCue, setNewCue] = useState('');
  const [newModification, setNewModification] = useState('');
  const [newProgression, setNewProgression] = useState('');
  const [newRegression, setNewRegression] = useState('');
  const [newContraindication, setNewContraindication] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Here you would implement the actual upload to Supabase storage
      // For now, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: mockUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      // Here you would implement the actual upload to Supabase storage
      // For now, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, videoUrl: mockUrl }));
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = () => {
    const exerciseData: Exercise = {
      id: exercise?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category!,
      position: formData.position!,
      primaryMuscle: selectedCategories[0] || 'core',
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

  const toggleCategory = (category: ExerciseCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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

  const updateSpringSelection = (springId: string, increment: boolean) => {
    const spring = SPRING_COLORS.find(s => s.id === springId);
    if (!spring) return;

    setSelectedSprings(prev => {
      const current = prev[springId] || 0;
      const newValue = increment 
        ? Math.min(current + 1, spring.available)
        : Math.max(current - 1, 0);
      
      return { ...prev, [springId]: newValue };
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && selectedCategories.length > 0;
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
              <Label htmlFor="description" className="text-base font-semibold mb-3 block">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the exercise..."
                className="min-h-20 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Categories for Organization (Multi-select)</Label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => toggleCategory(cat.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedCategories.includes(cat.value)
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedCategories.map(cat => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {CATEGORIES.find(c => c.value === cat)?.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Position</Label>
              <div className="grid grid-cols-2 gap-3">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => setFormData(prev => ({ ...prev, position: pos.value }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.position === pos.value
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="font-medium">{pos.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">Upload Image</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sage-400 transition-colors"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <span className="text-sm">Upload Image</span>
                  </label>
                  {formData.image && (
                    <div className="text-xs text-green-600">✓ Image uploaded</div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Upload Video</Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-sage-400 transition-colors"
                  >
                    {uploadingVideo ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sage-600"></div>
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span className="text-sm">Upload Video</span>
                  </label>
                  {formData.videoUrl && (
                    <div className="text-xs text-green-600">✓ Video uploaded</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Spring Selection (Colored Dots)</Label>
              <div className="space-y-4">
                {SPRING_COLORS.map((spring) => (
                  <div key={spring.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${spring.color}`}></div>
                      <span className="font-medium">{spring.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateSpringSelection(spring.id, false)}
                        disabled={selectedSprings[spring.id] === 0}
                        className="w-6 h-6 p-0 text-xs"
                      >
                        -
                      </Button>
                      <span className="w-6 text-center font-bold text-sm">{selectedSprings[spring.id]}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateSpringSelection(spring.id, true)}
                        disabled={selectedSprings[spring.id] >= spring.available}
                        className="w-6 h-6 p-0 text-xs"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
              <Label className="text-base font-semibold mb-3 block">Target Muscle Groups (Multi-select)</Label>
              <div className="max-h-48 overflow-y-auto space-y-3">
                {['Core', 'Legs', 'Glutes', 'Arms', 'Back', 'Shoulders', 'Chest', 'Neck', 'Other'].map(category => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {MUSCLE_GROUPS.filter(m => m.category === category).map((muscle) => (
                        <button
                          key={muscle.value}
                          onClick={() => toggleMuscleGroup(muscle.value)}
                          className={`px-2 py-1 text-xs rounded-full border transition-all ${
                            formData.muscleGroups?.includes(muscle.value)
                              ? 'border-sage-500 bg-sage-50 text-sage-700'
                              : 'border-gray-200 hover:border-sage-300 text-gray-600'
                          }`}
                        >
                          {muscle.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Teaching Focus</Label>
              <div className="grid grid-cols-2 gap-2">
                {TEACHING_FOCUS_OPTIONS.map((focus) => (
                  <button
                    key={focus.value}
                    onClick={() => toggleTeachingFocus(focus.value)}
                    className={`p-2 rounded-xl border-2 transition-all text-sm ${
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
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
                    {selectedCategories.map(cat => (
                      <Badge key={cat}>{CATEGORIES.find(c => c.value === cat)?.label}</Badge>
                    ))}
                    <Badge variant="outline">{formData.difficulty}</Badge>
                    <Badge variant="outline">{formData.duration} min</Badge>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h5 className="font-medium mb-1">Description</h5>
                    <p className="text-sm text-gray-600">{formData.description}</p>
                  </div>
                )}

                <div>
                  <h5 className="font-medium mb-1">Selected Springs</h5>
                  <div className="flex gap-2">
                    {Object.entries(selectedSprings).map(([color, count]) => (
                      count > 0 && (
                        <div key={color} className="flex items-center gap-1">
                          <div className={`w-4 h-4 rounded-full ${SPRING_COLORS.find(s => s.id === color)?.color}`}></div>
                          <span className="text-sm">×{count}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-1">Target Muscle Groups</h5>
                  <div className="flex flex-wrap gap-1">
                    {formData.muscleGroups?.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {MUSCLE_GROUPS.find(m => m.value === muscle)?.label}
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
