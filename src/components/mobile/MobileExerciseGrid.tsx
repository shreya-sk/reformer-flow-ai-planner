
import { memo } from 'react';
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
  onCustomizeSystemExercise?: (exercise: Exercise, e: React.MouseEvent) => void;
  observeImage: (element: HTMLElement) => void;
  favoriteExercises: string[];
  hiddenExercises: string[];
  darkMode: boolean;
  feedbackState: {[key: string]: 'success' | 'error' | null};
}

export const MobileExerciseGrid = memo(({
  exercises,
  showHidden,
  onExerciseSelect,
  onAddToClass,
  onToggleFavorite,
  onToggleHidden,
  onEdit,
  onDuplicate,
  onDelete,
  onCustomizeSystemExercise,
  observeImage,
  favoriteExercises,
  hiddenExercises,
  darkMode,
  feedbackState
}: MobileExerciseGridProps) => {
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <div className="text-4xl mb-4">🏋️‍♀️</div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No exercises found</h3>
        <p className="text-gray-600 text-sm">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {exercises.map((exercise) => (
        <MobileExerciseCard
          key={exercise.id}
          exercise={exercise}
          isFavorite={favoriteExercises.includes(exercise.id)}
          isHidden={hiddenExercises.includes(exercise.id)}
          darkMode={darkMode}
          feedbackState={feedbackState[exercise.id]}
          onSelect={() => onExerciseSelect(exercise)}
          onAddToClass={() => onAddToClass(exercise)}
          onToggleFavorite={(e) => onToggleFavorite(exercise.id, e)}
          onToggleHidden={(e) => onToggleHidden(exercise.id, e)}
          onEdit={(e) => onEdit(exercise, e)}
          onDuplicate={(e) => onDuplicate(exercise, e)}
          onDelete={(e) => onDelete(exercise, e)}
          onCustomizeSystemExercise={onCustomizeSystemExercise ? (e) => onCustomizeSystemExercise(exercise, e) : undefined}
          observeImage={observeImage}
        />
      ))}
    </div>
  );
});

MobileExerciseGrid.displayName = 'MobileExerciseGrid';
