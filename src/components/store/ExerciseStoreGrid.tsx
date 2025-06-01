
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Dumbbell, Plus, Check, Star, Play } from 'lucide-react';

interface StoreExercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  springs: string;
  muscle_groups: string[];
  description: string;
  image_url: string;
  video_url: string;
  is_featured: boolean;
  download_count: number;
}

interface ExerciseStoreGridProps {
  exercises: StoreExercise[];
  searchTerm: string;
  selectedCategory: string;
  onAddToCart: (exerciseId: string) => void;
  onAddToLibrary: (exerciseId: string) => Promise<void>;
  cartItems: string[];
  userLibrary: string[];
}

export const ExerciseStoreGrid = ({
  exercises,
  searchTerm,
  selectedCategory,
  onAddToCart,
  onAddToLibrary,
  cartItems,
  userLibrary
}: ExerciseStoreGridProps) => {
  const [addingExercises, setAddingExercises] = useState<string[]>([]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = !searchTerm || 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscle_groups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

  const featuredExercises = filteredExercises.filter(ex => ex.is_featured);
  const regularExercises = filteredExercises.filter(ex => !ex.is_featured);

  const handleAddToLibrary = async (exerciseId: string) => {
    if (addingExercises.includes(exerciseId)) return;
    
    setAddingExercises(prev => [...prev, exerciseId]);
    try {
      await onAddToLibrary(exerciseId);
    } finally {
      setTimeout(() => {
        setAddingExercises(prev => prev.filter(id => id !== exerciseId));
      }, 2000);
    }
  };

  const renderExerciseCard = (exercise: StoreExercise) => {
    const isInCart = cartItems.includes(exercise.id);
    const isInLibrary = userLibrary.includes(exercise.id);
    const isAdding = addingExercises.includes(exercise.id);

    return (
      <Card key={exercise.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:scale-105 active:scale-95">
        <CardContent className="p-0">
          {/* Compact Image/Video Preview */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-sage-50 to-sage-100 rounded-3xl">
            {exercise.image_url ? (
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-sage-400" />
              </div>
            )}
            
            {/* Floating badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {exercise.is_featured && (
                <Badge className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full border-0 shadow-lg">
                  <Star className="h-2 w-2 mr-1" />
                  Hot
                </Badge>
              )}
            </div>
            
            {exercise.video_url && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded-full backdrop-blur-sm">
                <Play className="h-2 w-2" />
              </div>
            )}

            {/* Overlay for quick add */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              {!isInLibrary && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToLibrary(exercise.id);
                  }}
                  disabled={isAdding}
                  className={`rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white text-sage-600 shadow-lg transition-all duration-300 ${
                    isAdding ? 'scale-110 bg-green-500 text-white' : 'hover:scale-110'
                  }`}
                >
                  {isAdding ? (
                    <Check className="h-4 w-4 animate-bounce" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="p-3 space-y-2">
            {/* Title */}
            <div>
              <h3 className="font-semibold text-sage-800 text-xs leading-tight line-clamp-2 mb-1">
                {exercise.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-sage-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-2 w-2" />
                  <span>{exercise.duration}min</span>
                </div>
                <span>•</span>
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
            </div>

            {/* Category badge */}
            <Badge variant="secondary" className="text-xs bg-sage-100 text-sage-600 px-2 py-1 rounded-full border-0">
              {exercise.category}
            </Badge>

            {/* Status indicator */}
            {isInLibrary && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <Check className="h-2 w-2" />
                <span>In Library</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {featuredExercises.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
              <Star className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-sage-800">Featured</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-sage-800">All Exercises</h3>
          <div className="grid grid-cols-3 gap-3">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-sage-100 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-8 w-8 text-sage-400" />
          </div>
          <p className="text-sage-600 text-sm">No exercises found</p>
        </div>
      )}
    </div>
  );
};
