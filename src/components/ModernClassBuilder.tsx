
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, X, GripVertical, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sage-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-sage-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-sage-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Enhanced Header with Glass Effect */}
      <div className="bg-white/90 backdrop-blur-2xl border-b border-sage-200/50 p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto">
          {/* Class title with enhanced animations */}
          <div className="mb-4">
            {isEditing ? (
              <div className="flex items-center gap-3 animate-fade-in">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-xl font-bold bg-white/80 backdrop-blur-sm border-sage-300 focus:ring-sage-500 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  placeholder="Class name"
                />
                <Button 
                  size="sm" 
                  onClick={handleSaveName} 
                  className="bg-sage-600 hover:bg-sage-700 rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-xl font-bold text-sage-800 flex-1 transition-all duration-300 group-hover:text-sage-900">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100/80 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Stats with Glass Effect */}
          <div className="flex items-center gap-4 text-sage-600 mb-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-sage-200/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Clock className="h-4 w-4 text-sage-500" />
              <span className="font-medium text-sm">{totalDuration}min</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-sage-200/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Users className="h-4 w-4 text-sage-500" />
              <span className="font-medium text-sm">{exerciseCount} exercises</span>
            </div>
          </div>

          {/* Enhanced Action Buttons with Micro-interactions */}
          <div className="flex gap-3">
            <Button
              onClick={onAddExercise}
              className="flex-1 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Plus className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Add Exercise
            </Button>
            <Button
              onClick={onSaveClass}
              disabled={exerciseCount === 0}
              className={`px-6 py-3 rounded-xl text-base font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                exerciseCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl'
              }`}
            >
              <Save className="h-5 w-5 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Content with Enhanced Spacing */}
      <div className="max-w-md mx-auto p-4 relative z-10">
        {/* Enhanced Add Exercise Prompt */}
        {currentClass.exercises.length === 0 && (
          <Card className="mb-6 bg-white/95 backdrop-blur-2xl border border-sage-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 hover:scale-110">
                <Sparkles className="h-10 w-10 text-sage-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-3">Start Building Your Class</h3>
              <p className="text-sage-600 mb-6 text-sm leading-relaxed">Add exercises to create your perfect class plan</p>
              <Button 
                onClick={onAddExercise} 
                className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Exercise
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Exercise List with Improved Cards */}
        {currentClass.exercises.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {currentClass.exercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white/95 backdrop-blur-2xl rounded-3xl shadow-xl border border-sage-200/30 transition-all duration-300 cursor-pointer group ${
                            snapshot.isDragging 
                              ? 'shadow-2xl scale-[1.05] rotate-2 ring-4 ring-sage-300/50' 
                              : 'hover:shadow-2xl hover:scale-[1.02]'
                          }`}
                          onClick={() => handleExerciseClick(exercise)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                              {/* Enhanced Drag Handle */}
                              <div 
                                {...provided.dragHandleProps}
                                className="cursor-move text-sage-400 hover:text-sage-600 transition-all duration-300 p-2 rounded-xl hover:bg-sage-100/50 group-hover:scale-110"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              {/* Enhanced Exercise Number */}
                              <div className="w-10 h-10 bg-gradient-to-br from-sage-600 to-sage-700 text-white rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110">
                                {index + 1}
                              </div>

                              {/* Exercise Info with Better Typography */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sage-800 text-base leading-tight mb-2 truncate transition-colors duration-300 group-hover:text-sage-900">
                                  {exercise.name}
                                </h3>
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="outline" className="bg-sage-50/80 text-sage-600 border-sage-200 text-xs backdrop-blur-sm">
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

                              {/* Enhanced Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveExercise(exercise.id);
                                }}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50/80 rounded-2xl p-2 w-10 h-10 flex-shrink-0 transition-all duration-300 hover:scale-110 active:scale-90 backdrop-blur-sm"
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

        {/* Enhanced Bottom Spacing */}
        <div className="h-24" />
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
