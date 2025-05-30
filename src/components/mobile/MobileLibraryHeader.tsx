
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus } from 'lucide-react';

interface MobileLibraryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  activeFiltersCount: number;
  exerciseCount: number;
  showPregnancySafe: boolean;
  onPregnancySafeToggle: () => void;
  onAddExercise: () => void;
}

export const MobileLibraryHeader = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  activeFiltersCount,
  exerciseCount,
  showPregnancySafe,
  onPregnancySafeToggle,
  onAddExercise
}: MobileLibraryHeaderProps) => {
  return (
    <div className="p-4 border-b bg-white sticky top-0 z-20 space-y-4">
      {/* Search and action buttons */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-sage-400"
          />
        </div>
        
        {/* Filter button */}
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="h-12 w-12 rounded-xl border-gray-200 flex items-center justify-center p-0"
        >
          <Filter className="h-5 w-5" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-sage-600 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {/* Pregnancy safe toggle */}
        <Button
          variant={showPregnancySafe ? "default" : "outline"}
          onClick={onPregnancySafeToggle}
          className="h-12 w-12 rounded-xl flex items-center justify-center p-0"
        >
          <span className="text-lg">👶</span>
        </Button>
        
        {/* Add exercise button */}
        <Button
          onClick={onAddExercise}
          className="h-12 w-12 rounded-xl bg-sage-600 hover:bg-sage-700 flex items-center justify-center p-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Exercise count */}
      <div className="flex justify-center">
        <span className="text-sm text-gray-600">
          {exerciseCount} exercises
        </span>
      </div>
    </div>
  );
};
