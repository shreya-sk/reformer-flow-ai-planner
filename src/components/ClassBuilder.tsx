
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Clock, GripVertical, BookOpen, Plus, Heart, Star, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';
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
  const [openCallouts, setOpenCallouts] = useState<Set<string>>(new Set());
  const [editingCallout, setEditingCallout] = useState<string | null>(null);

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
    const allGroups = currentClass.exercises
      .filter(ex => ex.category !== 'callout')
      .flatMap(ex => ex.muscleGroups);
    return Array.from(new Set(allGroups));
  };

  const handleExerciseClick = (exercise: Exercise) => {
    if (exercise.category !== 'callout') {
      setSelectedExercise(exercise);
      setShowDetailModal(true);
    }
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

  const toggleCallout = (calloutId: string) => {
    setOpenCallouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(calloutId)) {
        newSet.delete(calloutId);
      } else {
        newSet.add(calloutId);
      }
      return newSet;
    });
  };

  const groupExercisesByCallouts = () => {
    const groups: Array<{ callout?: Exercise; exercises: Exercise[] }> = [];
    let currentGroup: { callout?: Exercise; exercises: Exercise[] } = { exercises: [] };

    currentClass.exercises.forEach(exercise => {
      if (exercise.category === 'callout') {
        if (currentGroup.exercises.length > 0 || currentGroup.callout) {
          groups.push(currentGroup);
        }
        currentGroup = { callout: exercise, exercises: [] };
      } else {
        currentGroup.exercises.push(exercise);
      }
    });

    if (currentGroup.exercises.length > 0 || currentGroup.callout) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const ExerciseCard = ({ exercise, index, groupIndex, isInCallout }: { 
    exercise: Exercise; 
    index: number;
    groupIndex?: number;
    isInCallout?: boolean;
  }) => {
    const actualIndex = currentClass.exercises.findIndex(ex => ex.id === exercise.id);
    
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, actualIndex)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, actualIndex)}
        className={`group mb-2 transition-all duration-300 cursor-pointer ${
          draggedIndex === actualIndex ? 'opacity-50 scale-95' : ''
        } ${hoveredExercise === exercise.id ? 'scale-[1.02]' : ''} ${isInCallout ? 'ml-4' : ''}`}
        onClick={() => handleExerciseClick(exercise)}
        onMouseEnter={() => setHoveredExercise(exercise.id)}
        onMouseLeave={() => setHoveredExercise(null)}
      >
        <Card className="border-sage-200 hover:shadow-md hover:border-sage-300 transition-all duration-300 overflow-hidden rounded-lg">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-sage-500" />
              </div>

              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-sage-600">{index + 1}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sage-800 text-sm truncate">
                    {exercise.name}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onAddToShortlist && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleShortlistExercise(exercise, e)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-5 w-5 p-0"
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleRemoveExercise(exercise.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-5 w-5 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-sage-500" />
                    <span className="text-xs text-sage-600 font-medium">{exercise.duration}min</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <SpringVisual springs={exercise.springs} className="w-3 h-3" />
                  </div>

                  <Badge variant="outline" className="text-xs border-sage-300 text-sage-700 rounded-full px-1 py-0">
                    {exercise.category}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const CalloutCard = ({ callout, exercises, isOpen, onToggle }: {
    callout: Exercise;
    exercises: Exercise[];
    isOpen: boolean;
    onToggle: () => void;
  }) => {
    const isEditing = editingCallout === callout.id;
    
    return (
      <div className="mb-3">
        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <div className="border-l-4 border-sage-400 bg-sage-50 rounded-r-lg">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-sage-100 transition-colors">
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-sage-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sage-600" />
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={callout.name}
                      onChange={(e) => {
                        if (onUpdateCallout) {
                          onUpdateCallout(callout.id, e.target.value);
                        }
                      }}
                      onBlur={() => setEditingCallout(null)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setEditingCallout(null);
                        }
                      }}
                      className="bg-white border border-sage-300 rounded px-2 py-1 text-sm"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="font-medium text-sage-700">{callout.name}</span>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {exercises.length} exercises
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCallout(callout.id);
                    }}
                    className="text-sage-600 hover:text-sage-800 hover:bg-sage-200 h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteCallout) onDeleteCallout(callout.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-3 pb-2">
              <div className="space-y-1">
                {exercises.map((exercise, index) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise} 
                    index={index} 
                    isInCallout={true}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    );
  };

  const exerciseGroups = groupExercisesByCallouts();
  const realExercises = currentClass.exercises.filter(ex => ex.category !== 'callout');

  return (
    <>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
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
                    className="border-sage-300 hover:bg-sage-100 text-sage-700 rounded-full h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                
                {realExercises.length > 0 && (
                  <p className="text-xs text-sage-600 mt-1">
                    {realExercises.length} exercises • {currentClass.totalDuration} minutes • Drag to reorder
                  </p>
                )}
              </CardHeader>
              
              <ScrollArea className="h-[calc(100vh-250px)] px-3 py-2">
                {currentClass.exercises.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-sage-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-6 w-6 text-sage-400" />
                    </div>
                    <h3 className="text-base font-medium text-sage-700 mb-2">Start Building Your Class</h3>
                    <p className="text-sage-500 text-sm max-w-sm mx-auto mb-4">
                      Add exercises from the library to create your perfect Reformer flow.
                    </p>
                    <Button onClick={onAddExercise} className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-full px-4 py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Exercise
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Add initial callout button */}
                    {onAddCallout && (
                      <div className="flex justify-center py-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddCallout(0)}
                          className="rounded-full bg-sage-50 border-sage-300 hover:bg-sage-100 text-sage-700 text-xs h-6"
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
                    
                    {exerciseGroups.map((group, groupIndex) => (
                      <div key={groupIndex}>
                        {group.callout ? (
                          <CalloutCard
                            callout={group.callout}
                            exercises={group.exercises}
                            isOpen={openCallouts.has(group.callout.id)}
                            onToggle={() => toggleCallout(group.callout!.id)}
                          />
                        ) : (
                          <div className="space-y-1">
                            {group.exercises.map((exercise, index) => (
                              <ExerciseCard 
                                key={exercise.id} 
                                exercise={exercise} 
                                index={index}
                                groupIndex={groupIndex}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>

          {/* Compact Class Analytics */}
          <div className="space-y-3">
            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden bg-gradient-to-br from-sage-50/70 to-white">
              <CardHeader className="pb-2 p-3">
                <CardTitle className="text-sm text-sage-800 font-medium">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2 shadow-sm border border-sage-100">
                    <div className="flex flex-col items-center">
                      <Clock className="h-4 w-4 text-sage-600 mb-1" />
                      <span className="font-bold text-lg text-sage-800">{currentClass.totalDuration}</span>
                      <span className="text-xs text-sage-600">min</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-2 shadow-sm border border-sage-100">
                    <div className="flex flex-col items-center">
                      <BookOpen className="h-4 w-4 text-sage-600 mb-1" />
                      <span className="font-bold text-lg text-sage-800">{realExercises.length}</span>
                      <span className="text-xs text-sage-600">exercises</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
              <CardHeader className="pb-2 p-3">
                <CardTitle className="text-sm text-sage-800 font-medium">Muscle Groups</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex flex-wrap gap-1">
                  {getMuscleGroupCoverage().length === 0 ? (
                    <span className="text-xs text-sage-500">No exercises added</span>
                  ) : (
                    getMuscleGroupCoverage().slice(0, 6).map(group => (
                      <Badge key={group} className="text-xs bg-sage-100 text-sage-700 border-sage-300 rounded-full">
                        {group}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {realExercises.length > 0 && (
              <Card className="shadow-sm border-sage-200 rounded-xl overflow-hidden">
                <CardHeader className="pb-2 p-3">
                  <CardTitle className="text-sm text-sage-800 font-medium">Spring Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 p-3 pt-0">
                  <div className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-sage-100">
                    <span className="text-sage-700">Light</span>
                    <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-sage-100">
                    <span className="text-sage-700">Medium</span>
                    <div className="bg-yellow-500 w-2 h-2 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-sage-100">
                    <span className="text-sage-700">Heavy</span>
                    <div className="flex gap-0.5">
                      <div className="bg-red-500 w-2 h-2 rounded-full"></div>
                      <div className="bg-red-500 w-2 h-2 rounded-full"></div>
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
