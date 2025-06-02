
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, X, GripVertical } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100">
      {/* Streamlined Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-sage-200/50 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto">
          {/* Class title */}
          <div className="mb-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-lg font-bold bg-white border-sage-300 focus:ring-sage-500 rounded-xl flex-1"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700 rounded-xl px-3">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-sage-800 flex-1">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-xl p-2"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Compact Stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-sage-600">
              <div className="flex items-center gap-1.5 bg-sage-100 px-2.5 py-1 rounded-full">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium text-sm">{totalDuration}min</span>
              </div>
              <div className="flex items-center gap-1.5 bg-sage-100 px-2.5 py-1 rounded-full">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium text-sm">{exerciseCount}</span>
              </div>
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onAddExercise}
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white rounded-xl py-2.5 text-sm font-medium shadow-md"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Exercise
            </Button>
            <Button
              onClick={onSaveClass}
              disabled={exerciseCount === 0}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium shadow-md ${
                exerciseCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-3">
        {/* Empty State */}
        {currentClass.exercises.length === 0 && (
          <Card className="mb-4 bg-white/90 backdrop-blur-xl border border-sage-200/50 rounded-2xl shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-sage-600" />
              </div>
              <h3 className="text-base font-semibold text-sage-800 mb-1">Start Building</h3>
              <p className="text-sage-600 mb-4 text-sm">Add exercises to create your class</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl px-4 py-2">
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Exercise
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Exercise List */}
        {currentClass.exercises.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {currentClass.exercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white/95 backdrop-blur-xl rounded-xl shadow-md border border-sage-200/30 transition-all duration-300 ${
                            snapshot.isDragging ? 'shadow-xl scale-105 rotate-1' : 'hover:shadow-lg'
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              {/* Drag Handle */}
                              <div 
                                {...provided.dragHandleProps}
                                className="cursor-move text-sage-400 hover:text-sage-600 transition-colors"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>

                              {/* Exercise Number */}
                              <div className="w-6 h-6 bg-sage-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {index + 1}
                              </div>

                              {/* Exercise Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sage-800 text-sm leading-tight mb-0.5 truncate">
                                  {exercise.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="bg-sage-50 text-sage-600 border-sage-200 text-xs px-1.5 py-0.5">
                                    {exercise.category}
                                  </Badge>
                                  <div className="flex items-center gap-0.5 text-sage-500 text-xs">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>{exercise.duration}min</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-sage-500">Springs:</span>
                                  <SpringVisual springs={exercise.springs} />
                                </div>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveExercise(exercise.id);
                                }}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1.5 w-8 h-8 flex-shrink-0"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
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
        )}

        {/* Bottom Spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
};
