
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Exercise } from '@/types/reformer';

interface ExerciseDetailPanelProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseDetailPanel = ({ exercise, isOpen, onClose }: ExerciseDetailPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-in-right">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <Card className="relative bg-white/95 backdrop-blur-xl border-0 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="text-xl font-bold text-sage-800">{exercise.name}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-sage-100 transition-colors"
            >
              <X className="h-5 w-5 text-sage-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Progressions */}
            {exercise.progressions && exercise.progressions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-sage-800">Progressions</h4>
                </div>
                <div className="space-y-2">
                  {exercise.progressions.map((progression, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
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
