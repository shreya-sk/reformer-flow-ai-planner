
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface TeachingDetailsStepProps {
  formData: Partial<Exercise>;
  newCue: string;
  setNewCue: (value: string) => void;
  newModification: string;
  setNewModification: (value: string) => void;
  newProgression: string;
  setNewProgression: (value: string) => void;
  newRegression: string;
  setNewRegression: (value: string) => void;
  onAddArrayItem: (field: keyof Exercise, value: string, setter: (value: string) => void) => void;
  onRemoveArrayItem: (field: keyof Exercise, index: number) => void;
}

export const TeachingDetailsStep = ({
  formData,
  newCue,
  setNewCue,
  newModification,
  setNewModification,
  newProgression,
  setNewProgression,
  newRegression,
  setNewRegression,
  onAddArrayItem,
  onRemoveArrayItem
}: TeachingDetailsStepProps) => {
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
            onClick={() => onAddArrayItem('cues', newCue, setNewCue)}
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
              onClick={() => onRemoveArrayItem('cues', index)}
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
            onClick={() => onAddArrayItem('modifications', newModification, setNewModification)}
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
              onClick={() => onRemoveArrayItem('modifications', index)}
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
              onClick={() => onAddArrayItem('progressions', newProgression, setNewProgression)}
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
                onClick={() => onRemoveArrayItem('progressions', index)}
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
              onClick={() => onAddArrayItem('regressions', newRegression, setNewRegression)}
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
                onClick={() => onRemoveArrayItem('regressions', index)}
              >
                {reg} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
