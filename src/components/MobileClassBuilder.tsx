
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, GripVertical, Trash2, Clock, Edit, Play, Save, Check } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { ModernExerciseModal } from './ModernExerciseModal';

interface MobileClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
  onAddCallout?: (name: string, position: number) => void;
  onEditExercise?: (exercise: Exercise) => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export const MobileClassBuilder = ({
  currentClass,
  onUpdateClassName,
  onRemoveExercise,
  onReorderExercises,
  onUpdateExercise,
  onSaveClass,
  onAddExercise,
  onAddCallout,
  onEditExercise,
  isSaving = false,
  saveSuccess = false
}: MobileClassBuilderProps) => {
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(currentClass.exercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderExercises(items);
  };

  const getTotalDuration = () => {
    return currentClass.exercises
      .filter(ex => ex.category !== 'callout')
      .reduce((total, ex) => total + (ex.duration || 0), 0);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
  };

  const handleCloseModal = () => {
    setEditingExercise(null);
  };

  return (
    <div className="space-y-4 relative">
      {/* Enhanced header with blur background */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30 sticky top-4 z-20">
        <div className="space-y-3">
          <Input
            value={currentClass.name}
            onChange={(e) => onUpdateClassName(e.target.value)}
            placeholder="Class name..."
            className="text-lg font-semibold bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 rounded-xl"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-sage-50/80 text-sage-700 border-sage-200 backdrop-blur-sm">
                <Clock className="h-3 w-3 mr-1" />
                {getTotalDuration()}min
              </Badge>
              <Badge variant="outline" className="bg-sage-50/80 text-sage-700 border-sage-200 backdrop-blur-sm">
                {currentClass.exercises.filter(ex => ex.category !== 'callout').length} exercises
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={onAddExercise}
                size="sm"
                className="bg-sage-600/90 hover:bg-sage-700/90 text-white backdrop-blur-sm rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={onSaveClass}
                size="sm"
                disabled={isSaving}
                className={`backdrop-blur-sm rounded-xl transition-all duration-300 ${
                  saveSuccess 
                    ? 'bg-green-500 text-white scale-110' 
                    : isSaving
                    ? 'bg-gray-400 text-white'
                    : 'bg-emerald-600/90 hover:bg-emerald-700/90 text-white'
                }`}
              >
                {saveSuccess ? (
                  <Check className="h-4 w-4 animate-bounce" />
                ) : isSaving ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise list with enhanced blur effects */}
      <div className="space-y-3">
        {currentClass.exercises.length === 0 ? (
          <Card className="bg-white/60 backdrop-blur-xl border-white/30 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🏋️‍♀️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No exercises yet</h3>
              <p className="text-gray-600 mb-4">Start building your class by adding exercises</p>
              <Button 
                onClick={onAddExercise}
                className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {currentClass.exercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-all duration-200 ${
                            snapshot.isDragging ? 'scale-105 rotate-2' : ''
                          }`}
                        >
                          <Card className="bg-white/70 backdrop-blur-xl border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Clock className="h-3 w-3" />
                                      <span>{exercise.duration}min</span>
                                      <span>•</span>
                                      <span className="capitalize">{exercise.difficulty}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditExercise(exercise)}
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-sage-600 hover:bg-sage-50/80 rounded-lg"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveExercise(exercise.id)}
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50/80 rounded-lg"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
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
      </div>

      {/* Exercise Detail Modal */}
      {editingExercise && (
        <ModernExerciseModal
          exercise={editingExercise}
          isOpen={!!editingExercise}
          onClose={handleCloseModal}
          onEdit={() => {
            // Already in edit mode
          }}
        />
      )}
    </div>
  );
};
