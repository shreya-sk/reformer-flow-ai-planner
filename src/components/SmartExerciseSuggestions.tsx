
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, Clock, Brain } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { exerciseDatabase } from '@/data/exercises';
import { SpringVisual } from './SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface SmartExerciseSuggestionsProps {
  currentClass: ClassPlan;
  onAddExercise: (exercise: Exercise) => void;
}

export const SmartExerciseSuggestions = ({ currentClass, onAddExercise }: SmartExerciseSuggestionsProps) => {
  const { preferences } = useUserPreferences();
  const [suggestions, setSuggestions] = useState<Exercise[]>([]);
  const [addedExercises, setAddedExercises] = useState<Set<string>>(new Set());

  const generateSuggestions = () => {
    const exercises = currentClass.exercises.filter(ex => ex.category !== 'callout');
    
    if (exercises.length === 0) {
      // First exercise suggestions - warm-up exercises
      const warmUpSuggestions = exerciseDatabase
        .filter(ex => ex.category === 'warm-up')
        .slice(0, 3);
      setSuggestions(warmUpSuggestions);
      return;
    }

    const lastExercise = exercises[exercises.length - 1];
    const usedMuscleGroups = new Set(exercises.flatMap(ex => ex.muscleGroups));
    const totalDuration = currentClass.totalDuration;
    const targetDuration = currentClass.classDuration || 45;
    
    // AI-powered suggestions based on class flow
    let candidates = exerciseDatabase.filter(exercise => {
      // Don't suggest the same exercise
      if (exercises.some(ex => ex.name === exercise.name)) return false;
      
      // Filter by pregnancy safety if enabled
      if (preferences.showPregnancySafeOnly && !exercise.isPregnancySafe) return false;
      
      return true;
    });

    // Score and sort suggestions
    candidates = candidates
      .map(exercise => ({
        exercise,
        score: calculateAIScore(exercise, lastExercise, usedMuscleGroups, totalDuration, targetDuration)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.exercise);

    setSuggestions(candidates);
  };

  const calculateAIScore = (
    exercise: Exercise, 
    lastExercise: Exercise, 
    usedGroups: Set<string>, 
    duration: number,
    targetDuration: number
  ): number => {
    let score = 0;
    
    // Time-based intelligent suggestions
    const remainingTime = targetDuration - duration;
    if (remainingTime <= 10 && exercise.category === 'cool-down') score += 10;
    if (remainingTime > 30 && exercise.category !== 'cool-down') score += 5;
    
    // Muscle group diversity
    const unusedCount = exercise.muscleGroups.filter(group => !usedGroups.has(group)).length;
    score += unusedCount * 3;
    
    // Smart position transitions for better flow
    const positionFlow = {
      'warm-up': ['supine', 'prone', 'sitting'],
      'supine': ['sitting', 'prone', 'side-lying'],
      'prone': ['sitting', 'kneeling', 'standing'],
      'sitting': ['standing', 'kneeling', 'side-lying'],
      'standing': ['sitting', 'kneeling', 'cool-down'],
      'side-lying': ['supine', 'sitting'],
      'kneeling': ['standing', 'sitting', 'cool-down'],
      'cool-down': []
    };
    
    const goodTransition = positionFlow[lastExercise.category]?.includes(exercise.category);
    if (goodTransition) score += 4;
    
    // Difficulty progression (avoid jumping too high)
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const lastDiff = difficultyMap[lastExercise.difficulty];
    const currentDiff = difficultyMap[exercise.difficulty];
    if (Math.abs(currentDiff - lastDiff) <= 1) score += 2;
    
    // Spring consistency (minimize setup changes)
    if (exercise.springs === lastExercise.springs) score += 3;
    
    // Intensity variation (avoid fatigue)
    const intensityMap = { low: 1, medium: 2, high: 3 };
    const lastIntensity = intensityMap[lastExercise.intensityLevel];
    const currentIntensity = intensityMap[exercise.intensityLevel];
    if (currentIntensity !== lastIntensity) score += 1;
    
    return score;
  };

  const handleAddExercise = (exercise: Exercise) => {
    console.log('Adding suggested exercise:', exercise.name);
    
    // Create a unique copy of the exercise
    const uniqueId = `${exercise.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const exerciseToAdd = {
      ...exercise,
      id: uniqueId,
    };
    
    onAddExercise(exerciseToAdd);
    
    // Track added exercises for visual feedback
    setAddedExercises(prev => new Set([...prev, exercise.id]));
    
    // Remove feedback after 2 seconds
    setTimeout(() => {
      setAddedExercises(prev => {
        const newSet = new Set(prev);
        newSet.delete(exercise.id);
        return newSet;
      });
    }, 2000);
  };

  useEffect(() => {
    generateSuggestions();
  }, [currentClass.exercises, preferences.showPregnancySafeOnly]);

  if (suggestions.length === 0) return null;

  return (
    <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} shadow-sm mb-4`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-blue-800'}`}>
          <Brain className="h-4 w-4" />
          AI Exercise Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((exercise, index) => (
          <div key={exercise.id} className={`flex items-center gap-3 p-3 ${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-blue-100'} rounded-lg border hover:border-blue-200 transition-colors`}>
            <div className={`flex-shrink-0 w-8 h-8 ${preferences.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gradient-to-br from-blue-100 to-blue-200'} rounded-full flex items-center justify-center`}>
              <span className={`text-xs font-semibold ${preferences.darkMode ? 'text-gray-300' : 'text-blue-700'}`}>{index + 1}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${preferences.darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>{exercise.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exercise.duration}min</span>
                </div>
                <SpringVisual springs={exercise.springs} />
                <Badge variant="outline" className={`text-xs ${preferences.darkMode ? 'border-gray-500 text-gray-300' : 'border-blue-200 text-blue-700'}`}>
                  {exercise.category}
                </Badge>
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={() => handleAddExercise(exercise)}
              disabled={addedExercises.has(exercise.id)}
              className={`h-8 w-8 p-0 transition-all duration-300 ${
                addedExercises.has(exercise.id)
                  ? 'bg-green-500 hover:bg-green-500 text-white scale-110'
                  : preferences.darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {addedExercises.has(exercise.id) ? (
                <Lightbulb className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
