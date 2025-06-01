
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, Trash2, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-100">
      {/* Cart-Style Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-sage-200/50 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Class title - cart style */}
          <div className="flex items-center gap-3 mb-3">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-lg font-bold bg-transparent border-sage-200 focus:ring-sage-500 h-auto py-2"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700 px-3">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <h1 className="text-lg font-bold text-sage-800">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-full p-1"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Cart-style Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sage-600 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{totalDuration} minutes</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">{exerciseCount} exercises</span>
              </div>
            </div>
            
            {/* Cart total style */}
            <div className="text-right">
              <div className="text-xs text-sage-500">Total Class Time</div>
              <div className="text-lg font-bold text-sage-800">{totalDuration}min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Add Exercise Button - Cart Style */}
        <Card className="mb-4 bg-white/80 backdrop-blur-xl border border-sage-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={onAddExercise}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3 text-sage-600 group-hover:text-sage-800 transition-colors">
              <div className="p-2 bg-sage-100 rounded-xl group-hover:bg-sage-200 transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-base font-medium">Add Exercise to Class</span>
            </div>
          </CardContent>
        </Card>

        {/* Cart-Style Exercise List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-sage-200/30 overflow-hidden">
          <div className="p-4 bg-sage-50/50 border-b border-sage-200/50">
            <h2 className="text-base font-semibold text-sage-800">Your Class Exercises</h2>
            <p className="text-sm text-sage-600">Drag anywhere on a card to reorder</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-sage-100">
                  {currentClass.exercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 bg-white hover:bg-sage-50/50 transition-all duration-200 cursor-move ${
                            snapshot.isDragging ? 'shadow-xl bg-sage-50 scale-105 rotate-1' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Exercise number - cart style */}
                            <div className="w-8 h-8 bg-sage-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {index + 1}
                            </div>

                            {/* Exercise image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0">
                              <img
                                src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Exercise info - cart style */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sage-800 text-base leading-tight mb-1">{exercise.name}</h3>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="bg-sage-50 text-sage-600 border-sage-200 text-xs">
                                  {exercise.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-sage-500 text-sm">
                                  <Clock className="h-3 w-3" />
                                  <span>{exercise.duration}min</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-sage-500">Springs:</span>
                                <SpringVisual springs={exercise.springs} />
                              </div>
                            </div>

                            {/* Cart-style price/action area */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-semibold text-sage-800 mb-2">{exercise.duration}min</div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveExercise(exercise.id);
                                }}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 w-8 h-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
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

          {/* Empty state - cart style */}
          {currentClass.exercises.length === 0 && (
            <div className="p-8 text-center">
              <div className="p-4 bg-sage-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-sage-400" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-2">Your cart is empty</h3>
              <p className="text-sage-600 mb-4 text-sm">Add exercises to build your class</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl px-6 py-2">
                <Plus className="h-4 w-4 mr-2" />
                Add First Exercise
              </Button>
            </div>
          )}
        </div>

        {/* Cart-style Checkout/Save Section */}
        {currentClass.exercises.length > 0 && (
          <div className="mt-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-sage-200/30 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-sage-800">Class Summary</h3>
                  <p className="text-sm text-sage-600">{exerciseCount} exercises • {totalDuration} minutes total</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-sage-800">{totalDuration}</div>
                  <div className="text-xs text-sage-500">MINUTES</div>
                </div>
              </div>
              
              <Button
                onClick={onSaveClass}
                className="w-full bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Class Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
