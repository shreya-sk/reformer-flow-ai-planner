
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Filter, X, CheckCircle } from 'lucide-react';
import { MuscleGroup, ExerciseCategory } from '@/types/reformer';

interface MobileFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ExerciseCategory | 'all';
  onCategoryChange: (category: ExerciseCategory | 'all') => void;
  selectedMuscleGroup: MuscleGroup | 'all';
  onMuscleGroupChange: (group: MuscleGroup | 'all') => void;
  showPregnancySafe: boolean;
  onPregnancySafeChange: (show: boolean) => void;
  showHidden: boolean;
  onShowHiddenChange: (show: boolean) => void;
  onClearAll: () => void;
  activeFiltersCount: number;
}

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'supine', label: 'Supine' },
  { value: 'prone', label: 'Prone' },
  { value: 'sitting', label: 'Sitting' },
  { value: 'side-lying', label: 'Side-lying' },
  { value: 'kneeling', label: 'Kneeling' },
  { value: 'standing', label: 'Standing' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'cool-down', label: 'Cool-down' },
];

const muscleGroupOptions = [
  { value: 'all', label: 'All Muscle Groups' },
  { value: 'core', label: 'Core' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'back', label: 'Back' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'full-body', label: 'Full Body' },
];

export const MobileFilterPanel = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedMuscleGroup,
  onMuscleGroupChange,
  showPregnancySafe,
  onPregnancySafeChange,
  showHidden,
  onShowHiddenChange,
  onClearAll,
  activeFiltersCount
}: MobileFilterPanelProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Filter Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-slide-in-bottom">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-sage-600 hover:text-sage-700"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
          {/* Category Filters */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Category</h4>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onCategoryChange(option.value as ExerciseCategory | 'all')}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === option.value
                      ? 'bg-sage-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {selectedCategory === option.value && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Muscle Group Filters */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Muscle Groups</h4>
            <div className="grid grid-cols-2 gap-2">
              {muscleGroupOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onMuscleGroupChange(option.value as MuscleGroup | 'all')}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    selectedMuscleGroup === option.value
                      ? 'bg-sage-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {selectedMuscleGroup === option.value && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Options</h4>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👶</span>
                <span className="font-medium text-gray-900">Pregnancy Safe Only</span>
              </div>
              <Switch
                checked={showPregnancySafe}
                onCheckedChange={onPregnancySafeChange}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👁️</span>
                <span className="font-medium text-gray-900">Show Hidden Exercises</span>
              </div>
              <Switch
                checked={showHidden}
                onCheckedChange={onShowHiddenChange}
              />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <Button
            onClick={onClose}
            className="w-full h-12 bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
          >
            Apply Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-white text-sage-600">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
