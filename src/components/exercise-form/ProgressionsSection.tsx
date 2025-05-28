
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ProgressionsSectionProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
}

export const ProgressionsSection = ({ formData, setFormData }: ProgressionsSectionProps) => {
  const { preferences } = useUserPreferences();

  const addProgression = () => {
    setFormData({
      ...formData,
      progressions: [...(formData.progressions || []), '']
    });
  };

  const updateProgression = (index: number, value: string) => {
    setFormData({
      ...formData,
      progressions: formData.progressions?.map((p, i) => i === index ? value : p) || []
    });
  };

  const removeProgression = (index: number) => {
    setFormData({
      ...formData,
      progressions: formData.progressions?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-600">
          Progressions
          <Button onClick={addProgression} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {(formData.progressions || []).map((progression, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={progression}
                onChange={(e) => updateProgression(index, e.target.value)}
                placeholder="Add progression..."
              />
              <Button
                onClick={() => removeProgression(index)}
                size="sm"
                variant="outline"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
