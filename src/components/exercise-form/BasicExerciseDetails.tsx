
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import { Exercise, ExerciseCategory } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface BasicExerciseDetailsProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
  errors: Record<string, string>;
}

const categories: ExerciseCategory[] = ['supine', 'prone', 'standing', 'sitting', 'side-lying', 'kneeling'];

const springOptions = [
  { value: 'light', label: 'Light', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'heavy', label: 'Heavy', color: 'bg-red-500' },
  { value: 'mixed', label: 'Mixed', color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500' }
];

export const BasicExerciseDetails = ({ formData, setFormData, errors }: BasicExerciseDetailsProps) => {
  const { preferences } = useUserPreferences();

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-sage-600" />
          Exercise Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Exercise Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter exercise name..."
            className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the exercise..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as ExerciseCategory })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Duration (minutes) *</label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className={`mt-1 ${errors.duration ? 'border-red-500' : ''}`}
              min="1"
            />
            {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
          </div>

          <div>
            <label className="text-sm font-medium">Springs</label>
            <Select
              value={formData.springs}
              onValueChange={(value) => setFormData({ ...formData, springs: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {springOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="pregnancy-safe"
            checked={formData.isPregnancySafe}
            onCheckedChange={(checked) => setFormData({ ...formData, isPregnancySafe: !!checked })}
          />
          <label htmlFor="pregnancy-safe" className="text-sm font-medium">
            Pregnancy Safe
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
