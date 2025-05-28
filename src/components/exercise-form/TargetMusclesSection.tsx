
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { Exercise, MuscleGroup } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface TargetMusclesSectionProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
  errors: Record<string, string>;
}

const muscleGroups: MuscleGroup[] = ['core', 'arms', 'legs', 'back', 'chest', 'shoulders', 'glutes', 'calves'];

export const TargetMusclesSection = ({ formData, setFormData, errors }: TargetMusclesSectionProps) => {
  const { preferences } = useUserPreferences();

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setFormData({
      ...formData,
      muscleGroups: formData.muscleGroups?.includes(muscleGroup)
        ? formData.muscleGroups.filter(mg => mg !== muscleGroup)
        : [...(formData.muscleGroups || []), muscleGroup]
    });
  };

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-sage-600" />
          Target Muscles *
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {muscleGroups.map(group => (
            <div key={group} className="flex items-center space-x-2">
              <Checkbox
                id={group}
                checked={formData.muscleGroups?.includes(group) || false}
                onCheckedChange={() => toggleMuscleGroup(group)}
              />
              <label htmlFor={group} className="text-sm font-medium capitalize">
                {group}
              </label>
            </div>
          ))}
        </div>
        {errors.muscleGroups && <span className="text-red-500 text-xs">{errors.muscleGroups}</span>}
      </CardContent>
    </Card>
  );
};
