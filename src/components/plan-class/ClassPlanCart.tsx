import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, GripVertical, Trash2, Plus, Edit } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '../SpringVisual';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface ClassPlanCartProps {
  exercises?: Exercise[];
  currentClass?: ClassPlan;
  onRemove?: (exerciseId: string) => void;
  onReorder?: (exercises: Exercise[]) => void;
  onAddCallout?: () => void;
  totalDuration?: number;
  targetDuration?: number;
  onUpdateClassName?: (name: string) => void;
  onReorderExercises?: (exercises: Exercise[]) => void;
  onUpdateExercise?: (exercise: Exercise) => void;
  onSaveClass?: () => Promise<void>;
  onAddExercise?: () => void;
  onRemoveExercise?: (exerciseId: string) => void;
}

export const ClassPlanCart = ({ 
  exercises = [],
  currentClass,
  onRemove, 
  onReorder,
  onReorderExercises,
  onRemoveExercise,
  onAddCallout,
  onAddExercise,
  totalDuration = 0, 
  targetDuration = 45 
}: ClassPlanCartProps) => {
  // Use currentClass as the primary source of truth
  const displayExercises = currentClass?.exercises || exercises;
  const displayDuration = currentClass?.totalDuration || totalDuration;
  const displayTargetDuration = currentClass?.duration || targetDuration;

  console.log('🔵 ClassPlanCart render:', {
    displayExercises: displayExercises.length,
    displayDuration,
    currentClassExists: !!currentClass,
    exercisesFromProps: exercises.length
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(displayExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    console.log('🔄 Reordering exercises:', items.length);

    // Use the most appropriate reorder function
    if (onReorderExercises) {
      onReorderExercises(items);
    } else if (onReorder) {
      onReorder(items);
    }
  };

  const handleRemove = (exerciseId: string) => {
    console.log('🗑️ Removing exercise:', exerciseId);
    
    if (onRemoveExercise) {
      onRemoveExercise(exerciseId);
    } else if (onRemove) {
      onRemove(exerciseId);
    }
  };

  const addCallout = () => {
    const calloutExercise: Exercise = {
      id: `callout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Section Break',
      category: 'callout',
      difficulty: 'beginner',
      intensityLevel: 'low',
      duration: 0,
      muscleGroups: [],
      equipment: [],
      springs: 'none',
      isPregnancySafe: true,
      description: 'Section divider',
      cues: [],
      notes: '',
      image: '',
      videoUrl: '',
      setup: '',
      repsOrDuration: '',
      tempo: '',
      targetAreas: [],
      breathingCues: [],
      teachingFocus: [],
      modifications: [],
      progressions: [],
      regressions: [],
      transitions: [],
      contraindications: [],
      calloutColor: 'amber'
    };

    const newExercises = [...displayExercises, calloutExercise];
    
    if (onReorderExercises) {
      onReorderExercises(newExercises);
    } else if (onReorder) {
      onReorder(newExercises);
    }
  };

  return (
    <Card className="shadow-sm border-sage-200">
      <CardHeader className="bg-gradient-to-r from-sage-50 to-white">
        <CardTitle className="flex items-center justify-between text-sage-800">
          <span>Class Plan</span>
          <div className="flex items-center gap-2">
            <Badge 
              variant={displayDuration > displayTargetDuration ? "destructive" : "secondary"}
              className="text-sm"
            >
              <Clock className="h-3 w-3 mr-1" />
              {displayDuration}/{displayTargetDuration} min
            </Badge>
            <Badge variant="outline" className="text-sm">
              {displayExercises.length} exercises
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {displayExercises.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-sage-200 rounded-lg">
            <div className="text-sage-400 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">No exercises added yet</p>
              <p className="text-sm">Add exercises to start building your class</p>
            </div>
            {onAddExercise && (
              <Button 
                onClick={onAddExercise}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Exercise
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="class-plan">
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-sage-50 rounded-lg' : ''}`}
                  >
                    {displayExercises.map((exercise, index) => (
                      <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-3 p-4 bg-white rounded-lg border transition-all duration-200 ${
                              snapshot.isDragging 
                                ? 'shadow-lg border-sage-300 bg-sage-50 rotate-2' 
                                : 'border-sage-200 hover:border-sage-300 hover:shadow-sm'
                            }`}
                          >
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-sage-400" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sage-900 truncate">
                                  {exercise.name}
                                </h4>
                                {exercise.category === 'callout' ? (
                                  <Badge 
                                    className={`text-xs bg-${exercise.calloutColor}-100 text-${exercise.calloutColor}-800 border-${exercise.calloutColor}-200`}
                                  >
                                    Section
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    {exercise.category}
                                  </Badge>
                                )}
                                {exercise.isCustom && (
                                  <Badge className="text-xs bg-blue-100 text-blue-800">
                                    Custom
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-sage-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{exercise.duration} min</span>
                                </div>
                                {exercise.category !== 'callout' && (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <span>Springs:</span>
                                      <SpringVisual springs={exercise.springs} />
                                    </div>
                                    <span className="capitalize">{exercise.difficulty}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-sage-600 hover:text-sage-700 hover:bg-sage-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemove(exercise.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {/* Add more exercises button */}
            {onAddExercise && (
              <div className="flex justify-center pt-2">
                <Button 
                  variant="outline" 
                  onClick={onAddExercise}
                  className="border-sage-300 text-sage-600 hover:bg-sage-50 hover:border-sage-400"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Exercises
                </Button>
              </div>
            )}
            
            {/* Add section break button */}
            {onAddCallout && (
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={addCallout}
                  className="border-dashed border-sage-300 text-sage-600 hover:bg-sage-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section Break
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};