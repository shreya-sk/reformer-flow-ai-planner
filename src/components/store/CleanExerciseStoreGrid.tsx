
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, Star, Download, Heart } from 'lucide-react';

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
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchTerm, selectedCategory]);

  const handleAddToLibrary = async (exerciseId: string) => {
    if (addingExercises.includes(exerciseId)) return;
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
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

  const featuredExercises = filteredExercises.filter(ex => ex.is_featured);
  const regularExercises = filteredExercises.filter(ex => !ex.is_featured);

  const renderExerciseCard = (exercise: StoreExercise) => {
    const isInLibrary = userLibrary.includes(exercise.id);
    const isAdding = addingExercises.includes(exercise.id);

    return (
      <Card key={exercise.id} className="group bg-white border-0 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          {/* Clean Image */}
          <div className="relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-sage-50 to-sage-100">
            <img
              src={exercise.image_url || getExerciseImage(exercise.id)}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Minimal overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Featured badge */}
            {exercise.is_featured && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-amber-500/90 text-white px-2 py-1 text-xs rounded-full border-0">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Status indicator */}
            <div className="absolute top-3 right-3">
              {isInLibrary ? (
                <div className="bg-green-500/90 text-white p-2 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
              ) : isAdding ? (
                <div className="bg-blue-500/90 text-white p-2 rounded-full animate-pulse">
                  <Download className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          </div>

          {/* Clean Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{exercise.duration}min</span>
                  </div>
                  <span className="capitalize">{exercise.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => handleAddToLibrary(exercise.id)}
              disabled={isInLibrary || isAdding}
              className={`w-full h-9 text-sm font-medium rounded-xl transition-all duration-200 ${
                isInLibrary 
                  ? 'bg-green-100 text-green-700 hover:bg-green-100 cursor-default'
                  : isAdding
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                    : 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-105'
              }`}
            >
              {isInLibrary ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  In Library
                </>
              ) : isAdding ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-bounce" />
                  Adding...
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Library
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {featuredExercises.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Featured</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {regularExercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">All Exercises</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {regularExercises.map(renderExerciseCard)}
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="p-6 bg-gray-50 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
