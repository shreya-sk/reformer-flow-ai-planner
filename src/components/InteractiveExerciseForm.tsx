
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X
} from 'lucide-react';
import { Exercise, PrimaryMuscle } from '@/types/reformer';
import { ExerciseFormSteps } from './exercise-form/ExerciseFormSteps';
import { BasicInfoStep } from './exercise-form/BasicInfoStep';
import { PhysicalSetupStep } from './exercise-form/PhysicalSetupStep';
import { BodyFocusStep } from './exercise-form/BodyFocusStep';
import { TeachingDetailsStep } from './exercise-form/TeachingDetailsStep';
import { ReviewStep } from './exercise-form/ReviewStep';
import { STEPS } from './exercise-form/FormConstants';

interface InteractiveExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

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

  const [selectedCategories, setSelectedCategories] = useState<PrimaryMuscle[]>(
    exercise?.primaryMuscle ? [exercise.primaryMuscle] : ['core']
  );

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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && selectedCategories.length > 0;
      case 2:
        return formData.duration && formData.springs && formData.difficulty;
      case 3:
        return formData.muscleGroups && formData.muscleGroups.length > 0;
      case 4:
        return true;
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
          <BasicInfoStep
            formData={formData}
            setFormData={setFormData}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            uploadingImage={uploadingImage}
            uploadingVideo={uploadingVideo}
            onImageUpload={handleImageUpload}
            onVideoUpload={handleVideoUpload}
          />
        );
      case 2:
        return (
          <PhysicalSetupStep
            formData={formData}
            setFormData={setFormData}
            selectedSprings={selectedSprings}
            setSelectedSprings={setSelectedSprings}
          />
        );
      case 3:
        return (
          <BodyFocusStep
            formData={formData}
            setFormData={setFormData}
            newContraindication={newContraindication}
            setNewContraindication={setNewContraindication}
            onAddArrayItem={addArrayItem}
            onRemoveArrayItem={removeArrayItem}
          />
        );
      case 4:
        return (
          <TeachingDetailsStep
            formData={formData}
            newCue={newCue}
            setNewCue={setNewCue}
            newModification={newModification}
            setNewModification={setNewModification}
            newProgression={newProgression}
            setNewProgression={setNewProgression}
            newRegression={newRegression}
            setNewRegression={setNewRegression}
            onAddArrayItem={addArrayItem}
            onRemoveArrayItem={removeArrayItem}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            selectedCategories={selectedCategories}
            selectedSprings={selectedSprings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-sage-500/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
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

            <ExerciseFormSteps currentStep={currentStep} totalSteps={STEPS.length} />
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
