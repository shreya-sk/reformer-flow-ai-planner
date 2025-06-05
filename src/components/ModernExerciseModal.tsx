
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Dumbbell, 
  Target, 
  Activity, 
  Heart,
  Plus,
  Edit,
  X
} from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface ModernExerciseModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
  onEdit?: () => void;
}

export const ModernExerciseModal = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onAddToCart,
  onEdit
}: ModernExerciseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-white rounded-3xl overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img
            src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Exercise info overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-2">{exercise.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{exercise.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="h-4 w-4" />
                <span className="text-sm capitalize">{exercise.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="text-sm capitalize">{exercise.springs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <ScrollArea className="max-h-96">
            {/* Description */}
            {exercise.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{exercise.description}</p>
              </div>
            )}

            {/* Muscle Groups */}
            {exercise.muscleGroups.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="capitalize">
                      {muscle.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {exercise.equipment.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment.map((item) => (
                    <Badge key={item} variant="outline" className="capitalize">
                      {item.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Setup */}
            {exercise.setup && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup</h3>
                <p className="text-gray-600">{exercise.setup}</p>
              </div>
            )}

            {/* Cues */}
            {exercise.cues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Teaching Cues</h3>
                <ul className="space-y-2">
                  {exercise.cues.map((cue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-sage-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modifications */}
            {exercise.modifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Modifications</h3>
                <ul className="space-y-2">
                  {exercise.modifications.map((mod, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {exercise.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-600">{exercise.notes}</p>
              </div>
            )}
          </ScrollArea>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                className="flex-1 border-sage-300 text-sage-700 hover:bg-sage-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Exercise
              </Button>
            )}
            
            {onAddToCart && (
              <Button
                onClick={onAddToCart}
                className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Class
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
