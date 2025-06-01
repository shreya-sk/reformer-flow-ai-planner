
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Dumbbell, Plus, ShoppingCart, Check, Target, Star, TrendingUp, Play } from 'lucide-react';

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
      <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white border border-sage-200 hover:border-sage-300">
        <CardContent className="p-0">
          {/* Compact Image/Video Preview */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sage-50 to-sage-100">
            {exercise.image_url ? (
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-sage-400" />
              </div>
            )}
            
            {/* Compact overlay badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {exercise.is_featured && (
                <Badge className="text-xs bg-amber-500 text-white px-1.5 py-0.5">
                  <Star className="h-2.5 w-2.5 mr-1" />
                  Hot
                </Badge>
              )}
              {exercise.download_count > 50 && (
                <Badge variant="secondary" className="text-xs bg-blue-500 text-white px-1.5 py-0.5">
                  <TrendingUp className="h-2.5 w-2.5 mr-1" />
                  {exercise.download_count}
                </Badge>
              )}
            </div>
            
            {exercise.video_url && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white p-1 rounded flex items-center gap-1">
                <Play className="h-2.5 w-2.5" />
                <span className="text-xs">Video</span>
              </div>
            )}
          </div>

          <div className="p-3 space-y-2">
            {/* Title and category */}
            <div>
              <h3 className="font-medium text-sage-800 text-sm leading-tight line-clamp-2">{exercise.name}</h3>
              <Badge variant="secondary" className="text-xs mt-1 bg-sage-100 text-sage-600 px-1.5 py-0.5">
                {exercise.category}
              </Badge>
            </div>

            {/* Compact stats */}
            <div className="flex items-center justify-between text-xs text-sage-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{exercise.duration}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>{exercise.muscle_groups.slice(0, 2).join(', ')}</span>
              </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex items-center gap-1.5 pt-1">
              {isInLibrary ? (
                <Button size="sm" disabled className="flex-1 h-8 bg-green-600 text-white text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Owned
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToCart(exercise.id)}
                    disabled={isInCart}
                    className="flex-1 h-8 text-xs border-sage-300"
                  >
                    {isInCart ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        In Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Cart
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToLibrary(exercise.id)}
                    disabled={isAdding}
                    className={`bg-sage-600 hover:bg-sage-700 px-3 h-8 transition-all duration-300 ${
                      isAdding ? 'scale-105 bg-green-600' : ''
                    }`}
                  >
                    {isAdding ? (
                      <Check className="h-3 w-3 animate-bounce" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {featuredExercises.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <h3 className="text-base font-semibold text-sage-800">Featured</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-sage-800">All Exercises</h3>
          <div className="grid grid-cols-2 gap-3">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <Dumbbell className="h-8 w-8 text-sage-400 mx-auto mb-3" />
          <p className="text-sage-600 text-sm">No exercises found</p>
        </div>
      )}
    </div>
  );
};
