
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Edit, Copy, EyeOff, Eye, Trash2, RotateCcw, Check, Baby } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MobileExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
  onAddToClass: (exercise: Exercise) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onResetToOriginal: (e: React.MouseEvent) => void;
  observeImage: (element: HTMLImageElement, src: string) => void;
  isFavorite: boolean;
  isHidden: boolean;
  darkMode: boolean;
  className?: string;
}

export const MobileExerciseCard = ({ 
  exercise, 
  onSelect, 
  onAddToClass, 
  onToggleFavorite,
  onToggleHidden,
  onEdit,
  onDuplicate,
  onDelete,
  onResetToOriginal,
  observeImage, 
  isFavorite,
  isHidden,
  darkMode,
  className = ''
}: MobileExerciseCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isAdding, setIsAdding] = useState(false);

  const isCustom = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isCustomized = exercise.isCustomized || false;

  useEffect(() => {
    if (imageRef.current && exercise.image) {
      observeImage(imageRef.current, exercise.image);
    }
  }, [exercise.image, observeImage]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    
    setIsAdding(true);
    onAddToClass(exercise);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(e);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(e);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate(e);
  };

  return (
    <div 
      className={`bg-white/90 backdrop-blur-xl rounded-lg overflow-hidden shadow-sm border border-sage-200/50 cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-md ${isHidden ? 'opacity-60' : ''} ${className}`}
      onClick={() => onSelect(exercise)}
    >
      {/* Image container - much smaller aspect ratio */}
      <div className="relative aspect-[5/3] overflow-hidden">
        {exercise.image ? (
          <img
            ref={imageRef}
            alt={exercise.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
            <img 
              src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
              alt="Default exercise"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        
        {/* Status indicators - top left */}
        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
          {isHidden && (
            <Badge variant="secondary" className="text-[9px] bg-gray-500 text-white px-1 py-0">
              Hidden
            </Badge>
          )}
          {isCustomized && isSystemExercise && (
            <Badge className="text-[9px] bg-orange-500 text-white px-1 py-0">
              Modified
            </Badge>
          )}
          {isCustom && (
            <Badge className="text-[9px] bg-sage-600 text-white px-1 py-0">
              Custom
            </Badge>
          )}
        </div>

        {/* Pregnancy safe indicator - top right */}
        {exercise.isPregnancySafe && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Baby className="h-2.5 w-2.5 text-white" />
          </div>
        )}

        {/* Action buttons overlay - bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
          <div className="flex items-center justify-between">
            {/* Left side actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleFavoriteClick}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-white/90 text-red-500' 
                    : 'bg-black/30 text-white hover:bg-white/90 hover:text-red-500'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleEditClick}
                className="w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-white/90 hover:text-sage-700 transition-all duration-200"
                aria-label="Edit exercise"
              >
                <Edit className="h-3 w-3" />
              </button>

              <button
                onClick={handleDuplicateClick}
                className="w-6 h-6 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-white/90 hover:text-sage-700 transition-all duration-200"
                aria-label="Duplicate exercise"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>

            {/* Add button - right side */}
            <button
              onClick={handleAddClick}
              disabled={isAdding}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 ${
                isAdding
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-110'
              }`}
            >
              {isAdding ? (
                <Check className="h-3.5 w-3.5 animate-bounce" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Exercise info - more compact */}
      <div className="p-2 bg-white/95">
        <h3 className="font-semibold text-xs text-sage-800 truncate mb-0.5">
          {exercise.name}
        </h3>
        <p className="text-[10px] text-sage-500">
          {exercise.duration}min • {exercise.category}
        </p>
      </div>
    </div>
  );
};
