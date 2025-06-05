
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Copy, Edit, Eye, EyeOff, Heart, Play, Trash2 } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface ExerciseActionsProps {
  exercise: Exercise;
  isHidden: boolean;
  isFavorite: boolean;
  isCustomExercise: boolean;
  isModified: boolean;
  onToggleHidden: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isMobile?: boolean;
}

export const ExerciseActions = ({
  exercise,
  isHidden,
  isFavorite,
  isCustomExercise,
  isModified,
  onToggleHidden,
  onToggleFavorite,
  onDuplicate,
  onEdit,
  onDelete,
  isMobile = false
}: ExerciseActionsProps) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onToggleHidden}
          className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
        >
          {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          <span>{isHidden ? 'Unhide' : 'Hide'}</span>
        </Button>

        <Button
          variant="outline"
          onClick={onDuplicate}
          className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
        >
          <Copy className="h-4 w-4" />
          <span>Duplicate</span>
        </Button>

        {(isCustomExercise || isModified) && onEdit && (
          <Button
            variant="outline"
            onClick={onEdit}
            className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        )}

        {exercise.videoUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(exercise.videoUrl, '_blank')}
            className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
          >
            <Play className="h-4 w-4" />
            <span>Video</span>
          </Button>
        )}

        {isCustomExercise && onDelete && (
          <div className="col-span-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 active:scale-[0.98] transition-transform duration-75"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Exercise
                </Button>
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
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={onToggleHidden}
        size="sm"
        variant="ghost"
        className={`${isHidden ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}
      >
        {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>

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

      {(isCustomExercise || isModified) && onEdit && (
        <Button 
          onClick={onEdit}
          size="sm"
          className="bg-sage-600 hover:bg-sage-700 text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}

      {exercise.videoUrl && (
        <Button 
          onClick={() => window.open(exercise.videoUrl, '_blank')}
          variant="outline"
          className="h-12 border-sage-300 hover:bg-sage-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Watch Video</span>
          <span className="sm:hidden">Video</span>
        </Button>
      )}
    </div>
  );
};
