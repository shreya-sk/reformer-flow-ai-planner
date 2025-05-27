
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface ExerciseAddButtonProps {
  exercise: Exercise;
  onAddExercise: (exercise: Exercise) => void;
  className?: string;
}

export const ExerciseAddButton = ({ exercise, onAddExercise, className }: ExerciseAddButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddExercise(exercise);
    setIsAdded(true);
    
    // Reset back to plus icon after 2.5 seconds
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
