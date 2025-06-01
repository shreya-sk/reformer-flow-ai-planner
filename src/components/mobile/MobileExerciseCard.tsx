
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Edit, Copy, EyeOff, Eye, Trash2, RotateCcw, Check } from 'lucide-react';
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
  const [showActions, setShowActions] = useState(false);

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

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(e);
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-md ${isHidden ? 'opacity-60' : ''} ${className}`}
      onClick={() => onSelect(exercise)}
    >
      {/* Compact Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {exercise.image ? (
          <img
            ref={imageRef}
            alt={exercise.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <img 
              src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
              alt="Default exercise"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        
        {/* Compact status indicators */}
        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
          {isHidden && (
            <Badge variant="secondary" className="text-[10px] bg-gray-500 text-white px-1 py-0">
              Hidden
            </Badge>
          )}
          {isCustomized && isSystemExercise && (
            <Badge className="text-[10px] bg-orange-500 text-white px-1 py-0">
              Modified
            </Badge>
          )}
          {isCustom && (
            <Badge className="text-[10px] bg-blue-500 text-white px-1 py-0">
              Custom
            </Badge>
          )}
        </div>

        {/* Compact favorite heart */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite 
              ? 'bg-white/90 text-red-500 scale-110 shadow-sm' 
              : 'bg-black/30 text-white hover:bg-white/90 hover:text-red-500 hover:scale-110'
          }`}
        >
          <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Compact pregnancy safe indicator */}
        {exercise.isPregnancySafe && (
          <div className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[10px] px-1 py-0.5 rounded-md flex items-center gap-0.5">
            <span className="text-[8px]">👶</span>
            <span>Safe</span>
          </div>
        )}

        {/* Compact action menu button */}
        <button
          onClick={toggleActions}
          className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center transition-all duration-200 hover:bg-black/80"
        >
          <Edit className="h-3 w-3" />
        </button>

        {/* Compact action menu overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg p-2 flex gap-1 shadow-lg">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(e);
                }}
                className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              >
                <Edit className="h-3 w-3" />
              </button>

              <button
                onClick={(e) => onDuplicate(e)}
                className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              >
                <Copy className="h-3 w-3" />
              </button>

              <button
                onClick={(e) => onToggleHidden(e)}
                className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  isHidden 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>

              {isCustomized && isSystemExercise && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-7 h-7 rounded-md bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700">
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset to Original</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reset "{exercise.name}" to its original system version? All your customizations will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={(e) => onResetToOriginal(e)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {isCustom && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-7 h-7 rounded-md bg-red-600 text-white flex items-center justify-center hover:bg-red-700">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete "{exercise.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={(e) => onDelete(e)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Compact exercise info */}
      <div className="p-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs text-gray-900 truncate leading-tight">
              {exercise.name}
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {exercise.duration}min • {exercise.category}
            </p>
          </div>
          
          {/* Compact add button */}
          <button
            onClick={handleAddClick}
            disabled={isAdding}
            className={`ml-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 ${
              isAdding
                ? 'bg-green-500 text-white scale-110'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-110'
            }`}
          >
            {isAdding ? (
              <Check className="h-3 w-3 animate-bounce" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
