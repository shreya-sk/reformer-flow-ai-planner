
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Check, Star, Play, Heart, Download } from 'lucide-react';

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

interface CleanExerciseStoreGridProps {
  exercises: StoreExercise[];
  searchTerm: string;
  selectedCategory: string;
  onAddToLibrary: (exerciseId: string) => Promise<void>;
  userLibrary: string[];
}

export const CleanExerciseStoreGrid = ({
  exercises,
  searchTerm,
  selectedCategory,
  onAddToLibrary,
  userLibrary
}: CleanExerciseStoreGridProps) => {
  const [addingExercises, setAddingExercises] = useState<string[]>([]);

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

  if (filteredExercises.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏋️‍♀️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No exercises found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredExercises.map((exercise) => {
        const isInLibrary = userLibrary.includes(exercise.id);
        const isAdding = addingExercises.includes(exercise.id);

        return (
          <Card 
            key={exercise.id} 
            className="group overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-0 rounded-2xl"
          >
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={exercise.image_url || getExerciseImage(exercise.id)}
                  alt={exercise.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Featured badge */}
                {exercise.is_featured && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-amber-500 text-white px-2 py-1 text-xs rounded-full">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Video indicator */}
                {exercise.video_url && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm">
                    <Play className="h-3 w-3" />
                  </div>
                )}

                {/* Product Actions */}
                <div className="absolute bottom-3 right-3">
                  {!isInLibrary ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToLibrary(exercise.id);
                      }}
                      disabled={isAdding}
                      className={`rounded-full w-10 h-10 p-0 transition-all duration-300 ${
                        isAdding 
                          ? 'bg-green-500 text-white scale-110' 
                          : 'bg-white/90 hover:bg-white text-sage-600 hover:scale-110'
                      }`}
                    >
                      {isAdding ? (
                        <Check className="h-4 w-4 animate-bounce" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-white text-xs font-medium bg-green-500/90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <Check className="h-3 w-3" />
                      Owned
                    </div>
                  )}
                </div>

                {/* Download count */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/80 text-xs bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Download className="h-3 w-3" />
                  {exercise.download_count}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                  {exercise.name}
                </h3>
                
                {/* Product meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{exercise.duration}min</span>
                  </div>
                  <span className="capitalize text-sage-600 font-medium">{exercise.difficulty}</span>
                </div>

                {/* Category and muscle groups */}
                <div className="flex items-center gap-1 mb-3">
                  <Badge variant="outline" className="text-xs py-0.5 px-2 bg-sage-50 text-sage-700 border-sage-200">
                    {exercise.category}
                  </Badge>
                </div>

                {/* Add to cart button - full width */}
                {!isInLibrary && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToLibrary(exercise.id);
                    }}
                    disabled={isAdding}
                    className={`w-full text-sm transition-all duration-300 ${
                      isAdding 
                        ? 'bg-green-500 text-white' 
                        : 'bg-sage-600 hover:bg-sage-700 text-white'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="h-4 w-4 mr-2 animate-bounce" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Library
                      </>
                    )}
                  </Button>
                )}

                {isInLibrary && (
                  <div className="w-full text-center py-2 text-green-600 font-medium text-sm">
                    ✓ In Your Library
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
