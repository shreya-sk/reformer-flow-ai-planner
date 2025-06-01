
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, X, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileLibraryHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void;
  activeFiltersCount: number;
  exerciseCount: number;
  showPregnancySafe: boolean;
  onPregnancySafeToggle: () => void;
  onAddExercise: () => void;
  showFilters: boolean;
  onClearFilters: () => void;
}

export const MobileLibraryHeader = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  activeFiltersCount,
  exerciseCount,
  showPregnancySafe,
  onPregnancySafeToggle,
  onAddExercise,
  showFilters,
  onClearFilters
}: MobileLibraryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
      <div className="p-4 space-y-4">
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-sage-800">Exercise Library</h1>
            <p className="text-sm text-sage-600">{exerciseCount} exercises</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/store')}
              className="text-sage-600 hover:text-sage-800"
            >
              <Store className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={onAddExercise}
              size="sm"
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Exercise
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={onFilterClick}
            className={`relative ${showFilters ? 'bg-sage-600 text-white' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <Button
            variant={showPregnancySafe ? "default" : "outline"}
            size="sm"
            onClick={onPregnancySafeToggle}
            className={showPregnancySafe ? 'bg-pink-600 hover:bg-pink-700 text-white' : ''}
          >
            Pregnancy Safe
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sage-600"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
