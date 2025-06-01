
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ShoppingCart,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExerciseStoreHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'warm-up', label: 'Warm-up' },
  { value: 'strength', label: 'Strength' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'balance', label: 'Balance' },
  { value: 'cardio', label: 'Cardio' },
];

export const ExerciseStoreHeader = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  cartCount,
  onCartClick
}: ExerciseStoreHeaderProps) => {
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
          
          <h1 className="text-lg font-semibold text-sage-800">Exercise Store</h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="text-sage-600 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                {cartCount > 9 ? '9+' : cartCount}
              </Badge>
            )}
          </Button>
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

        {/* Categories - Horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={`whitespace-nowrap flex-shrink-0 ${
                selectedCategory === category.value
                  ? 'bg-sage-600 hover:bg-sage-700 text-white'
                  : 'border-sage-300 text-sage-700 hover:bg-sage-50'
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
