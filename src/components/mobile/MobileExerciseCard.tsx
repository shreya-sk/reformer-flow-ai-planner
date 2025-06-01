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
    
    // Reset button after animation
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
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-lg ${isHidden ? 'opacity-60' : ''} ${className}`}
      onClick={() => onSelect(exercise)}
    >
      {/* Image container with overlay elements */}
      <div className="relative aspect-square overflow-hidden">
        {/* Exercise image */}
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
        
        {/* Status indicators - top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isHidden && (
            <Badge variant="secondary" className="text-xs bg-gray-500 text-white">
              Hidden
            </Badge>
          )}
          {isCustomized && isSystemExercise && (
            <Badge className="text-xs bg-orange-500 text-white">
              Modified
            </Badge>
          )}
          {isCustom && (
            <Badge className="text-xs bg-blue-500 text-white">
              Custom
            </Badge>
          )}
        </div>

        {/* Favorite heart - top right */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite 
              ? 'bg-white/90 text-red-500 scale-110 shadow-md' 
              : 'bg-black/30 text-white hover:bg-white/90 hover:text-red-500 hover:scale-110'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Pregnancy safe indicator */}
        {exercise.isPregnancySafe && (
          <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-[10px]">👶</span>
            <span>Safe</span>
          </div>
        )}

        {/* Action menu button - bottom right */}
        <button
          onClick={toggleActions}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center transition-all duration-200 hover:bg-black/80"
        >
          <Edit className="h-4 w-4" />
        </button>

        {/* Action menu overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white rounded-xl p-3 flex gap-2 shadow-lg">
              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(e);
                }}
                className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
              </button>

              {/* Duplicate button */}
              <button
                onClick={(e) => onDuplicate(e)}
                className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              >
                <Copy className="h-4 w-4" />
              </button>

              {/* Hide/Show button */}
              <button
                onClick={(e) => onToggleHidden(e)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isHidden 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>

              {/* Reset button for modified system exercises */}
              {isCustomized && isSystemExercise && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700">
                      <RotateCcw className="h-4 w-4" />
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

              {/* Delete button for custom exercises */}
              {isCustom && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700">
                      <Trash2 className="h-4 w-4" />
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
      
      {/* Exercise info */}
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {exercise.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {exercise.duration}min • {exercise.category}
            </p>
          </div>
          
          {/* Add button with enhanced animation */}
          <button
            onClick={handleAddClick}
            disabled={isAdding}
            className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 ${
              isAdding
                ? 'bg-green-500 text-white scale-110'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-110'
            }`}
          >
            {isAdding ? (
              <Check className="h-4 w-4 animate-bounce" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
