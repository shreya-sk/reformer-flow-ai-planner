
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, Edit3, Save, Trash2, GripVertical } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';

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
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState(currentClass.name);

  const totalDuration = currentClass.exercises.reduce((total, ex) => total + (ex.duration || 0), 0);
  const exerciseCount = currentClass.exercises.filter(ex => ex.category !== 'callout').length;

  const handleSaveName = () => {
    onUpdateClassName(className);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-sage-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Class title */}
          <div className="flex items-center gap-3 mb-4">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-0 focus:ring-0 p-0 h-auto"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <h1 className="text-3xl font-bold text-sage-800">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-full p-2"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sage-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{totalDuration} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">{exerciseCount} exercises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Add Exercise Button */}
        <Card className="mb-6 bg-white/60 backdrop-blur-xl border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={onAddExercise}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 text-sage-600 group-hover:text-sage-800 transition-colors">
              <div className="p-3 bg-sage-100 rounded-2xl group-hover:bg-sage-200 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium">Add Exercise</span>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <div className="space-y-3">
          {currentClass.exercises.map((exercise, index) => (
            <Card key={exercise.id} className="bg-white/70 backdrop-blur-xl border-0 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Drag handle */}
                  <div className="cursor-grab hover:cursor-grabbing text-sage-400">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Exercise number */}
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 text-sm">
                    {index + 1}
                  </div>

                  {/* Exercise image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-sage-100">
                    <img
                      src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Exercise info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sage-800 truncate">{exercise.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-xs bg-sage-50 text-sage-600 border-sage-200">
                        {exercise.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sage-500 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{exercise.duration}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SpringVisual springs={exercise.springs} />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveExercise(exercise.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-2 w-8 h-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {currentClass.exercises.length === 0 && (
          <Card className="bg-white/40 backdrop-blur-xl border-0 rounded-3xl shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="p-6 bg-sage-100 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-sage-400" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 mb-2">Start Building Your Class</h3>
              <p className="text-sage-600 mb-6">Add exercises to create your perfect class plan</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-2xl px-8">
                Add First Exercise
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Save button */}
        {currentClass.exercises.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={onSaveClass}
              className="bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-full px-8 py-3 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Class
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
