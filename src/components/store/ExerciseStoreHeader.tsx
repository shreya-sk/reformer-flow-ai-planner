
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExerciseStoreHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

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
    <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
      <div className="p-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/library')}
            className="text-sage-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          
          <h1 className="text-lg font-semibold text-sage-800">Exercise Store</h1>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-sage-600">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="supine">Supine</SelectItem>
              <SelectItem value="prone">Prone</SelectItem>
              <SelectItem value="sitting">Sitting</SelectItem>
              <SelectItem value="side-lying">Side Lying</SelectItem>
              <SelectItem value="kneeling">Kneeling</SelectItem>
              <SelectItem value="standing">Standing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
