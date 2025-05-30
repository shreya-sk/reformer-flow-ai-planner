import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, GripVertical, Trash2, Plus } from 'lucide-react';
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
  totalDuration = 0, 
  targetDuration = 45 
}: ClassPlanCartProps) => {
  const displayExercises = currentClass?.exercises || exercises;
  const displayDuration = totalDuration > 0 ? totalDuration : currentClass?.totalDuration || 0;
  const displayTargetDuration = targetDuration !== 45 ? targetDuration : currentClass?.duration || 45;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(displayExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    if (onReorder) {
      onReorder(items);
    } else if (onReorderExercises) {
      onReorderExercises(items);
    }
  };

  const handleRemove = (exerciseId: string) => {
    if (onRemove) {
      onRemove(exerciseId);
    } else if (onRemoveExercise) {
      onRemoveExercise(exerciseId);
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
    if (onReorder) {
      onReorder(newExercises);
    } else if (onReorderExercises) {
      onReorderExercises(newExercises);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Class Plan</span>
          <Badge variant={displayDuration > displayTargetDuration ? "destructive" : "secondary"}>
            {displayDuration}/{displayTargetDuration} min
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayExercises.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No exercises added yet. Browse the library to add exercises to your class.
          </p>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="class-plan">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {displayExercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{exercise.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{exercise.duration} min</span>
                              {exercise.category !== 'callout' && (
                                <>
                                  <span>•</span>
                                  <SpringVisual springs={exercise.springs} />
                                </>
                              )}
                            </div>
                          </div>
                          
                          {(onRemove || onRemoveExercise) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(exercise.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        
        {onAddCallout && (
          <Button 
            variant="outline" 
            onClick={addCallout}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section Break
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
