
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
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
    <div className="bg-white/90 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40 shadow-lg">
      <div className="p-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-sage-600 rounded-full p-2 hover:bg-sage-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-semibold text-sage-800">Exercise Store</h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="text-sage-600 relative rounded-full p-2 hover:bg-sage-100"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full border-2 border-white">
                {cartCount > 9 ? '9+' : cartCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 bg-sage-50/80 border-0 focus:ring-2 focus:ring-sage-300 rounded-2xl h-12 backdrop-blur-sm"
          />
        </div>

        {/* Categories - Horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className={`whitespace-nowrap flex-shrink-0 rounded-2xl h-10 px-4 transition-all duration-200 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-lg'
                  : 'border-sage-200 bg-white/80 text-sage-700 hover:bg-sage-50 backdrop-blur-sm'
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
