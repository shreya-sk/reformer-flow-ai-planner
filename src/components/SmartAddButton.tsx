
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, Heart } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface SmartAddButtonProps {
  exercise: Exercise;
  onAddExercise: (exercise: Exercise) => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showPregnancyIcon?: boolean;
  showFavoriteButton?: boolean;
}

export const SmartAddButton = ({ 
  exercise, 
  onAddExercise, 
  className = '',
  size = 'sm',
  showPregnancyIcon = false,
  showFavoriteButton = false
}: SmartAddButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  
  const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;

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

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteExercise(exercise.id);
  };

  return (
    <div className="flex items-center gap-2">
      {showFavoriteButton && (
        <Button
          onClick={handleFavorite}
          size={size}
          variant="ghost"
          className={`${
            isFavorite 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      )}
      
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
          <div className="absolute -top-1 -right-1 bg-pink-100 rounded-full p-1">
            <svg className="h-3 w-3 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.91 1.47 2.09 2.66 2.09 4.16v1c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-1c0-1.5 1.18-2.69 2.09-4.16.91-1.47 1.41-3.1 1.41-4.84 0-3.87-3.13-7-7-7zm-1 15h2v1h-2v-1zm0-2h2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
