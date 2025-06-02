
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Edit, Copy, EyeOff, Eye, Check, ChevronUp, Baby } from 'lucide-react';
import { Exercise } from '@/types/reformer';

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
  observeImage, 
  isFavorite,
  isHidden,
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
      className={`relative group bg-white/80 backdrop-blur-md rounded-lg overflow-hidden shadow-sm border border-white/40 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${isHidden ? 'opacity-60' : ''} ${className}`}
      onClick={() => onSelect(exercise)}
    >
      {/* Compact image container - much smaller */}
      <div className="relative aspect-[5/3] overflow-hidden">
        {exercise.image ? (
          <img
            ref={imageRef}
            alt={exercise.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
            <img 
              src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
              alt="Default exercise"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        )}
        
        {/* Enhanced blur overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        
        {/* Status badges - smaller */}
        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
          {isHidden && (
            <Badge variant="secondary" className="text-[7px] bg-gray-600/80 text-white px-1 py-0.5 backdrop-blur-sm">
              Hidden
            </Badge>
          )}
          {isCustomized && isSystemExercise && (
            <Badge className="text-[7px] bg-orange-500/80 text-white px-1 py-0.5 backdrop-blur-sm">
              Modified
            </Badge>
          )}
          {isCustom && (
            <Badge className="text-[7px] bg-blue-500/80 text-white px-1 py-0.5 backdrop-blur-sm">
              Custom
            </Badge>
          )}
        </div>

        {/* Always visible action buttons - smaller */}
        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
          <button
            onClick={handleFavoriteClick}
            className={`w-5 h-5 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-sm ${
              isFavorite 
                ? 'bg-red-500/90 text-white scale-110' 
                : 'bg-white/70 text-gray-600 hover:bg-red-500/90 hover:text-white hover:scale-110'
            }`}
          >
            <Heart className={`h-2 w-2 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleEditClick}
            className="w-5 h-5 rounded-full bg-white/70 backdrop-blur-md text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-sage-500/90 hover:text-white hover:scale-110 shadow-sm"
          >
            <Edit className="h-2 w-2" />
          </button>

          <button
            onClick={handleDuplicateClick}
            className="w-5 h-5 rounded-full bg-white/70 backdrop-blur-md text-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-500/90 hover:text-white hover:scale-110 shadow-sm"
          >
            <Copy className="h-2 w-2" />
          </button>

          <button
            onClick={handleHideClick}
            className={`w-5 h-5 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-sm ${
              isHidden 
                ? 'bg-green-500/90 text-white' 
                : 'bg-white/70 text-gray-600 hover:bg-gray-500/90 hover:text-white hover:scale-110'
            }`}
          >
            {isHidden ? <Eye className="h-2 w-2" /> : <EyeOff className="h-2 w-2" />}
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-1.5">
          <div className="flex items-center justify-between">
            {exercise.isPregnancySafe && (
              <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-[7px] px-1 py-0.5 rounded flex items-center gap-0.5">
                <Baby className="h-1.5 w-1.5" />
                <span>Safe</span>
              </div>
            )}

            <button
              onClick={handleAddClick}
              disabled={isAdding}
              className={`ml-auto w-6 h-6 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md ${
                isAdding
                  ? 'bg-green-500/90 text-white scale-110'
                  : 'bg-sage-600/90 hover:bg-sage-700/90 text-white hover:scale-110'
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
      </div>
      
      {/* Compact content section */}
      <div className="p-2 bg-white/90 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs text-gray-900 truncate leading-tight">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-500">
              <span>{exercise.duration}min</span>
              <span>•</span>
              <span className="truncate">{exercise.category}</span>
            </div>
          </div>
          
          {/* Details toggle */}
          <button
            onClick={toggleDetails}
            className="w-4 h-4 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-sage-100 transition-all duration-200 flex-shrink-0 ml-1"
          >
            <ChevronUp className={`h-2 w-2 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Pull-up details section */}
        <div className={`overflow-hidden transition-all duration-300 ${showDetails ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-1 border-t border-gray-100 space-y-0.5">
            <div className="text-[8px] text-gray-600 space-y-0.5">
              {exercise.regressions && exercise.regressions.length > 0 && (
                <div className="flex justify-between">
                  <span>Regression:</span>
                  <span className="text-green-600 font-medium truncate ml-1">{exercise.regressions[0]}</span>
                </div>
              )}
              {exercise.progressions && exercise.progressions.length > 0 && (
                <div className="flex justify-between">
                  <span>Progression:</span>
                  <span className="text-blue-600 font-medium truncate ml-1">{exercise.progressions[0]}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Safety:</span>
                <span className={exercise.isPregnancySafe ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {exercise.isPregnancySafe ? 'Pregnancy Safe' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
