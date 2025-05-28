
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';

interface ExerciseAddButtonProps {
  exercise: Exercise;
  className?: string;
}

export const ExerciseAddButton = ({ exercise, className }: ExerciseAddButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addExercise } = usePersistedClassPlan();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Adding exercise to persisted class plan:', exercise.name);
    addExercise(exercise);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={isAdded}
      size="sm"
      className={`transition-all duration-300 ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-600 text-white' 
          : 'bg-sage-600 hover:bg-sage-700'
      } ${className}`}
    >
      {isAdded ? (
        <Check className="h-4 w-4 animate-scale-in" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  );
};
