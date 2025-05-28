
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Clock, GripVertical, BookOpen, Plus, Heart, Star } from 'lucide-react';
import { ClassPlan, Exercise } from '@/types/reformer';
import { ExerciseSuggestions } from './ExerciseSuggestions';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SpringVisual } from '@/components/SpringVisual';

interface ClassBuilderProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onAddExercise: () => void;
  onAddCallout?: (position: number) => void;
  onUpdateCallout?: (calloutId: string, newName: string) => void;
  onDeleteCallout?: (calloutId: string) => void;
  onAddToShortlist?: (exercise: Exercise) => void;
  savedClasses?: ClassPlan[];
}

export const ClassBuilder = ({ 
  currentClass, 
  onRemoveExercise, 
  onReorderExercises, 
  onUpdateExercise,
  onAddExercise,
  onAddCallout,
  onUpdateCallout,
  onDeleteCallout,
  onAddToShortlist
}: ClassBuilderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const exercises = [...currentClass.exercises];
    const draggedExercise = exercises[draggedIndex];
    exercises.splice(draggedIndex, 1);
    exercises.splice(dropIndex, 0, draggedExercise);
    
    onReorderExercises(exercises);
    setDraggedIndex(null);
  };

  const getMuscleGroupCoverage = () => {
    const allGroups = currentClass.exercises.flatMap(ex => ex.muscleGroups);
    return Array.from(new Set(allGroups));
  };

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleRemoveExercise = (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveExercise(exerciseId);
  };

  const handleAddCallout = (position: number) => {
    if (onAddCallout) {
      onAddCallout(position);
    }
  };

  const handleShortlistExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToShortlist) {
      onAddToShortlist(exercise);
    }
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    const isCallout = exercise.category === 'callout';
    
    if (isCallout) {
      return (
        <div className="relative mb-2 px-4">
          <div className="border-l-4 border-sage-300 pl-3 py-2 bg-sage-50 rounded-r-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sage-700">{exercise.name || 'Callout'}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDeleteCallout) onDeleteCallout(exercise.id);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        className={`group mb-3 transition-all duration-300 cursor-pointer ${
          draggedIndex === index ? 'opacity-50 scale-95' : ''
        } ${hoveredExercise === exercise.id ? 'scale-[1.02]' : ''}`}
        onClick={() => handleExerciseClick(exercise)}
        onMouseEnter={() => setHoveredExercise(exercise.id)}
        onMouseLeave={() => setHoveredExercise(null)}
      >
        <Card className="border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 overflow-hidden rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-5 w-5 text-sage-500" />
              </div>

              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-lg font-bold text-sage-600">{index + 1}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sage-800 text-sm">
                    {exercise.name}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onAddToShortlist && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleShortlistExercise(exercise, e)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-6 w-6 p-0"
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleRemoveExercise(exercise.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-sage-500" />
                    <span className="text-xs text-sage-600 font-medium">{exercise.duration}min</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-sage-500">Springs:</span>
                    <SpringVisual springs={exercise.springs} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-sage-300 text-sage-700 rounded-full">
                    {exercise.category}
                  </Badge>
                  <div className="flex gap-1">
                    {exercise.muscleGroups.slice(0, 2).map(group => (
                      <Badge key={group} variant="secondary" className="text-xs bg-sage-100 text-sage-700 rounded-full">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Add callout button */}
        {onAddCallout && (
          <div className="relative h-0">
            <div className="absolute left-1/2 transform -translate-x-1/2 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCallout(index + 1);
                }}
                className="h-6 w-6 p-0 rounded-full bg-sage-100 border-sage-300 hover:bg-sage-200"
              >
                <Plus className="h-3 w-3 text-sage-600" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
          {/* Class Timeline */}
          <div className="md:col-span-3 space-y-3">
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-sage-100 bg-gradient-to-r from-sage-50 to-white p-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-sage-800">Class Timeline</CardTitle>
                  <Button 
                    onClick={onAddExercise}
                    variant="outline"
                    size="sm" 
                    className="border-sage-300 hover:bg-sage-100 text-sage-700 rounded-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                
                {currentClass.exercises.length > 0 && (
                  <p className="text-xs text-sage-600 mt-1">
                    {currentClass.exercises.length} exercises • {currentClass.totalDuration} minutes • Drag to reorder
                  </p>
                )}
              </CardHeader>
              
              <ScrollArea className="h-[calc(100vh-250px)] px-3 py-2">
                {currentClass.exercises.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-sage-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-7 w-7 text-sage-400" />
                    </div>
                    <h3 className="text-lg font-medium text-sage-700 mb-2">Start Building Your Class</h3>
                    <p className="text-sage-500 text-sm max-w-sm mx-auto mb-4">
                      Add exercises from the library to create your perfect Reformer flow. Drag to reorder once added.
                    </p>
                    <Button onClick={onAddExercise} className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-full px-6 py-2 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Exercise
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Add initial callout button */}
                    {onAddCallout && (
                      <div className="flex justify-center py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddCallout(0)}
                          className="rounded-full bg-sage-50 border-sage-300 hover:bg-sage-100 text-sage-700 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Note
                        </Button>
                      </div>
                    )}
                    
                    <ExerciseSuggestions 
                      currentClass={currentClass} 
                      onAddExercise={onAddExercise}
                    />
                    
                    {currentClass.exercises.map((exercise, index) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>

          {/* Class Analytics */}
          <div className="space-y-4">
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden bg-gradient-to-br from-sage-50/70 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-sage-800 font-medium">Class Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-sage-100">
                    <div className="flex flex-col items-center">
                      <Clock className="h-5 w-5 text-sage-600 mb-1" />
                      <span className="font-bold text-xl text-sage-800">{currentClass.totalDuration}</span>
                      <span className="text-xs text-sage-600">Minutes</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-sage-100">
                    <div className="flex flex-col items-center">
                      <BookOpen className="h-5 w-5 text-sage-600 mb-1" />
                      <span className="font-bold text-xl text-sage-800">
                        {currentClass.exercises.filter(ex => ex.category !== 'callout').length}
                      </span>
                      <span className="text-xs text-sage-600">Exercises</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-sage-800 font-medium">Muscle Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {getMuscleGroupCoverage().length === 0 ? (
                    <span className="text-sm text-sage-500">No exercises added</span>
                  ) : (
                    getMuscleGroupCoverage().map(group => (
                      <Badge key={group} className="text-xs bg-sage-100 text-sage-700 border-sage-300 rounded-full">
                        {group}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {currentClass.exercises.length > 0 && (
              <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-sage-800 font-medium">Spring Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-sage-100">
                    <span className="text-sage-700">Light</span>
                    <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-sage-100">
                    <span className="text-sage-700">Medium</span>
                    <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-sage-100">
                    <span className="text-sage-700">Heavy</span>
                    <div className="flex gap-0.5">
                      <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                      <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExercise(null);
          }}
          onUpdate={onUpdateExercise}
        />
      )}
    </>
  );
};
