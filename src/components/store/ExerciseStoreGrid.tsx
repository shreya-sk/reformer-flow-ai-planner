
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Dumbbell, Plus, ShoppingCart, Check, Target, Star, TrendingUp } from 'lucide-react';

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

  const getWhyUseful = (exercise: StoreExercise) => {
    const benefits = [];
    
    if (exercise.muscle_groups.includes('core')) {
      benefits.push('Core strengthening');
    }
    if (exercise.difficulty === 'beginner') {
      benefits.push('Perfect for newcomers');
    }
    if (exercise.difficulty === 'advanced') {
      benefits.push('Challenge your limits');
    }
    if (exercise.duration <= 3) {
      benefits.push('Quick & effective');
    }
    if (exercise.muscle_groups.includes('full-body')) {
      benefits.push('Total body workout');
    }
    if (exercise.springs === 'light') {
      benefits.push('Joint-friendly');
    }
    if (exercise.download_count > 100) {
      benefits.push('Instructor favorite');
    }
    
    return benefits.slice(0, 2);
  };

  const renderExerciseCard = (exercise: StoreExercise) => {
    const isInCart = cartItems.includes(exercise.id);
    const isInLibrary = userLibrary.includes(exercise.id);
    const isAdding = addingExercises.includes(exercise.id);
    const whyUseful = getWhyUseful(exercise);

    return (
      <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-white to-sage-25 border-sage-200">
        <CardContent className="p-0">
          {/* Image/Video Preview */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-sage-100 to-sage-200">
            {exercise.image_url ? (
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center">
                <Dumbbell className="h-8 w-8 text-sage-500" />
              </div>
            )}
            
            {/* Overlay badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {exercise.is_featured && (
                <Badge className="text-xs bg-amber-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {exercise.download_count > 50 && (
                <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            
            {exercise.video_url && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                Video
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sage-800 truncate">{exercise.name}</h3>
                <Badge variant="secondary" className="text-xs mt-1 bg-sage-100 text-sage-700">
                  {exercise.category}
                </Badge>
              </div>
            </div>

            {/* Why Useful Section */}
            {whyUseful.length > 0 && (
              <div className="bg-sage-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-sage-700 mb-1">Why this exercise?</p>
                <div className="flex flex-wrap gap-1">
                  {whyUseful.map((benefit, index) => (
                    <span key={index} className="text-xs bg-sage-200 text-sage-700 px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-sage-600 line-clamp-2">
              {exercise.description}
            </p>

            {/* Exercise Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs text-sage-500">
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

            {/* Muscle Groups */}
            {exercise.muscle_groups.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-sage-600">
                <Target className="h-3 w-3" />
                <span>Targets: {exercise.muscle_groups.slice(0, 3).join(', ')}</span>
                {exercise.muscle_groups.length > 3 && (
                  <span className="text-sage-400">+{exercise.muscle_groups.length - 3} more</span>
                )}
              </div>
            )}

            {/* Download count */}
            <div className="text-xs text-sage-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {exercise.download_count} downloads
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {isInLibrary ? (
                <Button size="sm" disabled className="flex-1 bg-green-600 text-white">
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
                    onClick={() => handleAddToLibrary(exercise.id)}
                    disabled={isAdding}
                    className={`bg-sage-600 hover:bg-sage-700 px-3 transition-all duration-300 ${
                      isAdding ? 'scale-105 bg-green-600' : ''
                    }`}
                  >
                    {isAdding ? (
                      <Check className="h-4 w-4 animate-bounce" />
                    ) : (
                      <Plus className="h-4 w-4" />
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
    <div className="space-y-6">
      {featuredExercises.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-sage-800">Featured Exercises</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-sage-800">All Exercises</h3>
          <div className="grid grid-cols-1 gap-4">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <Dumbbell className="h-12 w-12 text-sage-400 mx-auto mb-4" />
          <p className="text-sage-600">No exercises found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
