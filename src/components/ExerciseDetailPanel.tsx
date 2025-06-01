
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface ExerciseDetailPanelProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseDetailPanel = ({ exercise, isOpen, onClose }: ExerciseDetailPanelProps) => {
  const { isPulling, pullDistance } = useTouchGestures({
    onSwipeDown: onClose,
    minSwipeDistance: 100,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-in-bottom">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Enhanced Panel with curved top */}
      <Card 
        className="relative bg-white/95 backdrop-blur-xl border-0 rounded-t-3xl shadow-2xl max-h-[75vh] overflow-hidden"
        style={{
          transform: isPulling ? `translateY(${Math.min(pullDistance, 100)}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <CardContent className="p-0">
          {/* Enhanced Handle */}
          <div className="flex justify-center pt-4 pb-3">
            <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <h3 className="text-xl font-bold text-sage-800">{exercise.name}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-sage-100 transition-colors"
            >
              <X className="h-5 w-5 text-sage-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-8 space-y-6 max-h-[55vh] overflow-y-auto">
            {/* Progressions */}
            {exercise.progressions && exercise.progressions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-sage-800">Progressions</h4>
                </div>
                <div className="space-y-2">
                  {exercise.progressions.map((progression, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2 mb-2">
                      {progression}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Regressions */}
            {exercise.regressions && exercise.regressions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-sage-800">Regressions</h4>
                </div>
                <div className="space-y-2">
                  {exercise.regressions.map((regression, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mr-2 mb-2">
                      {regression}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Safety */}
            {exercise.contraindications && exercise.contraindications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h4 className="font-semibold text-sage-800">Safety & Contraindications</h4>
                </div>
                <div className="space-y-2">
                  {exercise.contraindications.map((contraindication, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200 mr-2 mb-2">
                      {contraindication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
