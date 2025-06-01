
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Heart, Edit, Copy, EyeOff, Eye, Trash2, Play, Plus, Check, X, Baby } from 'lucide-react';
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
  const [showMoreDetails, setShowMoreDetails] = useState(false);
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
    
    setIsAdding(true);
    
    try {
      onAddToClass(exercise);
      
      toast({
        title: "Added to class",
        description: `"${exercise.name}" has been added to your class plan.`,
      });
      
      setTimeout(() => {
        setIsAdding(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error adding to class:', error);
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Compact Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-h-[80vh] flex flex-col border border-sage-200/50 animate-scale-in">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-black/10 text-gray-600 hover:bg-black/20 w-8 h-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Compact Header with Image */}
        <div className="relative">
          <div className="h-48 overflow-hidden rounded-t-3xl">
            <img 
              src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'} 
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          {/* Floating badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={`text-xs text-white ${status.color} backdrop-blur-sm`}>
              {status.label}
            </Badge>
            {exercise.isPregnancySafe && (
              <Badge className="text-xs bg-emerald-500/90 text-white backdrop-blur-sm">
                <Baby className="h-3 w-3 mr-1" />
                Safe
              </Badge>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white mb-2 leading-tight">
              {exercise.name}
            </h2>
            <div className="flex items-center gap-3 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{exercise.duration} min</span>
              </div>
              <span>•</span>
              <span>{exercise.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <SpringVisual springs={exercise.springs} />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Actions Row */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className={`flex-1 h-10 ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleHidden}
              className="flex-1 h-10"
            >
              {isHidden ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {isHidden ? 'Unhide' : 'Hide'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="flex-1 h-10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          {/* Description */}
          {exercise.description && (
            <Card className="border-sage-200/50">
              <CardContent className="p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {exercise.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* More Details Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="w-full h-10 text-sage-600 hover:bg-sage-50"
          >
            {showMoreDetails ? 'Show Less' : 'Show More Details'}
          </Button>

          {/* Extended Details */}
          {showMoreDetails && (
            <div className="space-y-3">
              {exercise.cues && exercise.cues.length > 0 && (
                <Card className="border-sage-200/50">
                  <CardContent className="p-3">
                    <h4 className="font-semibold mb-2 text-sage-800 text-sm">Teaching Cues</h4>
                    <div className="space-y-2">
                      {exercise.cues.slice(0, 3).map((cue, index) => (
                        <div key={index} className="flex gap-2 text-xs">
                          <div className="w-4 h-4 rounded-full bg-sage-100 flex items-center justify-center text-[10px] font-bold text-sage-700 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{cue}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              <Card className="border-sage-200/50">
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Level:</span>
                      <span className="ml-1 font-medium capitalize">{exercise.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 font-medium">{exercise.category}</span>
                    </div>
                    {exercise.regressions && exercise.regressions.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Regression:</span>
                        <span className="ml-1 font-medium text-green-600">{exercise.regressions[0]}</span>
                      </div>
                    )}
                    {exercise.progressions && exercise.progressions.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Progression:</span>
                        <span className="ml-1 font-medium text-blue-600">{exercise.progressions[0]}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete button for custom exercises */}
          {isCustom && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-10 text-red-600 border-red-200 hover:bg-red-50"
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
          )}
        </div>

        {/* Bottom Action - Add to Class */}
        {onAddToClass && (
          <div className="flex-shrink-0 p-4 border-t border-sage-100 bg-white/95">
            <Button
              onClick={handleAddToClass}
              disabled={isAdding}
              className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                isAdding
                  ? 'bg-green-500 hover:bg-green-500'
                  : 'bg-sage-600 hover:bg-sage-700'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="h-5 w-5 mr-2 animate-bounce" />
                  Added!
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
