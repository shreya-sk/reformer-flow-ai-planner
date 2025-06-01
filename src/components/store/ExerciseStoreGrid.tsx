
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Dumbbell, Plus, ShoppingCart, Check } from 'lucide-react';

interface StoreExercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  springs: string;
  muscle_groups: string[];
  description: string;
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
  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = !searchTerm || 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

  const featuredExercises = filteredExercises.filter(ex => ex.is_featured);
  const regularExercises = filteredExercises.filter(ex => !ex.is_featured);

  const renderExerciseCard = (exercise: StoreExercise) => {
    const isInCart = cartItems.includes(exercise.id);
    const isInLibrary = userLibrary.includes(exercise.id);

    return (
      <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sage-800 truncate">{exercise.name}</h3>
                  {exercise.is_featured && (
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                      Featured
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs mb-2">
                  {exercise.category}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-sage-600 line-clamp-2">
              {exercise.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-sage-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{exercise.duration}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="h-3 w-3" />
                <span className="capitalize">{exercise.springs}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isInLibrary ? (
                <Button size="sm" disabled className="flex-1 bg-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  In Library
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddToCart(exercise.id)}
                    disabled={isInCart}
                    className="flex-1"
                  >
                    {isInCart ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        In Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAddToLibrary(exercise.id)}
                    className="bg-sage-600 hover:bg-sage-700"
                  >
                    <Plus className="h-4 w-4" />
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
    <div className="space-y-6">
      {featuredExercises.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-sage-800">Featured Exercises</h3>
          <div className="grid grid-cols-1 gap-3">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-sage-800">All Exercises</h3>
          <div className="grid grid-cols-1 gap-3">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sage-600">No exercises found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
