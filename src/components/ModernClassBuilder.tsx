
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, Trash2, GripVertical } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface ModernClassBuilderProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
}

export const ModernClassBuilder = ({
  currentClass,
  onUpdateClassName,
  onRemoveExercise,
  onReorderExercises,
  onSaveClass,
  onAddExercise
}: ModernClassBuilderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState(currentClass.name);

  const totalDuration = currentClass.exercises.reduce((total, ex) => total + (ex.duration || 0), 0);
  const exerciseCount = currentClass.exercises.filter(ex => ex.category !== 'callout').length;

  const handleSaveName = () => {
    onUpdateClassName(className);
    setIsEditing(false);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const exercises = Array.from(currentClass.exercises);
    const [reorderedItem] = exercises.splice(result.source.index, 1);
    exercises.splice(result.destination.index, 0, reorderedItem);

    onReorderExercises(exercises);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Very Compact Mobile Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-sage-200/50 p-3">
        <div className="max-w-4xl mx-auto">
          {/* Class title - very compact */}
          <div className="flex items-center gap-1 mb-2">
            {isEditing ? (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-base font-bold bg-transparent border-0 focus:ring-0 p-0 h-auto"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700 px-1 py-0.5">
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-1">
                <h1 className="text-base font-bold text-sage-800 truncate">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-full p-0.5"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Very Compact Stats */}
          <div className="flex items-center gap-3 text-sage-600 text-xs">
            <div className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{totalDuration}min</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              <span className="font-medium">{exerciseCount} ex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-3">
        {/* Very Compact Add Exercise Button */}
        <Card className="mb-3 bg-white/60 backdrop-blur-xl border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={onAddExercise}>
          <CardContent className="p-3">
            <div className="flex items-center justify-center gap-2 text-sage-600 group-hover:text-sage-800 transition-colors">
              <div className="p-1.5 bg-sage-100 rounded-lg group-hover:bg-sage-200 transition-colors">
                <Plus className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium">Add Exercise</span>
            </div>
          </CardContent>
        </Card>

        {/* Drag and Drop Exercise List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1.5">
                {currentClass.exercises.map((exercise, index) => (
                  <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                    {(provided, snapshot) => (
                      <Card 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white/70 backdrop-blur-xl border-0 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group ${
                          snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                        }`}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center gap-1.5">
                            {/* Very compact drag handle */}
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing text-sage-400"
                            >
                              <GripVertical className="h-3 w-3" />
                            </div>

                            {/* Very compact exercise number */}
                            <div className="w-5 h-5 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 text-[10px]">
                              {index + 1}
                            </div>

                            {/* Very compact exercise image */}
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-sage-100 flex-shrink-0">
                              <img
                                src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Very compact exercise info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sage-800 truncate text-xs leading-tight">{exercise.name}</h3>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Badge variant="outline" className="text-[9px] bg-sage-50 text-sage-600 border-sage-200 px-1 py-0">
                                  {exercise.category}
                                </Badge>
                                <div className="flex items-center gap-0.5 text-sage-500 text-[10px]">
                                  <Clock className="h-2 w-2" />
                                  <span>{exercise.duration}min</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                  <SpringVisual springs={exercise.springs} />
                                </div>
                              </div>
                            </div>

                            {/* Very compact Actions */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveExercise(exercise.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-0.5 w-5 h-5"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Very Compact Empty state */}
        {currentClass.exercises.length === 0 && (
          <Card className="bg-white/40 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-sage-100 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-sage-400" />
              </div>
              <h3 className="text-base font-semibold text-sage-800 mb-2">Start Building</h3>
              <p className="text-sage-600 mb-3 text-xs">Add exercises to create your class</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl px-4 text-xs">
                Add First Exercise
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Very Compact Save button */}
        {currentClass.exercises.length > 0 && (
          <div className="fixed bottom-20 right-4">
            <Button
              onClick={onSaveClass}
              className="bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-full px-4 py-2 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
