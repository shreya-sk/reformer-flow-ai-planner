
import { Button } from '@/components/ui/button';
import { Plus, Check, Heart } from 'lucide-react';
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
  isCustomized: boolean;
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
  isCustomized,
  detailPrefs,
  preferences,
  onToggleHidden,
  onToggleFavorite,
  onDuplicate,
  onEdit,
  onDelete
}: MobileExerciseDetailProps) => {
  return (
    <>
      {/* Backdrop with sage tint */}
      <div 
        className="fixed inset-0 bg-sage-900/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl shadow-sage-500/10 animate-slide-in-bottom max-h-[85vh] flex flex-col border-t border-sage-200">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-sage-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-sage-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <ExerciseStatusBadge exercise={exercise} />
                {exercise.isPregnancySafe && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 px-2 py-1 rounded">
                    👶 Safe
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-sage-900 leading-tight">
                {exercise.name}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-sage-600">
                <div className="flex items-center gap-1">
                  <span>{exercise.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Springs:</span>
                  <SpringVisual springs={exercise.springs} />
                </div>
              </div>
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={`h-10 w-10 p-0 rounded-full ${
                isFavorite ? 'text-red-500 bg-red-50' : 'text-sage-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Exercise image */}
          {exercise.image && (
            <div className="w-full h-48 bg-sage-50">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            <ExerciseContent 
              exercise={exercise} 
              detailPrefs={detailPrefs} 
              preferences={preferences} 
            />

            <ExerciseActions
              exercise={exercise}
              isHidden={isHidden}
              isFavorite={isFavorite}
              isCustomExercise={isCustomExercise}
              isCustomized={isCustomized}
              onToggleHidden={onToggleHidden}
              onToggleFavorite={onToggleFavorite}
              onDuplicate={onDuplicate}
              onEdit={onEdit}
              onDelete={onDelete}
              isMobile={true}
            />
          </div>
        </div>

        {/* Bottom action */}
        {onAddToClass && (
          <div className="flex-shrink-0 p-6 border-t border-sage-100 bg-white/95">
            <Button
              onClick={() => onAddToClass(exercise)}
              disabled={isAdding}
              className={`w-full h-14 text-lg font-semibold transition-all duration-300 active:scale-[0.98] ${
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
