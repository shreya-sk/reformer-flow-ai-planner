
import { Badge } from '@/components/ui/badge';
import { Exercise } from '@/types/reformer';

interface ExerciseStatusBadgeProps {
  exercise: Exercise;
}

export const ExerciseStatusBadge = ({ exercise }: ExerciseStatusBadgeProps) => {
  const isCustomExercise = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isCustomized = exercise.isCustomized || false;

  const getExerciseStatus = () => {
    if (isCustomExercise) return { label: 'Custom', color: 'bg-blue-500' };
    if (isCustomized) return { label: 'Modified', color: 'bg-orange-500' };
    if (isSystemExercise) return { label: 'System', color: 'bg-gray-500' };
    return { label: 'Exercise', color: 'bg-gray-500' };
  };

  const status = getExerciseStatus();

  return (
    <Badge className={`text-xs text-white ${status.color}`}>
      {status.label}
    </Badge>
  );
};
