
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { BasicExerciseDetails } from './exercise-form/BasicExerciseDetails';
import { TargetMusclesSection } from './exercise-form/TargetMusclesSection';
import { EquipmentSection } from './exercise-form/EquipmentSection';
import { TeachingCuesSection } from './exercise-form/TeachingCuesSection';
import { ProgressionsSection } from './exercise-form/ProgressionsSection';
import { RegressionsSection } from './exercise-form/RegressionsSection';
import { NotesSection } from './exercise-form/NotesSection';

interface ImprovedExerciseFormProps {
  exercise?: Exercise | null;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

export const ImprovedExerciseForm = ({ exercise, onSave, onCancel }: ImprovedExerciseFormProps) => {
  const { preferences } = useUserPreferences();
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: exercise?.name || '',
    description: exercise?.description || '',
    category: exercise?.category || 'supine',
    difficulty: exercise?.difficulty || 'beginner',
    duration: exercise?.duration || 5,
    muscleGroups: exercise?.muscleGroups || [],
    equipment: exercise?.equipment || ['straps'],
    springs: exercise?.springs || 'medium',
    isPregnancySafe: exercise?.isPregnancySafe || false,
    cues: exercise?.cues || [],
    progressions: exercise?.progressions || [],
    regressions: exercise?.regressions || [],
    contraindications: exercise?.contraindications || [],
    notes: exercise?.notes || '',
    image: exercise?.image || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Exercise name is required';
    if (!formData.muscleGroups?.length) newErrors.muscleGroups = 'At least one muscle group is required';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newExercise: Exercise = {
      id: exercise?.id || `exercise-${Date.now()}`,
      name: formData.name!,
      description: formData.description || '',
      category: formData.category!,
      difficulty: formData.difficulty!,
      intensityLevel: formData.difficulty === 'beginner' ? 'low' : formData.difficulty === 'intermediate' ? 'medium' : 'high',
      duration: formData.duration!,
      repsOrDuration: `${formData.duration} min`,
      muscleGroups: formData.muscleGroups!,
      equipment: formData.equipment!,
      springs: formData.springs!,
      isPregnancySafe: formData.isPregnancySafe!,
      cues: formData.cues!,
      progressions: formData.progressions,
      regressions: formData.regressions,
      contraindications: formData.contraindications,
      notes: formData.notes,
      image: formData.image
    };

    onSave(newExercise);
  };

  return (
    <div className={`p-6 max-h-[80vh] overflow-y-auto ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          {exercise ? 'Edit Exercise' : 'Create New Exercise'}
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="bg-sage-600 hover:bg-sage-700">
            <Save className="h-4 w-4 mr-2" />
            Save Exercise
          </Button>
          <Button onClick={onCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-4">
          <BasicExerciseDetails 
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          
          <TargetMusclesSection 
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
          
          <EquipmentSection 
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        {/* Right Column - Advanced Options */}
        <div className="space-y-4">
          <TeachingCuesSection 
            formData={formData}
            setFormData={setFormData}
          />
          
          <ProgressionsSection 
            formData={formData}
            setFormData={setFormData}
          />
          
          <RegressionsSection 
            formData={formData}
            setFormData={setFormData}
          />
          
          <NotesSection 
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
    </div>
  );
};
