
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Trash2, Plus } from 'lucide-react';

interface StoreExercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  springs: string;
}

interface ExerciseStoreCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: string[];
  exercises: StoreExercise[];
  onRemoveItem: (exerciseId: string) => void;
  onAddToLibrary: (exerciseIds: string[]) => Promise<void>;
}

export const ExerciseStoreCart = ({
  isOpen,
  onClose,
  cartItems,
  exercises,
  onRemoveItem,
  onAddToLibrary
}: ExerciseStoreCartProps) => {
  const cartExercises = exercises.filter(ex => cartItems.includes(ex.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Cart ({cartItems.length})</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          {cartExercises.length === 0 ? (
            <p className="text-center text-sage-600 py-8">Your cart is empty</p>
          ) : (
            <>
              {cartExercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sage-800 truncate">{exercise.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {exercise.category}
                      </Badge>
                      <span className="text-xs text-sage-600">{exercise.duration}min</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(exercise.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="pt-4 border-t border-sage-200">
                <Button
                  onClick={() => onAddToLibrary(cartItems)}
                  className="w-full bg-sage-600 hover:bg-sage-700"
                  disabled={cartItems.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add All to Library ({cartItems.length})
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </div>
    </div>
  );
};
