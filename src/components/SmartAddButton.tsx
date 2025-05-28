
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface SmartAddButtonProps {
  exercise: Exercise;
  onAddExercise: (exercise: Exercise) => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const SmartAddButton = ({ 
  exercise, 
  onAddExercise, 
  className,
  size = 'sm'
}: SmartAddButtonProps) => {
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
      size={size}
      className={`transition-all duration-300 ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-600 text-white shadow-lg' 
          : 'bg-sage-600 hover:bg-sage-700'
      } ${className}`}
    >
      {isAdded ? (
        <Check className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} animate-scale-in`} />
      ) : (
        <Plus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      )}
    </Button>
  );
};
