
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface RegressionsSectionProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
}

export const RegressionsSection = ({ formData, setFormData }: RegressionsSectionProps) => {
  const { preferences } = useUserPreferences();

  const addRegression = () => {
    setFormData({
      ...formData,
      regressions: [...(formData.regressions || []), '']
    });
  };

  const updateRegression = (index: number, value: string) => {
    setFormData({
      ...formData,
      regressions: formData.regressions?.map((r, i) => i === index ? value : r) || []
    });
  };

  const removeRegression = (index: number) => {
    setFormData({
      ...formData,
      regressions: formData.regressions?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-blue-600">
          Regressions
          <Button onClick={addRegression} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {(formData.regressions || []).map((regression, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={regression}
                onChange={(e) => updateRegression(index, e.target.value)}
                placeholder="Add regression..."
              />
              <Button
                onClick={() => removeRegression(index)}
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
