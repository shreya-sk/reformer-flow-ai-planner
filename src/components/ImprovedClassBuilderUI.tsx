import React from 'react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Edit2, Trash2, Clock, Users } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { SpringVisual } from '@/components/SpringVisual';

interface ImprovedClassBuilderUIProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onEditExercise?: (exercise: Exercise) => void;
  onAddCallout?: (name: string, position: number) => void;
}

export const ImprovedClassBuilderUI = ({
  currentClass,
  onRemoveExercise,
  onReorderExercises,
  onAddExercise,
  onEditExercise,
  onAddCallout
}: ImprovedClassBuilderUIProps) => {
  const realExercises = currentClass.exercises.filter(ex => ex.category !== 'callout');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(currentClass.exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderExercises(items);
  };

  const groupExercisesBySection = () => {
    const sections = {
      warmup: [] as Exercise[],
      main: [] as Exercise[],
      cooldown: [] as Exercise[]
    };

    let currentSection = 'warmup';
    
    currentClass.exercises.forEach(exercise => {
      if (exercise.category === 'callout') {
        const sectionName = exercise.name.toLowerCase();
        if (sectionName.includes('warm') || sectionName.includes('prep')) {
          currentSection = 'warmup';
        } else if (sectionName.includes('cool') || sectionName.includes('stretch')) {
          currentSection = 'cooldown';
        } else {
          currentSection = 'main';
        }
      } else {
        sections[currentSection as keyof typeof sections].push(exercise);
      }
    });

    return sections;
  };

  const sections = groupExercisesBySection();

  const renderExerciseCard = (exercise: Exercise, index: number) => (
    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group ${snapshot.isDragging ? 'z-50' : ''}`}
        >
          <Card className={`mb-3 transition-all duration-200 ${
            snapshot.isDragging 
              ? 'shadow-xl rotate-2 scale-105' 
              : 'hover:shadow-md'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  {...provided.dragHandleProps}
                  className="flex-shrink-0 text-sage-400 hover:text-sage-600 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-sage-800 truncate">{exercise.name}</h3>
                    <SpringVisual springs={exercise.springs} className="w-4 h-4" />
                    {exercise.isCustom && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        Custom
                      </Badge>
                    )}
                    {exercise.isSystemExercise && exercise.isModified && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        Modified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-sage-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{exercise.duration || 0}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="capitalize">{exercise.difficulty}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {exercise.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEditExercise && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditExercise(exercise)}
                      className="h-8 w-8 p-0 hover:bg-sage-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExercise(exercise.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const renderSection = (title: string, exercises: Exercise[], sectionKey: string) => (
    <div key={sectionKey} className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-sage-800">{title}</h3>
          <Badge variant="outline" className="text-sage-600">
            {exercises.length} exercises
          </Badge>
        </div>
        {onAddCallout && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddCallout(title, currentClass.exercises.length)}
            className="text-xs"
          >
            Add Section
          </Button>
        )}
      </div>
      
      <Droppable droppableId={sectionKey}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[120px] p-3 rounded-lg border-2 border-dashed transition-colors ${
              snapshot.isDraggingOver 
                ? 'border-sage-400 bg-sage-50' 
                : 'border-sage-200 bg-sage-25'
            }`}
          >
            {exercises.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sage-500">
                <div className="text-center">
                  <div className="text-sm font-medium">No exercises in {title.toLowerCase()}</div>
                  <div className="text-xs">Drag exercises here or add new ones</div>
                </div>
              </div>
            ) : (
              exercises.map((exercise, index) => renderExerciseCard(exercise, index))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-sage-50 to-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sage-800">{realExercises.length}</div>
              <div className="text-xs text-sage-600">Exercises</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-800">{currentClass.totalDuration}</div>
              <div className="text-xs text-sage-600">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-800">
                {Array.from(new Set(realExercises.flatMap(ex => ex.muscleGroups))).length}
              </div>
              <div className="text-xs text-sage-600">Muscle Groups</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Exercise Button */}
      <Button
        onClick={onAddExercise}
        className="w-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white py-6 rounded-xl shadow-lg"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Exercise to Class
      </Button>

      {/* Exercise Sections */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {renderSection('Warm-up', sections.warmup, 'warmup')}
        {renderSection('Main Workout', sections.main, 'main')}
        {renderSection('Cool-down', sections.cooldown, 'cooldown')}
      </DragDropContext>

      {realExercises.length === 0 && (
        <Card className="border-2 border-dashed border-sage-200">
          <CardContent className="p-8 text-center">
            <div className="text-sage-500 mb-4">
              <Users className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Start Building Your Class</h3>
              <p className="text-sm mt-2">Add exercises to create your perfect class plan</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
