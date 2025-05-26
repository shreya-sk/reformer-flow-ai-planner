
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, Plus, Clock, Edit, Copy } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { exerciseDatabase } from '@/data/exercises';
import { ExerciseForm } from './ExerciseForm';

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [selectedPosition, setSelectedPosition] = useState<ExerciseCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState(exerciseDatabase);

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
    { value: 'all', label: 'All' },
    { value: 'supine', label: 'Supine' },
    { value: 'prone', label: 'Prone' },
    { value: 'sitting', label: 'Sitting' },
    { value: 'side-lying', label: 'Side-lying' },
    { value: 'kneeling', label: 'Kneeling' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(group => group.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || 
                              exercise.muscleGroups.includes(selectedMuscleGroup);
    
    const matchesPosition = selectedPosition === 'all' || exercise.category === selectedPosition;
    
    return matchesSearch && matchesMuscleGroup && matchesPosition;
  });

  const getSpringVisual = (springs: string) => {
    const springConfig = {
      'light': [{ color: 'bg-green-500', count: 1 }],
      'medium': [{ color: 'bg-yellow-500', count: 1 }],
      'heavy': [{ color: 'bg-red-500', count: 2 }],
      'mixed': [
        { color: 'bg-red-500', count: 1 },
        { color: 'bg-yellow-500', count: 1 },
        { color: 'bg-green-500', count: 1 }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-1">
        {config.map((spring, index) => (
          <div key={index} className="flex gap-0.5">
            {Array.from({ length: spring.count }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${spring.color}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExercise) {
      setExercises(prev => prev.map(ex => ex.id === exercise.id ? exercise : ex));
    } else {
      setExercises(prev => [...prev, exercise]);
    }
    setShowForm(false);
    setEditingExercise(null);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDuplicateExercise = (exercise: Exercise) => {
    const duplicated = {
      ...exercise,
      id: `${exercise.id}-copy-${Date.now()}`,
      name: `${exercise.name} (Copy)`
    };
    setEditingExercise(duplicated);
    setShowForm(true);
  };

  return (
    <>
      <div className="w-96 bg-white border-r border-sage-200 flex flex-col h-full shadow-sm">
        <div className="p-4 border-b border-sage-200 bg-gradient-to-r from-sage-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-sage-800">Exercise Library</h3>
            <Button 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="bg-sage-600 hover:bg-sage-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-sage-300 focus:border-sage-500"
            />
          </div>

          <Tabs value={selectedMuscleGroup} onValueChange={(value) => setSelectedMuscleGroup(value as MuscleGroup | 'all')}>
            <TabsList className="grid grid-cols-3 gap-1 h-auto p-1 bg-sage-100 mb-3">
              {muscleGroups.slice(0, 3).map(group => (
                <TabsTrigger 
                  key={group.value} 
                  value={group.value}
                  className="text-xs py-1.5 data-[state=active]:bg-white data-[state=active]:text-sage-800"
                >
                  {group.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {muscleGroups.slice(3).map(group => (
                <Button
                  key={group.value}
                  variant={selectedMuscleGroup === group.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMuscleGroup(group.value)}
                  className="text-xs h-7 border-sage-300 hover:border-sage-400"
                >
                  {group.label}
                </Button>
              ))}
            </div>
          </Tabs>

          <div className="space-y-2">
            <span className="text-xs font-medium text-sage-600">Position:</span>
            <div className="flex flex-wrap gap-1.5">
              {positions.map(position => (
                <Button
                  key={position.value}
                  variant={selectedPosition === position.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPosition(position.value)}
                  className="text-xs h-6 border-sage-300 hover:border-sage-400"
                >
                  {position.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="group hover:shadow-md transition-all duration-200 border-sage-200 hover:border-sage-300">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-semibold text-sage-600">
                        {exercise.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sage-800 text-sm leading-tight">
                        {exercise.name}
                      </h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditExercise(exercise)}
                          className="h-6 w-6 p-0 text-sage-600 hover:text-sage-800"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicateExercise(exercise)}
                          className="h-6 w-6 p-0 text-sage-600 hover:text-sage-800"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onAddExercise(exercise)}
                          className="bg-sage-600 hover:bg-sage-700 text-white h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sage-500" />
                        <span className="text-xs text-sage-600 font-medium">{exercise.duration}min</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-sage-500">Springs:</span>
                        {getSpringVisual(exercise.springs)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </Badge>
                      {exercise.muscleGroups.slice(0, 2).map(group => (
                        <Badge key={group} variant="secondary" className="text-xs bg-sage-100 text-sage-700">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="p-0 max-w-md">
          <ExerciseForm
            exercise={editingExercise}
            onSave={handleSaveExercise}
            onCancel={() => {
              setShowForm(false);
              setEditingExercise(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
