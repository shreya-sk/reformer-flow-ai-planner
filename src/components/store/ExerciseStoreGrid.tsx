
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

  // Use your uploaded reformer/pilates images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png',
    '/lovable-uploads/156c5622-2826-4e16-8de0-e4c9aaa78cd3.png',
    '/lovable-uploads/52c9b506-ac25-4335-8a26-0c2b10d2c954.png',
    '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png',
    '/lovable-uploads/8cb5e632-af4e-471a-a2c4-0371ce90cda2.png'
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
    return reformerImages[index % reformerImages.length];
  };

  const renderExerciseCard = (exercise: StoreExercise) => {
    const isInCart = cartItems.includes(exercise.id);
    const isInLibrary = userLibrary.includes(exercise.id);
    const isAdding = addingExercises.includes(exercise.id);

    return (
      <Card key={exercise.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:scale-105 active:scale-95">
        <CardContent className="p-0">
          {/* Enhanced Image with pill-shaped design */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sage-50 to-sage-100 rounded-3xl">
            <img
              src={exercise.image_url || getExerciseImage(exercise.id)}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-3xl"
            />
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl"></div>
            
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

            {/* Enhanced overlay for quick add - pill-shaped button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl">
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

            {/* Bottom content overlay - improved mobile text */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white text-sm sm:text-lg leading-tight mb-2 line-clamp-2">
                {exercise.name}
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm mb-2">
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
                  <div className="flex items-center gap-1 text-green-400 text-xs sm:text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
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
    <div className="space-y-6 sm:space-y-8">
      {featuredExercises.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-sage-800">Featured Exercises</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-sage-800">All Exercises</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="p-4 sm:p-6 bg-gradient-to-r from-sage-100 to-sage-200 rounded-3xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Dumbbell className="h-10 w-10 sm:h-12 sm:w-12 text-sage-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-sage-800 mb-2">No exercises found</h3>
          <p className="text-sage-600 text-sm sm:text-base">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
