
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, X, GripVertical } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { MobileExerciseModal } from './MobileExerciseModal';
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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100">
      {/* Simplified Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-sage-200/50 p-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto">
          {/* Class title */}
          <div className="mb-4">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-xl font-bold bg-white border-sage-300 focus:ring-sage-500 rounded-xl"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700 rounded-xl px-4">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-sage-800 flex-1">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-xl"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sage-600 mb-4">
            <div className="flex items-center gap-2 bg-sage-100 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-sm">{totalDuration}min</span>
            </div>
            <div className="flex items-center gap-2 bg-sage-100 px-3 py-1.5 rounded-full">
              <Users className="h-4 w-4" />
              <span className="font-medium text-sm">{exerciseCount} exercises</span>
            </div>
          </div>

          {/* Simplified Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onAddExercise}
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white rounded-xl py-3 text-base font-medium shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Exercise
            </Button>
            <Button
              onClick={onSaveClass}
              disabled={exerciseCount === 0}
              className={`px-6 py-3 rounded-xl text-base font-medium shadow-lg ${
                exerciseCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Save className="h-5 w-5 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Add Exercise Prompt */}
        {currentClass.exercises.length === 0 && (
          <Card className="mb-6 bg-white/90 backdrop-blur-xl border border-sage-200/50 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-2">Start Building Your Class</h3>
              <p className="text-sage-600 mb-6 text-sm">Add exercises to create your perfect class plan</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl px-6 py-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Exercise
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Simplified Exercise List */}
        {currentClass.exercises.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {currentClass.exercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-sage-200/30 transition-all duration-300 cursor-pointer ${
                            snapshot.isDragging ? 'shadow-2xl scale-105 rotate-1' : 'hover:shadow-xl'
                          }`}
                          onClick={() => handleExerciseClick(exercise)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Drag Handle */}
                              <div 
                                {...provided.dragHandleProps}
                                className="cursor-move text-sage-400 hover:text-sage-600 transition-colors p-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              {/* Exercise Number */}
                              <div className="w-8 h-8 bg-sage-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {index + 1}
                              </div>

                              {/* Exercise Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sage-800 text-base leading-tight mb-1 truncate">
                                  {exercise.name}
                                </h3>
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

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveExercise(exercise.id);
                                }}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-2 w-10 h-10 flex-shrink-0"
                              >
                                <X className="h-4 w-4" />
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
        <div className="h-20" />
      </div>

      {/* Exercise Modal for consistency */}
      {selectedExercise && (
        <MobileExerciseModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToClass={() => {}} // No action needed in builder
          onEdit={() => {}} // Keep edit functionality if needed
        />
      )}
    </div>
  );
};
