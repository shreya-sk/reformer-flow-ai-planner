
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, Trash2, GripVertical } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { useNavigate } from 'react-router-dom';

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
  onSaveClass,
  onAddExercise
}: ModernClassBuilderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState(currentClass.name);

  const totalDuration = currentClass.exercises.reduce((total, ex) => total + (ex.duration || 0), 0);
  const exerciseCount = currentClass.exercises.filter(ex => ex.category !== 'callout').length;

  const handleSaveName = () => {
    onUpdateClassName(className);
    setIsEditing(false);
  };

  const handleSaveAndTeach = () => {
    onSaveClass();
    // Navigate to teaching mode with the class
    navigate(`/teaching/${currentClass.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-sage-200/50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Class title */}
          <div className="flex items-center gap-3 mb-3">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-xl font-bold bg-transparent border-sage-300 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <h1 className="text-2xl font-bold text-sage-800">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-full"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sage-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{totalDuration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">{exerciseCount} exercises</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onAddExercise}
                variant="outline"
                size="sm"
                className="border-sage-300 text-sage-700 hover:bg-sage-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
              
              {currentClass.exercises.length > 0 && (
                <>
                  <Button
                    onClick={onSaveClass}
                    size="sm"
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  
                  <Button
                    onClick={handleSaveAndTeach}
                    size="sm"
                    className="bg-burgundy-700 hover:bg-burgundy-800 text-white"
                  >
                    Teach Class
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Exercise List */}
        <div className="space-y-2">
          {currentClass.exercises.map((exercise, index) => (
            <Card key={exercise.id} className="bg-white/70 backdrop-blur-xl border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Drag handle */}
                  <div className="cursor-grab hover:cursor-grabbing text-sage-400">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Exercise number */}
                  <div className="w-6 h-6 bg-sage-200 rounded-full flex items-center justify-center font-bold text-sage-700 text-xs">
                    {index + 1}
                  </div>

                  {/* Exercise image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sage-100">
                    <img
                      src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Exercise info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sage-800 truncate text-sm">{exercise.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs bg-sage-50 text-sage-600 border-sage-200 px-1.5 py-0.5">
                        {exercise.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sage-500 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{exercise.duration}min</span>
                      </div>
                      <SpringVisual springs={exercise.springs} />
                    </div>
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExercise(exercise.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {currentClass.exercises.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-sage-400" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-2">Start Building Your Class</h3>
              <p className="text-sage-600 mb-4">Add exercises to create your perfect class plan</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl">
                Add First Exercise
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
