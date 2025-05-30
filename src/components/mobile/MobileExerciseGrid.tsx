
import { Search } from 'lucide-react';
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
  darkMode
}: MobileExerciseGridProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="grid grid-cols-2 gap-3">
        {exercises.map((exercise) => (
          <MobileExerciseCard
            key={exercise.id}
            exercise={exercise}
            onSelect={onExerciseSelect}
            onAddToClass={onAddToClass}
            onToggleFavorite={onToggleFavorite}
            onToggleHidden={onToggleHidden}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onResetToOriginal={onResetToOriginal}
            observeImage={observeImage}
            isFavorite={favoriteExercises?.includes(exercise.id) || false}
            isHidden={hiddenExercises?.includes(exercise.id) || false}
            darkMode={darkMode}
          />
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {showHidden ? 'No hidden exercises' : 'No exercises found'}
          </h3>
          <p className="text-gray-500 text-sm">
            {showHidden 
              ? 'You haven\'t hidden any exercises yet.'
              : 'Try adjusting your search or filters'
            }
          </p>
        </div>
      )}
    </div>
  );
};
