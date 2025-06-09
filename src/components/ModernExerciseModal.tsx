
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronDown,
  Clock, 
  Dumbbell, 
  Target, 
  Activity, 
  Heart,
  Plus,
  Edit,
  X,
  Check
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
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToClass = () => {
    if (isAdding) return;
    
    console.log('Add to class clicked!'); // Debug log
    setIsAdding(true);
    
    if (onAddToCart) {
      onAddToCart();
    }
    
    // Revert back to plus button after 2 seconds
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-lg max-h-[90vh] p-0 bg-white rounded-2xl overflow-hidden">
        {/* Header Image */}
        <div className="relative h-40 overflow-hidden rounded-t-2xl">
          <img
            src={exercise.image || '/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png'}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Top right buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Edit button */}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors z-10"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}

            {/* Add to Class button */}
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('BUTTON CLICKED!');
                  handleAddToClass();
                }}
                type="button"
                className={`p-2 rounded-full backdrop-blur-sm text-white transition-all duration-300 cursor-pointer z-10 relative ${
                  isAdding 
                    ? 'bg-green-500 hover:bg-green-500 scale-110' 
                    : 'bg-sage-600 hover:bg-sage-700'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                {isAdding ? (
                  <Check className="h-4 w-4 animate-pulse" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

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

        {/* Content with enhanced mobile scrolling */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea 
            className="h-full max-h-[calc(90vh-200px)]"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            <div className="p-6 space-y-6" style={{ touchAction: 'pan-y' }}>
              {/* Description */}
              {exercise.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{exercise.description}</p>
                </div>
              )}

              {/* Muscle Groups */}
              {exercise.muscleGroups.length > 0 && (
                <div>
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

              {/* Expandable content trigger */}
              <div className="text-center py-3">
                <button
                  onClick={() => setShowAllDetails(!showAllDetails)}
                  className="group flex items-center justify-center gap-2 text-sage-500 hover:text-sage-700 transition-colors"
                >
                  <span className="text-xs text-sage-400 blur-[1px] group-hover:blur-none transition-all">
                    {showAllDetails ? 'Show less' : 'Equipment • Setup • Cues • More...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showAllDetails ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expandable content - Enhanced for mobile scrolling */}
              {showAllDetails && (
                <div className="space-y-6 animate-in fade-in-0 duration-300">
                  {/* Equipment */}
                  {exercise.equipment.length > 0 && (
                    <div>
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
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup</h3>
                      <p className="text-gray-600">{exercise.setup}</p>
                    </div>
                  )}

                  {/* Cues */}
                  {exercise.cues.length > 0 && (
                    <div>
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
                    <div>
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

                  {/* Progressions */}
                  {exercise.progressions && exercise.progressions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Progressions</h3>
                      <ul className="space-y-2">
                        {exercise.progressions.map((progression, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{progression}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Regressions */}
                  {exercise.regressions && exercise.regressions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Regressions</h3>
                      <ul className="space-y-2">
                        {exercise.regressions.map((regression, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{regression}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safety & Contraindications */}
                  {exercise.contraindications && exercise.contraindications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety & Contraindications</h3>
                      <ul className="space-y-2">
                        {exercise.contraindications.map((contraindication, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Heart className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{contraindication}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Breathing Cues */}
                  {exercise.breathingCues && exercise.breathingCues.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Breathing Cues</h3>
                      <ul className="space-y-2">
                        {exercise.breathingCues.map((cue, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Activity className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{cue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  {exercise.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                      <p className="text-gray-600">{exercise.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator className="my-6" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
