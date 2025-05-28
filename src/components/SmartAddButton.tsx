
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, Baby } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface SmartAddButtonProps {
  exercise: Exercise;
  onAddExercise: (exercise: Exercise) => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showPregnancyIcon?: boolean;
}

export const SmartAddButton = ({ 
  exercise, 
  onAddExercise, 
  className = '',
  size = 'sm',
  showPregnancyIcon = false
}: SmartAddButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Adding exercise:', exercise.name);
    onAddExercise(exercise);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <Button
        onClick={handleAdd}
        disabled={isAdded}
        size={size}
        className={`transition-all duration-500 shadow-sm ${
          isAdded 
            ? 'bg-green-500 hover:bg-green-500 text-white shadow-green-200 shadow-lg scale-110' 
            : 'bg-sage-600 hover:bg-sage-700 shadow-sage-200'
        } ${className}`}
      >
        {isAdded ? (
          <Check className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} animate-bounce`} />
        ) : (
          <Plus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        )}
      </Button>
      
      {showPregnancyIcon && exercise.isPregnancySafe && (
        <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1">
          <Baby className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  );
};
