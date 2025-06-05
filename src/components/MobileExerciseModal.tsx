import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Heart, Edit, Copy, EyeOff, Eye, Trash2, Plus, Check, X, Baby, AlertTriangle, Target, Zap, Shield } from 'lucide-react';
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
  const [showAllDetails, setShowAllDetails] = useState(false);
  const { preferences, toggleFavoriteExercise, toggleHiddenExercise } = useUserPreferences();
  const { duplicateExercise, deleteUserExercise } = useExercises();

  if (!exercise || !isOpen) return null;

  const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;
  const isHidden = preferences.hiddenExercises?.includes(exercise.id) || false;
  const isCustom = exercise.isCustom || false;
  const isSystemExercise = exercise.isSystemExercise || false;
  const isModified = exercise.isModified || false;

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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(exercise);
    }
  };

  const getExerciseStatus = () => {
    if (isCustom) return { label: 'Custom', color: 'bg-blue-500' };
    if (isModified) return { label: 'Modified', color: 'bg-orange-500' };
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
      
      {/* Enhanced Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-h-[85vh] flex flex-col border border-sage-200/50 animate-scale-in">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-black/10 text-gray-600 hover:bg-black/20 w-8 h-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header with Image */}
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
              <span className="capitalize">{exercise.category}</span>
              <span>•</span>
              <span className="capitalize">{exercise.difficulty}</span>
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
              onClick={handleEdit}
              className="flex-1 h-10"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
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

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Muscle Groups */}
            {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
              <Card className="border-blue-200/50 bg-blue-50/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 text-sm">Target Areas</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.slice(0, 4).map((muscle, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
                        {muscle}
                      </Badge>
                    ))}
                    {exercise.muscleGroups.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-white border-blue-200 text-blue-700">
                        +{exercise.muscleGroups.length - 4}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teaching Focus */}
            {exercise.teachingFocus && exercise.teachingFocus.length > 0 && (
              <Card className="border-purple-200/50 bg-purple-50/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-purple-800 text-sm">Teaching Focus</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.teachingFocus.slice(0, 3).map((focus, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white border-purple-200 text-purple-700">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Safety Information */}
          {exercise.contraindications && exercise.contraindications.length > 0 && (
            <Card className="border-red-200/50 bg-red-50/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h4 className="font-semibold text-red-800 text-sm">Safety Notes</h4>
                </div>
                <ul className="text-xs text-red-700 space-y-1">
                  {exercise.contraindications.slice(0, 3).map((contra, index) => (
                    <li key={index}>• {contra}</li>
                  ))}
                  {exercise.contraindications.length > 3 && (
                    <li className="text-red-600 font-medium">
                      +{exercise.contraindications.length - 3} more contraindications
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Teaching Cues */}
          {exercise.cues && exercise.cues.length > 0 && (
            <Card className="border-green-200/50 bg-green-50/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-800 text-sm">Teaching Cues</h4>
                </div>
                <div className="space-y-2">
                  {exercise.cues.slice(0, showAllDetails ? exercise.cues.length : 2).map((cue, index) => (
                    <div key={index} className="flex gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-700 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-green-700 leading-relaxed">{cue}</p>
                    </div>
                  ))}
                  {exercise.cues.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllDetails(!showAllDetails)}
                      className="text-green-600 h-6 text-xs"
                    >
                      {showAllDetails ? 'Show Less' : `Show ${exercise.cues.length - 2} More Cues`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progressions & Regressions */}
          {((exercise.progressions && exercise.progressions.length > 0) || 
            (exercise.regressions && exercise.regressions.length > 0)) && (
            <div className="grid grid-cols-2 gap-3">
              {exercise.regressions && exercise.regressions.length > 0 && (
                <Card className="border-green-200/50">
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-green-800 text-sm mb-2">Regressions</h4>
                    <ul className="text-xs text-green-700 space-y-1">
                      {exercise.regressions.slice(0, 2).map((reg, index) => (
                        <li key={index}>• {reg}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {exercise.progressions && exercise.progressions.length > 0 && (
                <Card className="border-blue-200/50">
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-blue-800 text-sm mb-2">Progressions</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {exercise.progressions.slice(0, 2).map((prog, index) => (
                        <li key={index}>• {prog}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Modifications */}
          {exercise.modifications && exercise.modifications.length > 0 && (
            <Card className="border-orange-200/50">
              <CardContent className="p-3">
                <h4 className="font-semibold text-orange-800 text-sm mb-2">Modifications</h4>
                <ul className="text-xs text-orange-700 space-y-1">
                  {exercise.modifications.slice(0, 3).map((mod, index) => (
                    <li key={index}>• {mod}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="border-sage-200/50">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {exercise.setup && (
                  <div className="col-span-2">
                    <span className="text-gray-500 font-medium">Setup:</span>
                    <p className="text-gray-700 mt-1">{exercise.setup}</p>
                  </div>
                )}
                {exercise.repsOrDuration && (
                  <div>
                    <span className="text-gray-500">Reps/Duration:</span>
                    <span className="ml-1 font-medium">{exercise.repsOrDuration}</span>
                  </div>
                )}
                {exercise.tempo && (
                  <div>
                    <span className="text-gray-500">Tempo:</span>
                    <span className="ml-1 font-medium">{exercise.tempo}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
