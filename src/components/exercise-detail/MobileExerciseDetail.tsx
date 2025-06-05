
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { ExerciseStatusBadge } from './ExerciseStatusBadge';
import { ExerciseActions } from './ExerciseActions';
import { ExerciseContent } from './ExerciseContent';
import { SpringVisual } from '@/components/SpringVisual';

interface MobileExerciseDetailProps {
  exercise: Exercise;
  onClose: () => void;
  onAddToClass?: (exercise: Exercise) => void;
  isAdding: boolean;
  isHidden: boolean;
  isFavorite: boolean;
  isCustomExercise: boolean;
  isModified: boolean;
  detailPrefs: any;
  preferences: any;
  onToggleHidden: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MobileExerciseDetail = ({
  exercise,
  onClose,
  onAddToClass,
  isAdding,
  isHidden,
  isFavorite,
  isCustomExercise,
  isModified,
  detailPrefs,
  preferences,
  onToggleHidden,
  onToggleFavorite,
  onDuplicate,
  onEdit,
  onDelete
}: MobileExerciseDetailProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Backdrop with sage tint */}
      <div 
        className="fixed inset-0 bg-sage-900/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Compact Bottom Sheet Modal */}
      <div className={`fixed inset-x-4 bottom-4 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-sage-500/10 animate-slide-in-bottom flex flex-col border border-sage-200 transition-all duration-300 ${
        isExpanded ? 'max-h-[60vh]' : 'max-h-[45vh]'
      }`}>
        {/* Header with Image */}
        <div className="flex-shrink-0">
          <div className="relative h-32 overflow-hidden rounded-t-2xl">
            <img 
              src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'} 
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating badges and info */}
            <div className="absolute top-2 left-2 flex gap-2">
              <ExerciseStatusBadge exercise={exercise} />
              {exercise.isPregnancySafe && (
                <span className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 px-2 py-1 rounded backdrop-blur-sm">
                  👶 Safe
                </span>
              )}
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={`absolute top-2 right-2 h-8 w-8 p-0 rounded-full backdrop-blur-sm ${
                isFavorite ? 'text-red-500 bg-red-50/80' : 'text-white bg-black/20 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>

            {/* Title and info overlay */}
            <div className="absolute bottom-2 left-2 right-2">
              <h2 className="text-lg font-bold text-white mb-1 leading-tight">
                {exercise.name}
              </h2>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <span>{exercise.duration} min</span>
                <span>•</span>
                <span className="capitalize">{exercise.difficulty}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <SpringVisual springs={exercise.springs} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Content */}
        <div className={`flex-1 p-4 space-y-3 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {/* Description */}
          <div>
            <h4 className="font-semibold text-sage-800 text-sm mb-1">Description</h4>
            <p className="text-sm text-sage-600 leading-relaxed">
              {exercise.description || "No description available"}
            </p>
          </div>

          {/* Target Muscles */}
          <div>
            <h4 className="font-semibold text-sage-800 text-sm mb-1">Target Muscles</h4>
            {exercise.muscleGroups && exercise.muscleGroups.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {exercise.muscleGroups.map((muscle, index) => (
                  <span key={index} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded">
                    {muscle}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-sage-400 italic">No target muscles specified</p>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="pt-2 border-t border-sage-100">
              <ExerciseContent 
                exercise={exercise} 
                detailPrefs={detailPrefs} 
                preferences={preferences} 
              />

              <div className="mt-4">
                <ExerciseActions
                  exercise={exercise}
                  isHidden={isHidden}
                  isFavorite={isFavorite}
                  isCustomExercise={isCustomExercise}
                  isModified={isModified}
                  onToggleHidden={onToggleHidden}
                  onToggleFavorite={onToggleFavorite}
                  onDuplicate={onDuplicate}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isMobile={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        {!isExpanded && (
          <div className="flex-shrink-0 px-4 py-2 border-t border-sage-100">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(true)}
              className="w-full h-8 text-sage-500 hover:text-sage-700 text-xs"
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              <span className="text-sage-400">More details...</span>
            </Button>
          </div>
        )}

        {/* Collapse Button when expanded */}
        {isExpanded && (
          <div className="flex-shrink-0 px-4 py-2 border-t border-sage-100">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="w-full h-8 text-sage-500 hover:text-sage-700 text-xs"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Show less
            </Button>
          </div>
        )}

        {/* Bottom action */}
        {onAddToClass && (
          <div className="flex-shrink-0 p-4 border-t border-sage-100 bg-white/95">
            <Button
              onClick={() => onAddToClass(exercise)}
              disabled={isAdding}
              className={`w-full h-12 text-base font-semibold transition-all duration-300 active:scale-[0.98] ${
                isAdding
                  ? 'bg-green-500 hover:bg-green-500'
                  : 'bg-sage-600 hover:bg-sage-700'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="h-5 w-5 mr-2 animate-bounce" />
                  Added to Class!
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Class
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
