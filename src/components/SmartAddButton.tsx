
import { useState, useRef } from 'react';
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
  const isAddingRef = useRef(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple rapid clicks
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    
    try {
      // Create a unique copy of the exercise with a timestamp and random string for uniqueness
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const uniqueId = `${exercise.id}-${timestamp}-${randomId}`;
      
      const exerciseToAdd = {
        ...exercise,
        id: uniqueId,
      };
      
      console.log('Adding exercise to persisted class plan:', exerciseToAdd.name, 'with ID:', uniqueId);
      addExercise(exerciseToAdd);
      
      if (showFeedback) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 1500);
      }
    } finally {
      // Allow next click after a brief delay
      setTimeout(() => {
        isAddingRef.current = false;
      }, 200);
    }
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={isAdded || isAddingRef.current}
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
