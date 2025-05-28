
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Equipment, Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface EquipmentSectionProps {
  formData: Partial<Exercise>;
  setFormData: (data: Partial<Exercise>) => void;
}

const equipmentOptions: Equipment[] = ['straps', 'weights', 'magic-circle', 'theraband', 'soft-ball', 'short-box', 'long-box', 'jump-board', 'platform-extender', 'tower', 'pole', 'none'];

export const EquipmentSection = ({ formData, setFormData }: EquipmentSectionProps) => {
  const { preferences } = useUserPreferences();

  const toggleEquipment = (equipment: Equipment) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.includes(equipment)
        ? formData.equipment.filter(eq => eq !== equipment)
        : [...(formData.equipment || []), equipment]
    });
  };

  return (
    <Card className={preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(equipment => (
            <Badge
              key={equipment}
              variant={formData.equipment?.includes(equipment) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => toggleEquipment(equipment)}
            >
              {equipment}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
