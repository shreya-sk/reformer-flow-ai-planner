
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Baby, Check, Eye, EyeOff } from 'lucide-react';
import { MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ExerciseLibraryHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedMuscleGroup: MuscleGroup | 'all';
  onMuscleGroupChange: (group: MuscleGroup | 'all') => void;
  selectedPosition: ExerciseCategory | 'all';
  onPositionChange: (position: ExerciseCategory | 'all') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onAddExercise: () => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  showHidden?: boolean;
  onToggleShowHidden?: () => void;
  hiddenCount?: number;
}

export const ExerciseLibraryHeader = ({
  searchTerm,
  onSearchChange,
  selectedMuscleGroup,
  onMuscleGroupChange,
  selectedPosition,
  onPositionChange,
  showFilters,
  onToggleFilters,
  onAddExercise,
  onClearFilters,
  activeFiltersCount,
  showHidden = false,
  onToggleShowHidden,
  hiddenCount = 0
}: ExerciseLibraryHeaderProps) => {
  const { preferences, togglePregnancySafeOnly } = useUserPreferences();

  const muscleGroups: { value: MuscleGroup | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'core', label: 'Core' },
    { value: 'legs', label: 'Legs' },
    { value: 'arms', label: 'Arms' },
    { value: 'back', label: 'Back' },
    { value: 'glutes', label: 'Glutes' },
    { value: 'shoulders', label: 'Shoulders' },
  ];

  const positions: { value: ExerciseCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Positions' },
    { value: 'supine', label: 'Supine' },
    { value: 'prone', label: 'Prone' },
    { value: 'sitting', label: 'Sitting' },
    { value: 'side-lying', label: 'Side-lying' },
    { value: 'kneeling', label: 'Kneeling' },
  ];

  return (
    <div className="space-y-4">
      {/* Main header row - Stack on mobile */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:items-center lg:justify-between">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 ${preferences.darkMode ? 'border-gray-600 focus:border-gray-500 bg-gray-700 text-white' : 'border-sage-300 focus:border-sage-500 bg-white'}`}
            />
          </div>

          {/* Filter controls - Wrap on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Show Hidden Toggle */}
            {onToggleShowHidden && (
              <Button
                variant={showHidden ? "default" : "outline"}
                size="sm"
                onClick={onToggleShowHidden}
                className="gap-2 text-xs sm:text-sm"
              >
                {showHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="hidden sm:inline">
                  {showHidden ? `Showing Hidden (${hiddenCount})` : `Show Hidden (${hiddenCount})`}
                </span>
                <span className="sm:hidden">
                  {showHidden ? `Hidden (${hiddenCount})` : `Hidden (${hiddenCount})`}
                </span>
              </Button>
            )}

            {/* Filter Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFilters}
              className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'} text-xs sm:text-sm`}
            >
              <Filter className="h-4 w-4 mr-1 sm:mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className={`text-xs ${preferences.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-sage-500 hover:text-sage-700'}`}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Right side controls - Stack on mobile */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:gap-4">
          {/* Pregnancy Safe Toggle */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.showPregnancySafeOnly}
              onChange={togglePregnancySafeOnly}
              className="rounded"
            />
            <div className="flex items-center gap-1">
              <Baby className={`h-4 w-4 ${preferences.darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              <Check className={`h-3 w-3 ${preferences.darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <span className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} text-xs sm:text-sm`}>
              Pregnancy-safe only
            </span>
          </label>

          <Button 
            size="sm" 
            onClick={onAddExercise}
            className="bg-sage-600 hover:bg-sage-700 shadow-sm w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </Button>
        </div>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className={`p-4 ${preferences.darkMode ? 'bg-gray-700/50' : 'bg-sage-50'} rounded-lg border ${preferences.darkMode ? 'border-gray-600' : 'border-sage-200'}`}>
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-8">
            <div className="flex-1">
              <label className={`text-sm font-medium mb-2 block ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>Muscle Groups</label>
              <div className="flex flex-wrap gap-1.5">
                {muscleGroups.map(group => (
                  <Button
                    key={group.value}
                    variant={selectedMuscleGroup === group.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onMuscleGroupChange(group.value)}
                    className={`text-xs h-7 ${preferences.darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-sage-300 hover:border-sage-400'}`}
                  >
                    {group.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className={`text-sm font-medium mb-2 block ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>Position</label>
              <div className="flex flex-wrap gap-1.5">
                {positions.map(position => (
                  <Button
                    key={position.value}
                    variant={selectedPosition === position.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPositionChange(position.value)}
                    className={`text-xs h-7 ${preferences.darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-sage-300 hover:border-sage-400'}`}
                  >
                    {position.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
