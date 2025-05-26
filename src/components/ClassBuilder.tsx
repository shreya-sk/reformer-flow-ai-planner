import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Clock, GripVertical, BookOpen } from 'lucide-react';
import { ClassPlan, Exercise } from '@/types/reformer';
import { ExerciseSuggestions } from './ExerciseSuggestions';

interface ClassBuilderProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (updatedExercise: Exercise) => void;
  savedClasses: ClassPlan[];
  onAddExercise: (exercise: Exercise) => void;
}

export const ClassBuilder = ({ 
  currentClass, 
  onRemoveExercise, 
  onReorderExercises, 
  onUpdateExercise,
  savedClasses, 
  onAddExercise 
}: ClassBuilderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const getSpringVisual = (springs: string) => {
    const springConfig = {
      'light': [{ color: 'bg-green-500', count: 1 }],
      'medium': [{ color: 'bg-yellow-500', count: 1 }],
      'heavy': [{ color: 'bg-red-500', count: 2 }],
      'mixed': [
        { color: 'bg-red-500', count: 1 },
        { color: 'bg-yellow-500', count: 1 },
        { color: 'bg-green-500', count: 1 }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-1">
        {config.map((spring, index) => (
          <div key={index} className="flex gap-0.5">
            {Array.from({ length: spring.count }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${spring.color}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const exercises = [...currentClass.exercises];
    const draggedExercise = exercises[draggedIndex];
    exercises.splice(draggedIndex, 1);
    exercises.splice(dropIndex, 0, draggedExercise);
    
    onReorderExercises(exercises);
    setDraggedIndex(null);
  };

  const getMuscleGroupCoverage = () => {
    const allGroups = currentClass.exercises.flatMap(ex => ex.muscleGroups);
    return Array.from(new Set(allGroups));
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      className={`group mb-3 transition-all duration-200 ${
        draggedIndex === index ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'
      }`}
    >
      <Card className="border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-5 w-5 text-sage-500" />
            </div>

            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-sage-600">{index + 1}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sage-800 text-sm leading-tight">
                  {exercise.name}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-sage-500" />
                  <span className="text-xs text-sage-600 font-medium">{exercise.duration}min</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-sage-500">Springs:</span>
                  {getSpringVisual(exercise.springs)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium border-sage-300 text-sage-700">
                  {exercise.category}
                </Badge>
                <div className="flex gap-1">
                  {exercise.muscleGroups.slice(0, 2).map(group => (
                    <Badge key={group} variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex-1 bg-gradient-to-br from-sage-25 to-white">
      <Tabs defaultValue="current" className="h-full flex flex-col">
        <div className="bg-white border-b border-sage-200 p-4">
          <TabsList className="w-full bg-sage-50">
            <TabsTrigger value="current" className="flex-1">Current Class</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">My Classes ({savedClasses.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="flex-1 p-6">
          <div className="grid grid-cols-4 gap-6 h-full">
            <div className="col-span-3">
              <Card className="h-full shadow-sm border-sage-200">
                <CardHeader className="border-b border-sage-100 bg-white">
                  <CardTitle className="text-lg text-sage-800 font-semibold">Class Timeline</CardTitle>
                  {currentClass.exercises.length > 0 && (
                    <p className="text-sm text-sage-600">
                      Drag exercises to reorder • {currentClass.exercises.length} exercises • {currentClass.totalDuration} minutes
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    {currentClass.exercises.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="bg-sage-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-sage-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-sage-700 mb-2">Start Building Your Class</h3>
                        <p className="text-sage-500 text-sm max-w-sm mx-auto">
                          Add exercises from the library to create your perfect Reformer flow. Drag to reorder once added.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        <ExerciseSuggestions 
                          currentClass={currentClass} 
                          onAddExercise={onAddExercise}
                        />
                        {currentClass.exercises.map((exercise, index) => (
                          <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Class Analytics */}
            <div className="space-y-4">
              <Card className="shadow-sm border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-sage-800 font-semibold">Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sage-600">Duration</span>
                    <span className="font-semibold text-sage-800">{currentClass.totalDuration}min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sage-600">Exercises</span>
                    <span className="font-semibold text-sage-800">{currentClass.exercises.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-sage-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-sage-800 font-semibold">Muscle Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {getMuscleGroupCoverage().length === 0 ? (
                      <span className="text-sm text-sage-500">No exercises added</span>
                    ) : (
                      getMuscleGroupCoverage().map(group => (
                        <Badge key={group} className="text-xs bg-sage-100 text-sage-700 border-sage-300">
                          {group}
                        </Badge>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {currentClass.exercises.length > 0 && (
                <Card className="shadow-sm border-sage-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-sage-800 font-semibold">Spring Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sage-600">Light</span>
                      <div className="bg-green-500 w-2 h-2 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sage-600">Medium</span>
                      <div className="bg-yellow-500 w-2 h-2 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sage-600">Heavy</span>
                      <div className="flex gap-0.5">
                        <div className="bg-red-500 w-2 h-2 rounded-full" />
                        <div className="bg-red-500 w-2 h-2 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="flex-1 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg text-sage-800">Saved Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-280px)]">
                {savedClasses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-sage-600 mb-2">No Saved Classes</h3>
                    <p className="text-sage-500 text-sm">
                      Classes you save will appear here for future use
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {savedClasses.map((classItem) => (
                      <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-sage-800">
                            {classItem.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4 text-xs text-sage-600 mb-2">
                            <span>{classItem.totalDuration}min</span>
                            <span>{classItem.exercises.length} exercises</span>
                            <span>{new Date(classItem.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(classItem.exercises.flatMap(ex => ex.muscleGroups))).slice(0, 3).map(group => (
                              <Badge key={group} variant="secondary" className="text-xs">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
