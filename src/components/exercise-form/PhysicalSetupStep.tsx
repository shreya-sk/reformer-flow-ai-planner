
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/reformer';
import { SPRING_COLORS, DIFFICULTY_LEVELS } from './FormConstants';

interface PhysicalSetupStepProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
  selectedSprings: {[key: string]: number};
  setSelectedSprings: (springs: {[key: string]: number}) => void;
}

export const PhysicalSetupStep = ({
  formData,
  setFormData,
  selectedSprings,
  setSelectedSprings
}: PhysicalSetupStepProps) => {
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

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Spring Selection (Colored Dots)</Label>
        <div className="space-y-4">
          {SPRING_COLORS.map((spring) => (
            <div key={spring.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${spring.color}`}></div>
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
          onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
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
              onClick={() => setFormData({ ...formData, difficulty: level.value })}
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
          onChange={(e) => setFormData({ ...formData, repsOrDuration: e.target.value })}
          placeholder="e.g., 8-10 reps, 30 seconds"
          className="rounded-xl"
        />
      </div>
    </div>
  );
};
