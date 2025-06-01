
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Edit, Copy, EyeOff, Eye, Trash2, Check, ChevronUp, Baby } from 'lucide-react';
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

  const handleHideClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleHidden(e);
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <div 
      className={`relative group bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isHidden ? 'opacity-60' : ''} ${className}`}
      onClick={() => onSelect(exercise)}
    >
      {/* Compact image container - e-commerce style */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {exercise.image ? (
          <img
            ref={imageRef}
            alt={exercise.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        
        {/* Top status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isHidden && (
            <Badge variant="secondary" className="text-[8px] bg-gray-600/90 text-white px-1.5 py-0.5 backdrop-blur-sm">
              Hidden
            </Badge>
          )}
          {isCustomized && isSystemExercise && (
            <Badge className="text-[8px] bg-orange-500/90 text-white px-1.5 py-0.5 backdrop-blur-sm">
              Modified
            </Badge>
          )}
          {isCustom && (
            <Badge className="text-[8px] bg-blue-500/90 text-white px-1.5 py-0.5 backdrop-blur-sm">
              Custom
            </Badge>
          )}
        </div>

        {/* Floating action buttons - e-commerce style */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavoriteClick}
            className={`w-7 h-7 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              isFavorite 
                ? 'bg-red-500/90 text-white scale-110' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500/90 hover:text-white hover:scale-110'
            }`}
          >
            <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleEditClick}
            className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-xl text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-sage-500/90 hover:text-white hover:scale-110 shadow-sm"
          >
            <Edit className="h-3 w-3" />
          </button>

          <button
            onClick={handleDuplicateClick}
            className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-xl text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-500/90 hover:text-white hover:scale-110 shadow-sm"
          >
            <Copy className="h-3 w-3" />
          </button>

          <button
            onClick={handleHideClick}
            className={`w-7 h-7 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              isHidden 
                ? 'bg-green-500/90 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-gray-500/90 hover:text-white hover:scale-110'
            }`}
          >
            {isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex items-center justify-between">
            {exercise.isPregnancySafe && (
              <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] px-1.5 py-1 rounded-lg flex items-center gap-1">
                <Baby className="h-2.5 w-2.5" />
                <span>Safe</span>
              </div>
            )}

            <button
              onClick={handleAddClick}
              disabled={isAdding}
              className={`ml-auto w-8 h-8 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isAdding
                  ? 'bg-green-500/90 text-white scale-110'
                  : 'bg-sage-600/90 hover:bg-sage-700/90 text-white hover:scale-110'
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
      
      {/* Compact content section */}
      <div className="p-3 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate leading-tight">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>{exercise.duration}min</span>
              <span>•</span>
              <span>{exercise.category}</span>
            </div>
          </div>
          
          {/* Details toggle */}
          <button
            onClick={toggleDetails}
            className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-sage-100 transition-all duration-200"
          >
            <ChevronUp className={`h-3 w-3 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Pull-up details section with smooth animation */}
        <div className={`overflow-hidden transition-all duration-300 ${showDetails ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <div className="text-[10px] text-gray-600 space-y-1">
              {exercise.regressions && exercise.regressions.length > 0 && (
                <div className="flex justify-between">
                  <span>Regression:</span>
                  <span className="text-green-600 font-medium">{exercise.regressions[0]}</span>
                </div>
              )}
              {exercise.progressions && exercise.progressions.length > 0 && (
                <div className="flex justify-between">
                  <span>Progression:</span>
                  <span className="text-blue-600 font-medium">{exercise.progressions[0]}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Safety:</span>
                <span className={exercise.isPregnancySafe ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {exercise.isPregnancySafe ? 'Pregnancy Safe' : 'Standard'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="text-gray-700 font-medium capitalize">{exercise.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action dialogs remain hidden but functional */}
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
