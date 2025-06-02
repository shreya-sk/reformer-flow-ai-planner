import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus, Clock, Users, Target } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { formatDuration } from '@/utils/exerciseUtils';

interface ClassPlanCartProps {
  classPlan: ClassPlan;
  onUpdateClassPlan: (updates: Partial<ClassPlan>) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateExerciseDuration: (exerciseId: string, duration: number) => void;
  onAddCallout: (text: string, color: string) => void;
}

export const ClassPlanCart = ({
  classPlan,
  onUpdateClassPlan,
  onRemoveExercise,
  onUpdateExerciseDuration,
  onAddCallout
}: ClassPlanCartProps) => {
  const totalDuration = classPlan.exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const exerciseCount = classPlan.exercises.filter(ex => ex.category !== 'callout').length;

  const handleAddCallout = () => {
    const calloutText = prompt('Enter callout text:');
    if (calloutText) {
      const callout: Exercise = {
        id: `callout-${Date.now()}`,
        name: calloutText,
        category: 'callout',
        position: 'other',
        primaryMuscle: 'core',
        difficulty: 'beginner',
        intensityLevel: 'low',
        duration: 1,
        muscleGroups: [],
        equipment: [],
        springs: 'none',
        isPregnancySafe: true,
        description: '',
        image: '',
        videoUrl: '',
        notes: '',
        cues: [],
        setup: '',
        repsOrDuration: '',
        tempo: '',
        targetAreas: [],
        breathingCues: [],
        teachingFocus: [],
        modifications: [],
        progressions: [],
        regressions: [],
        transitions: [],
        contraindications: [],
        calloutColor: '#e5e7eb',
        isCustom: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onUpdateClassPlan({
        exercises: [...classPlan.exercises, callout]
      });
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Class Plan</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatDuration(totalDuration)}
          </div>
        </CardTitle>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {exerciseCount} exercises
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {classPlan.difficultyLevel || 'Mixed'} level
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4">
          {classPlan.exercises.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No exercises added yet</p>
              <p className="text-sm mt-2">Start building your class by adding exercises</p>
            </div>
          ) : (
            <div className="space-y-3">
              {classPlan.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`p-3 rounded-lg border ${
                    exercise.category === 'callout' 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {index + 1}.
                        </span>
                        <h4 className="font-medium text-sm truncate">
                          {exercise.name}
                        </h4>
                        {exercise.category === 'callout' && (
                          <Badge variant="secondary" className="text-xs">
                            Callout
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {exercise.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                        {exercise.springs !== 'none' && (
                          <Badge variant="outline" className="text-xs">
                            {exercise.springs} springs
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateExerciseDuration(exercise.id, Math.max(1, exercise.duration - 1))}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-xs font-medium w-8 text-center">
                        {exercise.duration}m
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateExerciseDuration(exercise.id, exercise.duration + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveExercise(exercise.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4 space-y-2">
          <Button
            variant="outline"
            onClick={handleAddCallout}
            className="w-full text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section Break
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            Total Duration: {formatDuration(totalDuration)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
