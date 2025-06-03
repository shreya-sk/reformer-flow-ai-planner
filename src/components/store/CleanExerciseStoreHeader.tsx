
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CleanExerciseStoreHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'strength', label: 'Strength' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' }
];

export const CleanExerciseStoreHeader = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: CleanExerciseStoreHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="p-4 space-y-4">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Exercise Store</h1>
            <p className="text-sm text-gray-500">Discover new exercises for your classes</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 focus:border-sage-500 focus:ring-sage-500"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                selectedCategory === category.value
                  ? 'bg-sage-600 hover:bg-sage-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
