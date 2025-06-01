
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

  // Enhanced exercise images from the library
  const exerciseImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
  ];

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

  const getExerciseImage = (exerciseId: string) => {
    const index = parseInt(exerciseId.slice(-1)) || 0;
    return `${exerciseImages[index % exerciseImages.length]}?w=400&h=300&fit=crop`;
  };

  const renderExerciseCard = (exercise: StoreExercise) => {
    const isInCart = cartItems.includes(exercise.id);
    const isInLibrary = userLibrary.includes(exercise.id);
    const isAdding = addingExercises.includes(exercise.id);

    return (
      <Card key={exercise.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:scale-105 active:scale-95">
        <CardContent className="p-0">
          {/* Enhanced Image with better aspect ratio */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sage-50 to-sage-100">
            <img
              src={exercise.image_url || getExerciseImage(exercise.id)}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Floating badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {exercise.is_featured && (
                <Badge className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full border-0 shadow-lg backdrop-blur-sm">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            {exercise.video_url && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors">
                <Play className="h-4 w-4" />
              </div>
            )}

            {/* Enhanced overlay for quick add */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              {!isInLibrary && (
                <Button
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToLibrary(exercise.id);
                  }}
                  disabled={isAdding}
                  className={`rounded-full w-14 h-14 p-0 bg-white/95 hover:bg-white text-sage-600 shadow-xl transition-all duration-300 ${
                    isAdding ? 'scale-110 bg-green-500 text-white' : 'hover:scale-110'
                  }`}
                >
                  {isAdding ? (
                    <Check className="h-6 w-6 animate-bounce" />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                </Button>
              )}
            </div>

            {/* Bottom content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2">
                {exercise.name}
              </h3>
              <div className="flex items-center gap-3 text-white/90 text-sm mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{exercise.duration}min</span>
                </div>
                <span>•</span>
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className="bg-white/20 text-white px-3 py-1 rounded-full border-0 backdrop-blur-sm text-xs">
                  {exercise.category}
                </Badge>
                
                {isInLibrary && (
                  <div className="flex items-center gap-1 text-green-400 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Check className="h-3 w-3" />
                    <span>Owned</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {featuredExercises.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-sage-800">Featured Exercises</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-sage-800">All Exercises</h3>
          <div className="grid grid-cols-2 gap-4">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-16">
          <div className="p-6 bg-gradient-to-r from-sage-100 to-blue-100 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="h-12 w-12 text-sage-400" />
          </div>
          <h3 className="text-xl font-semibold text-sage-800 mb-2">No exercises found</h3>
          <p className="text-sage-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
