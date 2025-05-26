
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Clock, Zap, BookOpen } from 'lucide-react';
import { ClassPlan, Exercise } from '@/types/reformer';

interface ClassBuilderProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  savedClasses: ClassPlan[];
}

export const ClassBuilder = ({ currentClass, onRemoveExercise, savedClasses }: ClassBuilderProps) => {
  const getSpringColor = (springs: string) => {
    switch (springs) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      case 'mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMuscleGroupCoverage = () => {
    const allGroups = currentClass.exercises.flatMap(ex => ex.muscleGroups);
    const uniqueGroups = Array.from(new Set(allGroups));
    return uniqueGroups;
  };

  const getSpringChanges = () => {
    let changes = 0;
    for (let i = 1; i < currentClass.exercises.length; i++) {
      if (currentClass.exercises[i].springs !== currentClass.exercises[i - 1].springs) {
        changes++;
      }
    }
    return changes;
  };

  const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="bg-sage-100 text-sage-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
              {index + 1}
            </span>
            <CardTitle className="text-sm font-medium text-sage-800">
              {exercise.name}
            </CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveExercise(exercise.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-sage-500" />
            <span className="text-xs text-sage-600">{exercise.duration}min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-sage-500" />
            <Badge className={`text-xs ${getSpringColor(exercise.springs)}`}>
              {exercise.springs}
            </Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            {exercise.category}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {exercise.muscleGroups.map(group => (
            <Badge key={group} variant="secondary" className="text-xs">
              {group}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 bg-sage-50">
      <Tabs defaultValue="current" className="h-full flex flex-col">
        <TabsList className="m-4 mb-0">
          <TabsTrigger value="current">Current Class</TabsTrigger>
          <TabsTrigger value="saved">My Classes ({savedClasses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="flex-1 m-4 mt-2">
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* Class Timeline */}
            <div className="col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg text-sage-800">Class Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    {currentClass.exercises.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-sage-600 mb-2">Start Building Your Class</h3>
                        <p className="text-sage-500 text-sm">
                          Add exercises from the library to create your perfect Reformer flow
                        </p>
                      </div>
                    ) : (
                      <div>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-sage-800">Class Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sage-600">Duration</span>
                    <span className="font-medium text-sage-800">{currentClass.totalDuration}min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sage-600">Exercises</span>
                    <span className="font-medium text-sage-800">{currentClass.exercises.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sage-600">Spring Changes</span>
                    <span className="font-medium text-sage-800">{getSpringChanges()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-sage-800">Muscle Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {getMuscleGroupCoverage().length === 0 ? (
                      <span className="text-sm text-sage-500">No exercises added</span>
                    ) : (
                      getMuscleGroupCoverage().map(group => (
                        <Badge key={group} variant="secondary" className="text-xs">
                          {group}
                        </Badge>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {currentClass.exercises.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-sage-800">Flow Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {getSpringChanges() > 5 && (
                        <div className="text-amber-600 bg-amber-50 p-2 rounded-md">
                          ⚠️ Many spring changes ({getSpringChanges()})
                        </div>
                      )}
                      {currentClass.totalDuration > 60 && (
                        <div className="text-blue-600 bg-blue-50 p-2 rounded-md">
                          ℹ️ Long class ({currentClass.totalDuration}min)
                        </div>
                      )}
                      {getMuscleGroupCoverage().length >= 5 && (
                        <div className="text-green-600 bg-green-50 p-2 rounded-md">
                          ✓ Well-balanced muscle groups
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="flex-1 m-4 mt-2">
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
