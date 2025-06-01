
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Dumbbell, Heart, Clock } from 'lucide-react';
import { Exercise, ExerciseCategory } from '@/types/reformer';
import { useExercises } from '@/hooks/useExercises';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ModernExerciseModal } from './ModernExerciseModal';

// Category mapping to group exercises
const categoryMapping = {
  'warm-up': 'Warm-up',
  'arms': 'Arms', 
  'core': 'Core',
  'legs': 'Legs',
  'back': 'Back',
  'cool-down': 'Cool-down'
};

const getCategoryForExercise = (exercise: Exercise): string => {
  // Check category first
  if (exercise.category === 'warm-up') return 'Warm-up';
  if (exercise.category === 'cool-down') return 'Cool-down';
  
  // Check muscle groups
  if (exercise.muscleGroups.includes('core') || exercise.muscleGroups.includes('upper-abs') || exercise.muscleGroups.includes('lower-abs')) return 'Core';
  if (exercise.muscleGroups.includes('arms') || exercise.muscleGroups.includes('biceps') || exercise.muscleGroups.includes('triceps')) return 'Arms';
  if (exercise.muscleGroups.includes('legs') || exercise.muscleGroups.includes('quadriceps') || exercise.muscleGroups.includes('hamstrings')) return 'Legs';
  if (exercise.muscleGroups.includes('back') || exercise.muscleGroups.includes('lats') || exercise.muscleGroups.includes('rhomboids')) return 'Back';
  
  return 'Core'; // Default
};

export const CategoryExerciseLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const { exercises } = useExercises();
  const { preferences, toggleFavoriteExercise } = useUserPreferences();

  // Group exercises by category
  const categorizedExercises = useMemo(() => {
    const grouped: Record<string, Exercise[]> = {
      'Warm-up': [],
      'Arms': [],
      'Core': [],
      'Legs': [],
      'Back': [],
      'Cool-down': []
    };

    exercises.forEach(exercise => {
      const category = getCategoryForExercise(exercise);
      if (grouped[category]) {
        grouped[category].push(exercise);
      }
    });

    return grouped;
  }, [exercises]);

  const categoryColors = {
    'Warm-up': 'from-sage-400 to-sage-500',
    'Arms': 'from-sage-500 to-sage-600', 
    'Core': 'from-burgundy-700 to-burgundy-800',
    'Legs': 'from-sage-600 to-sage-700',
    'Back': 'from-sage-400 to-sage-500',
    'Cool-down': 'from-sage-300 to-sage-400'
  };

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory(null)}
            className="p-2 rounded-full hover:bg-sage-100"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          <h2 className="text-2xl font-bold text-sage-800">{selectedCategory}</h2>
          <Badge className="bg-sage-100 text-sage-700">
            {categorizedExercises[selectedCategory]?.length || 0} exercises
          </Badge>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categorizedExercises[selectedCategory]?.map((exercise) => (
            <Card 
              key={exercise.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 rounded-2xl overflow-hidden"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteExercise(exercise.id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/20 backdrop-blur-sm"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        preferences.favoriteExercises?.includes(exercise.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-white'
                      }`} 
                    />
                  </button>

                  {/* Exercise info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-medium text-white text-sm mb-1">{exercise.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{exercise.duration}min</span>
                      <span>•</span>
                      <span className="capitalize">{exercise.difficulty}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modern Exercise Modal */}
        {selectedExercise && (
          <ModernExerciseModal
            exercise={selectedExercise}
            isOpen={!!selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sage-800 mb-2">Exercise Library</h1>
        <p className="text-sage-600">Choose a category to explore exercises</p>
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        {Object.entries(categoryMapping).map(([key, label]) => {
          const exerciseCount = categorizedExercises[label]?.length || 0;
          
          return (
            <Card 
              key={key}
              className="cursor-pointer hover:shadow-xl transition-all duration-500 hover:scale-105 bg-white/60 backdrop-blur-xl border-0 rounded-3xl overflow-hidden group"
              onClick={() => setSelectedCategory(label)}
            >
              <CardContent className="p-0">
                <div className={`relative h-20 bg-gradient-to-r ${categoryColors[label]} flex items-center justify-between px-6`}>
                  {/* Category info */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{label}</h3>
                      <p className="text-white/80 text-sm">{exerciseCount} exercises</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
