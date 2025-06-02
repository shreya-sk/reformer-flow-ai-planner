
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Heart, Edit, Plus, Play, Baby } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from './SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from '@/hooks/use-toast';

interface ModernExerciseModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

export const ModernExerciseModal = ({ exercise, isOpen, onClose, onAddToCart }: ModernExerciseModalProps) => {
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;

  if (!isOpen) return null;

  const handleAddToClass = () => {
    if (onAddToCart) {
      onAddToCart();
      toast({
        title: "Added to class",
        description: `"${exercise.name}" has been added to your class plan.`,
      });
      onClose();
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteExercise(exercise.id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `"${exercise.name}" ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]">
        <CardContent className="p-0">
          {/* Header with close button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm w-10 h-10 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main image */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Bottom overlay with key info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-3 mb-4">
                {exercise.isPregnancySafe && (
                  <div className="p-2 bg-green-500 rounded-full">
                    <Baby className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-white/80 text-sm">Springs:</span>
                  <SpringVisual springs={exercise.springs} />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title and price-like section */}
            <div>
              <h2 className="text-2xl font-bold text-sage-800 mb-2">{exercise.name}</h2>
              <div className="flex items-center gap-3">
                <Badge className="bg-sage-100 text-sage-700">{exercise.category}</Badge>
                <span className="text-sage-600">{exercise.duration} min</span>
                <span className="text-sage-600 capitalize">{exercise.difficulty}</span>
              </div>
            </div>

            {/* Description */}
            {exercise.description && (
              <div>
                <h4 className="font-semibold text-sage-800 mb-2">Description</h4>
                <p className="text-sage-600 text-sm leading-relaxed">{exercise.description}</p>
              </div>
            )}

            {/* Specifications like in product page */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-sage-200">
              <div className="text-center">
                <div className="text-sm text-sage-500">Duration</div>
                <div className="font-semibold text-sage-800">{exercise.duration} min</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-sage-500">Level</div>
                <div className="font-semibold text-sage-800 capitalize">{exercise.difficulty}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-sage-500">Category</div>
                <div className="font-semibold text-sage-800">{exercise.category}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {onAddToCart && (
                <Button
                  onClick={handleAddToClass}
                  className="w-full h-12 bg-sage-700 hover:bg-sage-800 text-white rounded-2xl font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Class
                </Button>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className="flex-1 h-12 rounded-2xl border-sage-200 hover:bg-sage-50"
                >
                  <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-sage-600'}`} />
                  {isFavorite ? 'Favorited' : 'Favorite'}
                </Button>
                
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-sage-200 hover:bg-sage-50"
                >
                  <Edit className="h-5 w-5 mr-2 text-sage-600" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
