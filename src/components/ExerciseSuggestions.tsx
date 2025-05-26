
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, Clock } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { exerciseDatabase } from '@/data/exercises';

interface ExerciseSuggestionsProps {
  currentClass: ClassPlan;
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseSuggestions = ({ currentClass, onAddExercise }: ExerciseSuggestionsProps) => {
  const getSuggestions = (): Exercise[] => {
    if (currentClass.exercises.length === 0) {
      // First exercise suggestions
      return exerciseDatabase
        .filter(ex => ex.category === 'warm-up')
        .slice(0, 3);
    }

    const lastExercise = currentClass.exercises[currentClass.exercises.length - 1];
    const usedMuscleGroups = new Set(currentClass.exercises.flatMap(ex => ex.muscleGroups));
    const totalDuration = currentClass.totalDuration;
    
    // Find complementary exercises
    let suggestions = exerciseDatabase.filter(exercise => {
      // Don't suggest the same exercise
      if (currentClass.exercises.some(ex => ex.name === exercise.name)) return false;
      
      // Suggest cool-down if class is getting long
      if (totalDuration >= 40 && exercise.category === 'cool-down') return true;
      
      // Suggest exercises that work different muscle groups
      const hasUnusedMuscleGroup = exercise.muscleGroups.some(group => !usedMuscleGroups.has(group));
      
      // Good transitions based on position
      const positionFlow = {
        'warm-up': ['supine', 'prone'],
        'supine': ['sitting', 'prone', 'side-lying'],
        'prone': ['sitting', 'kneeling'],
        'sitting': ['standing', 'kneeling', 'side-lying'],
        'standing': ['sitting', 'kneeling'],
        'side-lying': ['supine', 'sitting'],
        'kneeling': ['standing', 'cool-down'],
        'cool-down': []
      };
      
      const goodTransition = positionFlow[lastExercise.category]?.includes(exercise.category);
      
      return hasUnusedMuscleGroup || goodTransition;
    });

    // Score and sort suggestions
    suggestions = suggestions
      .map(exercise => ({
        exercise,
        score: calculateScore(exercise, lastExercise, usedMuscleGroups, totalDuration)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.exercise);

    return suggestions;
  };

  const calculateScore = (exercise: Exercise, lastExercise: Exercise, usedGroups: Set<string>, duration: number): number => {
    let score = 0;
    
    // Prefer exercises with unused muscle groups
    const unusedCount = exercise.muscleGroups.filter(group => !usedGroups.has(group)).length;
    score += unusedCount * 3;
    
    // Good spring transitions (avoid too many changes)
    if (exercise.springs === lastExercise.springs) score += 2;
    
    // Time-based suggestions
    if (duration >= 35 && exercise.category === 'cool-down') score += 5;
    if (duration < 10 && exercise.category === 'warm-up') score += 3;
    
    // Difficulty progression
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const lastDiff = difficultyMap[lastExercise.difficulty];
    const currentDiff = difficultyMap[exercise.difficulty];
    if (currentDiff >= lastDiff && currentDiff <= lastDiff + 1) score += 1;
    
    return score;
  };

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

  const suggestions = getSuggestions();

  if (suggestions.length === 0) return null;

  return (
    <Card className="mb-4 border-sage-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
          <Lightbulb className="h-4 w-4" />
          Suggested Next Exercises
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((exercise, index) => (
          <div key={exercise.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-700">{index + 1}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 leading-tight">{exercise.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{exercise.duration}min</span>
                </div>
                {getSpringVisual(exercise.springs)}
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                  {exercise.category}
                </Badge>
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={() => onAddExercise(exercise)}
              className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
