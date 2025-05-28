
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface NotesSectionProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
}

export const NotesSection = ({ formData, setFormData }: NotesSectionProps) => {
  const { preferences } = useUserPreferences();

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
          rows={3}
        />
      </CardContent>
    </Card>
  );
};
