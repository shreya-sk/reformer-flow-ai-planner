import { Search, Dumbbell } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { MobileExerciseCard } from './MobileExerciseCard';

interface MobileExerciseGridProps {
  exercises: Exercise[];
  showHidden: boolean;
  onExerciseSelect: (exercise: Exercise) => void;
  onAddToClass: (exercise: Exercise) => void;
  onToggleFavorite: (exerciseId: string, e: React.MouseEvent) => void;
  onToggleHidden: (exerciseId: string, e: React.MouseEvent) => void;
  onEdit: (exercise: Exercise, e: React.MouseEvent) => void;
  onDuplicate: (exercise: Exercise, e: React.MouseEvent) => void;
  onDelete: (exercise: Exercise, e: React.MouseEvent) => void;
  onResetToOriginal: (exercise: Exercise, e: React.MouseEvent) => void;
  observeImage: (element: HTMLImageElement, src: string) => void;
  favoriteExercises: string[];
  hiddenExercises: string[];
  darkMode: boolean;
  feedbackState?: {[key: string]: 'success' | 'error' | null};
}

export const MobileExerciseGrid = ({
  exercises,
  showHidden,
  onExerciseSelect,
  onAddToClass,
  onToggleFavorite,
  onToggleHidden,
  onEdit,
  onDuplicate,
  onDelete,
  onResetToOriginal,
  observeImage,
  favoriteExercises,
  hiddenExercises,
  darkMode,
  feedbackState = {}
}: MobileExerciseGridProps) => {
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto">
            <Dumbbell className="h-8 w-8 text-sage-400" />
          </div>
          <h3 className="text-lg font-medium text-sage-800">No exercises found</h3>
          <p className="text-sage-600 max-w-sm">
            Try adjusting your search terms or filters to find exercises.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-4">
      {exercises.map((exercise) => {
        const feedback = feedbackState[exercise.id];
        const cardClassName = `transition-all duration-200 ${
          feedback === 'success' ? 'ring-2 ring-green-500 bg-green-50' :
          feedback === 'error' ? 'ring-2 ring-red-500 bg-red-50' :
          'hover:shadow-md'
        }`;
        
        return (
          <MobileExerciseCard
            key={exercise.id}
            exercise={exercise}
            isFavorite={favoriteExercises.includes(exercise.id)}
            isHidden={hiddenExercises.includes(exercise.id)}
            showHidden={showHidden}
            darkMode={darkMode}
            onSelect={() => onExerciseSelect(exercise)}
            onAddToClass={() => onAddToClass(exercise)}
            onToggleFavorite={(e) => onToggleFavorite(exercise.id, e)}
            onToggleHidden={(e) => onToggleHidden(exercise.id, e)}
            onEdit={(e) => onEdit(exercise, e)}
            onDuplicate={(e) => onDuplicate(exercise, e)}
            onDelete={(e) => onDelete(exercise, e)}
            onResetToOriginal={(e) => onResetToOriginal(exercise, e)}
            observeImage={observeImage}
            className={cardClassName}
          />
        );
      })}
    </div>
  );
};
