
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Clock, Zap } from 'lucide-react';
import { Exercise, ExerciseCategory } from '@/types/reformer';
import { exerciseDatabase } from '@/data/exercises';

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  const categories: { value: ExerciseCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'warm-up', label: 'Warm-up' },
    { value: 'standing', label: 'Standing' },
    { value: 'supine', label: 'Supine' },
    { value: 'prone', label: 'Prone' },
    { value: 'sitting', label: 'Sitting' },
    { value: 'side-lying', label: 'Side-lying' },
    { value: 'kneeling', label: 'Kneeling' },
    { value: 'cool-down', label: 'Cool-down' },
  ];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSpringColor = (springs: string) => {
    switch (springs) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      case 'mixed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-96 bg-white border-r border-sage-200 flex flex-col h-full">
      <div className="p-4 border-b border-sage-200">
        <h3 className="text-lg font-semibold text-sage-800 mb-3">Exercise Library</h3>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ExerciseCategory | 'all')}>
          <TabsList className="grid grid-cols-3 gap-1 h-auto p-1">
            {categories.slice(0, 3).map(category => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="text-xs py-1"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {categories.slice(3).map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="text-xs h-7"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-sage-800">
                  {exercise.name}
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => onAddExercise(exercise)}
                  className="bg-sage-600 hover:bg-sage-700 text-white h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-3 w-3 text-sage-500" />
                <span className="text-xs text-sage-600">{exercise.duration}min</span>
                <Zap className="h-3 w-3 text-sage-500" />
                <Badge className={`text-xs ${getSpringColor(exercise.springs)}`}>
                  {exercise.springs}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </Badge>
                {exercise.muscleGroups.slice(0, 2).map(group => (
                  <Badge key={group} variant="secondary" className="text-xs">
                    {group}
                  </Badge>
                ))}
              </div>
              
              {exercise.description && (
                <p className="text-xs text-sage-600 line-clamp-2">
                  {exercise.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sage-500 text-sm">No exercises found</p>
            <p className="text-sage-400 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
