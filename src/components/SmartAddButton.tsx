
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';

interface SmartAddButtonProps {
  exercise: Exercise;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showFeedback?: boolean;
}

export const SmartAddButton = ({ 
  exercise, 
  className = '',
  size = 'sm',
  showFeedback = true
}: SmartAddButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addExercise } = usePersistedClassPlan();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a unique copy of the exercise with a new ID
    const exerciseToAdd = {
      ...exercise,
      id: `${exercise.id}-${Date.now()}`,
    };
    
    console.log('Adding exercise to persisted class plan:', exerciseToAdd.name);
    addExercise(exerciseToAdd);
    
    if (showFeedback) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 2500);
    }
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={isAdded}
      size={size}
      className={`transition-all duration-500 ${
        isAdded 
          ? 'bg-green-500 hover:bg-green-500 text-white scale-110' 
          : 'bg-sage-600 hover:bg-sage-700'
      } ${className}`}
    >
      {isAdded ? (
        <Check className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} animate-bounce`} />
      ) : (
        <Plus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      )}
    </Button>
  );
};
