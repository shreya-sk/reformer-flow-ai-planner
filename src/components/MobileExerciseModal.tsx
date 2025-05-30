
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Heart, Edit, Copy, EyeOff, Eye, Trash2, Play, Plus, Check } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { toast } from '@/hooks/use-toast';

interface MobileExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToClass?: (exercise: Exercise) => void;
  onEdit?: (exercise: Exercise) => void;
}

export const MobileExerciseModal = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onAddToClass,
  onEdit
}: MobileExerciseModalProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { duplicateExercise, deleteUserExercise } = useExercises();

  if (!exercise || !isOpen) return null;

  const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;
  const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
  const isCustom = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isCustomized = exercise.isCustomized || false;

  const handleAddToClass = async () => {
    if (!onAddToClass || isAdding) return;
    
    console.log('🔵 MobileExerciseModal handleAddToClass called with:', exercise);
    setIsAdding(true);
    
    try {
      onAddToClass(exercise);
      
      // Show success animation and toast
      toast({
        title: "Added to class",
        description: `"${exercise.name}" has been added to your class plan.`,
      });
      
      setTimeout(() => {
        setIsAdding(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('🔴 Error in MobileExerciseModal handleAddToClass:', error);
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteExercise(exercise.id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `"${exercise.name}" ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const handleToggleHidden = () => {
    toggleHiddenExercise(exercise.id);
    toast({
      title: isHidden ? "Exercise unhidden" : "Exercise hidden",
      description: isHidden 
        ? `"${exercise.name}" is now visible in your library.`
        : `"${exercise.name}" has been hidden from your library.`,
    });
  };

  const handleDuplicate = async () => {
    try {
      await duplicateExercise(exercise);
      toast({
        title: "Exercise duplicated",
        description: `"${exercise.name} (Copy)" has been created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate exercise.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!isCustom) return;
    
    try {
      await deleteUserExercise(exercise.id);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exercise.",
        variant: "destructive",
      });
    }
  };

  const getExerciseStatus = () => {
    if (isCustom) return { label: 'Custom', color: 'bg-blue-500' };
    if (isCustomized) return { label: 'Modified', color: 'bg-orange-500' };
    if (isSystemExercise) return { label: 'System', color: 'bg-gray-500' };
    return { label: 'Exercise', color: 'bg-gray-500' };
  };

  const status = getExerciseStatus();

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
                <Badge className={`text-xs text-white ${status.color}`}>
                  {status.label}
                </Badge>
                {exercise.isPregnancySafe && (
                  <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                    👶 Safe
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-sage-900 leading-tight">
                {exercise.name}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-sage-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
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
              onClick={handleToggleFavorite}
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
            {/* Description */}
            {exercise.description && (
              <Card className="border-sage-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-sage-900">Description</h3>
                  <p className="text-sm text-sage-700 leading-relaxed">
                    {exercise.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Teaching cues */}
            {exercise.cues && exercise.cues.length > 0 && (
              <Card className="border-sage-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-sage-900">Teaching Cues</h3>
                  <div className="space-y-2">
                    {exercise.cues.map((cue, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-700 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-sage-700 leading-relaxed">
                          {cue}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {exercise.notes && (
              <Card className="border-sage-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-sage-900">Notes</h3>
                  <p className="text-sm text-sage-700 leading-relaxed">
                    {exercise.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action buttons grid */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleToggleHidden}
                className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
              >
                {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{isHidden ? 'Unhide' : 'Hide'}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleDuplicate}
                className="h-12 flex items-center justify-center gap-2 border-sage-200 hover:bg-sage-50 active:scale-[0.98] transition-transform duration-75"
              >
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </Button>

              {(isCustom || isCustomized) && onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(exercise)}
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

              {isCustom && (
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
                          onClick={handleDelete}
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
          </div>
        </div>

        {/* Bottom action */}
        {onAddToClass && (
          <div className="flex-shrink-0 p-6 border-t border-sage-100 bg-white/95">
            <Button
              onClick={handleAddToClass}
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
