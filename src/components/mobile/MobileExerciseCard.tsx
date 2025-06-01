
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Edit, Copy, EyeOff, Eye, Trash2, RotateCcw, Check, ChevronUp } from 'lucide-react';
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
  const [showDetails, setShowDetails] = useState(false);

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

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-md ${isHidden ? 'opacity-60' : ''} ${className}`}
      onClick={() => onSelect(exercise)}
    >
      {/* Much smaller image container */}
      <div className="relative aspect-[5/3] overflow-hidden">
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
        
        {/* Top row - status and favorite */}
        <div className="absolute top-1 left-1 right-1 flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
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
              <Badge className="text-[9px] bg-blue-500 text-white px-1 py-0">
                Custom
              </Badge>
            )}
          </div>

          <button
            onClick={handleFavoriteClick}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
              isFavorite 
                ? 'bg-white/90 text-red-500 scale-110 shadow-sm' 
                : 'bg-black/30 text-white hover:bg-white/90 hover:text-red-500 hover:scale-110'
            }`}
          >
            <Heart className={`h-2.5 w-2.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom row - safety indicator and action buttons */}
        <div className="absolute bottom-1 left-1 right-1 flex justify-between items-end">
          {exercise.isPregnancySafe && (
            <div className="bg-emerald-500 text-white text-[9px] px-1 py-0.5 rounded-md flex items-center gap-0.5">
              <span className="text-[7px]">👶</span>
              <span>Safe</span>
            </div>
          )}

          <div className="flex gap-1 ml-auto">
            <button
              onClick={handleEditClick}
              className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center transition-all duration-200 hover:bg-black/80"
            >
              <Edit className="h-2.5 w-2.5" />
            </button>

            <button
              onClick={handleDuplicateClick}
              className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center transition-all duration-200 hover:bg-black/80"
            >
              <Copy className="h-2.5 w-2.5" />
            </button>

            <button
              onClick={(e) => onToggleHidden(e)}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                isHidden 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-black/60 hover:bg-black/80 text-white'
              }`}
            >
              {isHidden ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Compact exercise info */}
      <div className="p-1.5 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[10px] text-gray-900 truncate leading-tight">
              {exercise.name}
            </h3>
            <p className="text-[9px] text-gray-500 mt-0.5">
              {exercise.duration}min • {exercise.category}
            </p>
          </div>
          
          {/* Compact buttons row */}
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={toggleDetails}
              className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all duration-200"
            >
              <ChevronUp className={`h-2.5 w-2.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={handleAddClick}
              disabled={isAdding}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 ${
                isAdding
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-110'
              }`}
            >
              {isAdding ? (
                <Check className="h-2.5 w-2.5 animate-bounce" />
              ) : (
                <Plus className="h-2.5 w-2.5" />
              )}
            </button>
          </div>
        </div>

        {/* Pull-up details section */}
        {showDetails && (
          <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
            <div className="text-[9px] text-gray-600">
              <div className="flex justify-between">
                <span>Regression:</span>
                <span className="text-green-600">{exercise.regression || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Progression:</span>
                <span className="text-blue-600">{exercise.progression || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Safety:</span>
                <span className={exercise.isPregnancySafe ? 'text-green-600' : 'text-gray-500'}>
                  {exercise.isPregnancySafe ? 'Pregnancy Safe' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action dialogs */}
      {isCustomized && isSystemExercise && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="hidden">Reset</button>
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
            <button className="hidden">Delete</button>
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
  );
};
