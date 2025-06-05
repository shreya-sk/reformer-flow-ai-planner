
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Store } from 'lucide-react';

interface CleanExerciseStoreHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'All Exercises' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'core', label: 'Core' },
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'back', label: 'Back' },
  { value: 'cool-down', label: 'Cool-down' }
];

export const CleanExerciseStoreHeader = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: CleanExerciseStoreHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="p-4">
        {/* Store Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-sage-500 to-sage-600 rounded-2xl">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exercise Store</h1>
            <p className="text-gray-600 text-sm">Discover and add professional exercises to your library</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-300 focus:border-sage-500 focus:ring-sage-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={`whitespace-nowrap ${
                selectedCategory === category.value 
                  ? 'bg-sage-600 hover:bg-sage-700 text-white' 
                  : 'hover:bg-sage-50 text-gray-600 border-gray-300'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
