import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, Plus, Clock, Edit, Copy, Filter, Baby } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseCategory } from '@/types/reformer';
import { exerciseDatabase } from '@/data/exercises';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { SmartAddButton } from './SmartAddButton';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseLibrary = ({ onAddExercise }: ExerciseLibraryProps) => {
  const { preferences } = useUserPreferences();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');
  const [selectedPosition, setSelectedPosition] = useState<ExerciseCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState(exerciseDatabase);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    { value: 'all', label: 'All Positions' },
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
    
    const matchesPregnancy = !preferences.showPregnancySafeOnly || exercise.isPregnancySafe;
    
    return matchesSearch && matchesMuscleGroup && matchesPosition && matchesPregnancy;
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
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
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

  const handleEditExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDuplicateExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = {
      ...exercise,
      id: `${exercise.id}-copy-${Date.now()}`,
      name: `${exercise.name} (Copy)`
    };
    setEditingExercise(duplicated);
    setShowForm(true);
  };

  const handleAddExercise = (exercise: Exercise, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddExercise(exercise);
  };

  const handleCardClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowDetailModal(true);
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setExercises(prev => prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex));
    setSelectedExercise(updatedExercise);
  };

  const clearFilters = () => {
    setSelectedMuscleGroup('all');
    setSelectedPosition('all');
    setSearchTerm('');
  };

  const activeFiltersCount = (selectedMuscleGroup !== 'all' ? 1 : 0) + (selectedPosition !== 'all' ? 1 : 0);

  return (
    <>
      <div className={`w-96 ${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-white to-sage-25 border-sage-200'} border-r flex flex-col h-full shadow-lg`}>
        {/* Header */}
        <div className={`p-6 border-b ${preferences.darkMode ? 'border-gray-700 bg-gray-800' : 'border-sage-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Exercise Library</h3>
            <Button 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="bg-sage-600 hover:bg-sage-700 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 h-4 w-4" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${preferences.darkMode ? 'border-gray-600 focus:border-gray-500 bg-gray-700 text-white' : 'border-sage-300 focus:border-sage-500 bg-white'}`}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className={`text-xs ${preferences.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-sage-500 hover:text-sage-700'}`}
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Pregnancy Safe Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={preferences.showPregnancySafeOnly}
                onChange={(e) => {
                  // This will be handled by user preferences hook
                }}
                className="rounded"
              />
              <Baby className="h-4 w-4 text-pink-500" />
              <span className={preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}>
                Pregnancy-safe only
              </span>
            </label>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-4 space-y-4 p-4 bg-sage-50 rounded-lg border border-sage-200">
              <div>
                <label className="text-sm font-medium text-sage-700 mb-2 block">Muscle Groups</label>
                <div className="flex flex-wrap gap-1.5">
                  {muscleGroups.map(group => (
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
              </div>

              <div>
                <label className="text-sm font-medium text-sage-700 mb-2 block">Position</label>
                <div className="flex flex-wrap gap-1.5">
                  {positions.map(position => (
                    <Button
                      key={position.value}
                      variant={selectedPosition === position.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPosition(position.value)}
                      className="text-xs h-7 border-sage-300 hover:border-sage-400"
                    >
                      {position.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative ${
                preferences.darkMode 
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                  : 'border-sage-200 hover:border-sage-300 bg-white'
              }`}
              onClick={() => handleCardClick(exercise)}
            >
              {/* Pregnancy Safe Indicator */}
              {exercise.isPregnancySafe && (
                <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1 z-10">
                  <Baby className="h-3 w-3 text-white" />
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Exercise Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-xl overflow-hidden border ${
                      preferences.darkMode 
                        ? 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-600' 
                        : 'bg-gradient-to-br from-sage-100 to-sage-200 border-sage-200'
                    }`}>
                      {exercise.image ? (
                        <img 
                          src={exercise.image} 
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
                          alt="Default exercise"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold text-base leading-tight ${
                        preferences.darkMode ? 'text-white' : 'text-sage-800'
                      }`}>
                        {exercise.name}
                      </h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleEditExercise(exercise, e)}
                          className={`h-7 w-7 p-0 ${
                            preferences.darkMode 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                              : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'
                          }`}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleDuplicateExercise(exercise, e)}
                          className={`h-7 w-7 p-0 ${
                            preferences.darkMode 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                              : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'
                          }`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <SmartAddButton
                          exercise={exercise}
                          onAddExercise={onAddExercise}
                          className="h-7 w-7 p-0"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                        <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                          {exercise.duration}min
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>Springs:</span>
                        {getSpringVisual(exercise.springs)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={`text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </Badge>
                      {exercise.muscleGroups.slice(0, 2).map(group => (
                        <Badge 
                          key={group} 
                          variant="secondary" 
                          className={`text-xs ${
                            preferences.darkMode 
                              ? 'bg-gray-600 text-gray-200 border-gray-500' 
                              : 'bg-sage-100 text-sage-700 border-sage-200'
                          }`}
                        >
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
            <div className="text-center py-12">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${
                preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'
              }`}>
                <Search className={`h-8 w-8 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                No exercises found
              </h3>
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                Try adjusting your search or filters
              </p>
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

      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExercise(null);
          }}
          onUpdate={handleUpdateExercise}
        />
      )}
    </>
  );
};
