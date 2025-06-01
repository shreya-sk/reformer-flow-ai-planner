
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
      {/* Compact Mobile Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-sage-200/50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Class title - more compact */}
          <div className="flex items-center gap-2 mb-3">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="text-lg font-bold bg-transparent border-0 focus:ring-0 p-0 h-auto"
                  placeholder="Class name"
                />
                <Button size="sm" onClick={handleSaveName} className="bg-sage-600 hover:bg-sage-700 px-2 py-1">
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <h1 className="text-xl font-bold text-sage-800 truncate">{currentClass.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="text-sage-600 hover:bg-sage-100 rounded-full p-1"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Compact Stats */}
          <div className="flex items-center gap-4 text-sage-600 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{totalDuration}min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="font-medium">{exerciseCount} ex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Compact Add Exercise Button */}
        <Card className="mb-4 bg-white/60 backdrop-blur-xl border-0 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={onAddExercise}>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-sage-600 group-hover:text-sage-800 transition-colors">
              <div className="p-2 bg-sage-100 rounded-xl group-hover:bg-sage-200 transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Add Exercise</span>
            </div>
          </CardContent>
        </Card>

        {/* Compact Exercise List */}
        <div className="space-y-2">
          {currentClass.exercises.map((exercise, index) => (
            <Card key={exercise.id} className="bg-white/70 backdrop-blur-xl border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  {/* Compact drag handle */}
                  <div className="cursor-grab hover:cursor-grabbing text-sage-400">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Compact exercise number */}
                  <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center font-bold text-sage-700 text-xs">
                    {index + 1}
                  </div>

                  {/* Compact exercise image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sage-100 flex-shrink-0">
                    <img
                      src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Compact exercise info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sage-800 truncate text-sm leading-tight">{exercise.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] bg-sage-50 text-sage-600 border-sage-200 px-1 py-0">
                        {exercise.category}
                      </Badge>
                      <div className="flex items-center gap-0.5 text-sage-500 text-xs">
                        <Clock className="h-2 w-2" />
                        <span>{exercise.duration}min</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <SpringVisual springs={exercise.springs} />
                      </div>
                    </div>
                  </div>

                  {/* Compact Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveExercise(exercise.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 w-6 h-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compact Empty state */}
        {currentClass.exercises.length === 0 && (
          <Card className="bg-white/40 backdrop-blur-xl border-0 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-sage-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-sage-400" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-2">Start Building</h3>
              <p className="text-sage-600 mb-4 text-sm">Add exercises to create your class</p>
              <Button onClick={onAddExercise} className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl px-6">
                Add First Exercise
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Compact Save button */}
        {currentClass.exercises.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={onSaveClass}
              className="bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-full px-6 py-2 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
