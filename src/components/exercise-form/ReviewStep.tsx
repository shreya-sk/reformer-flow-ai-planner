
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Exercise, PrimaryMuscle } from '@/types/reformer';
import { CATEGORIES, SPRING_COLORS, MUSCLE_GROUPS } from './FormConstants';

interface ReviewStepProps {
  formData: Partial<Exercise>;
  selectedCategories: PrimaryMuscle[];
  selectedSprings: {[key: string]: number};
}

export const ReviewStep = ({ formData, selectedCategories, selectedSprings }: ReviewStepProps) => {
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
                    <div className={`w-3 h-3 rounded-full ${SPRING_COLORS.find(s => s.id === color)?.color}`}></div>
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
};
