
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { Exercise, MuscleGroup, TeachingFocus } from '@/types/reformer';
import { MUSCLE_GROUPS, TEACHING_FOCUS_OPTIONS } from './FormConstants';

interface BodyFocusStepProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
  newContraindication: string;
  setNewContraindication: (value: string) => void;
  onAddArrayItem: (field: keyof Exercise, value: string, setter: (value: string) => void) => void;
  onRemoveArrayItem: (field: keyof Exercise, index: number) => void;
}

export const BodyFocusStep = ({
  formData,
  setFormData,
  newContraindication,
  setNewContraindication,
  onAddArrayItem,
  onRemoveArrayItem
}: BodyFocusStepProps) => {
  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    const current = formData.muscleGroups || [];
    const updated = current.includes(muscleGroup)
      ? current.filter(mg => mg !== muscleGroup)
      : [...current, muscleGroup];
    setFormData({ ...formData, muscleGroups: updated });
  };

  const toggleTeachingFocus = (focus: TeachingFocus) => {
    const current = formData.teachingFocus || [];
    const updated = current.includes(focus)
      ? current.filter(tf => tf !== focus)
      : [...current, focus];
    setFormData({ ...formData, teachingFocus: updated });
  };

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
            onClick={() => onAddArrayItem('contraindications', newContraindication, setNewContraindication)}
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
              onClick={() => onRemoveArrayItem('contraindications', index)}
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
          onCheckedChange={(checked) => setFormData({ ...formData, isPregnancySafe: checked })}
        />
      </div>
    </div>
  );
};
