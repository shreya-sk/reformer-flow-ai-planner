
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  Store,
  ArrowLeft,
  Baby
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileLibraryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
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
    <div className="bg-white border-b border-sage-200 sticky top-0 z-40 shadow-sm">
      <div className="p-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-sage-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Button>
          
          <h1 className="text-lg font-semibold text-sage-800">Exercise Library</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/store')}
              className="text-sage-600 relative"
            >
              <Store className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-sage-600 rounded-full"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddExercise}
              className="text-sage-600"
            >
              <Plus className="h-5 w-5" />
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
            className="pl-10 pr-4 bg-sage-50 border-sage-200 focus:border-sage-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={showPregnancySafe ? "default" : "outline"}
              size="sm"
              onClick={onPregnancySafeToggle}
              className={`${
                showPregnancySafe 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Baby className="h-4 w-4 mr-1" />
              Pregnancy Safe
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterClick}
              className="relative border-sage-300 text-sage-700 hover:bg-sage-50"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-4 w-4 p-0 bg-sage-600 text-white text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-sage-500 hover:text-sage-700"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="text-sm text-sage-600">
            {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
