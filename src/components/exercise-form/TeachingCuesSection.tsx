
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface TeachingCuesSectionProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
}

export const TeachingCuesSection = ({ formData, setFormData }: TeachingCuesSectionProps) => {
  const { preferences } = useUserPreferences();
  const [newCue, setNewCue] = useState('');

  const addCue = () => {
    if (newCue.trim()) {
      setFormData({
        ...formData,
        cues: [...(formData.cues || []), newCue.trim()]
      });
      setNewCue('');
    }
  };

  const updateCue = (index: number, value: string) => {
    setFormData({
      ...formData,
      cues: formData.cues?.map((cue, i) => i === index ? value : cue) || []
    });
  };

  const removeCue = (index: number) => {
    setFormData({
      ...formData,
      cues: formData.cues?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Teaching Cues
          <Button onClick={addCue} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {(formData.cues || []).map((cue, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={cue}
                onChange={(e) => updateCue(index, e.target.value)}
                placeholder="Add teaching cue..."
              />
              <Button
                onClick={() => removeCue(index)}
                size="sm"
                variant="outline"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newCue}
              onChange={(e) => setNewCue(e.target.value)}
              placeholder="Add a teaching cue..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCue())}
            />
            <Button onClick={addCue} size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
