
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Clock, Plus, Trash2 } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { exerciseDatabase } from '@/data/exercises';
import { SmartAddButton } from '@/components/SmartAddButton';

interface TabbedPlanViewProps {
  currentClass: ClassPlan;
  onRemoveExercise: (exerciseId: string) => void;
  onUpdateClassName: (name: string) => void;
  onAddExercise: () => void;
}

export const TabbedPlanView = ({ 
  currentClass, 
  onRemoveExercise, 
  onUpdateClassName,
  onAddExercise 
}: TabbedPlanViewProps) => {
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const [activeTab, setActiveTab] = useState('plan');

  // Get favorited exercises from the database
  const favoritedExercises = exerciseDatabase.filter(exercise => 
    preferences.favoriteExercises?.includes(exercise.id)
  );

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

  const ExerciseListItem = ({ exercise, showAddButton = false, showRemoveButton = false }: { 
    exercise: Exercise; 
    showAddButton?: boolean;
    showRemoveButton?: boolean;
  }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${
      preferences.darkMode 
        ? 'border-gray-600 bg-gray-800' 
        : 'border-sage-200 bg-white hover:bg-sage-50'
    } transition-colors`}>
      {/* Exercise thumbnail */}
      <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
        preferences.darkMode 
          ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
          : 'bg-gradient-to-br from-sage-100 to-sage-200'
      }`}>
        {exercise.image ? (
          <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
        ) : (
          <img 
            src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
            alt="Default exercise"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Exercise details */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-sm ${
          preferences.darkMode ? 'text-white' : 'text-sage-800'
        }`}>
          {exercise.name}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
            <span className={`text-xs ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
              {exercise.repsOrDuration || `${exercise.duration}min`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>Springs:</span>
            {getSpringVisual(exercise.springs)}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge className={`text-xs ${
            preferences.darkMode 
              ? 'bg-gray-700 text-gray-300 border-gray-600' 
              : 'bg-sage-100 text-sage-700 border-sage-200'
          }`}>
            {exercise.category}
          </Badge>
          {exercise.muscleGroups.slice(0, 2).map(group => (
            <Badge key={group} variant="secondary" className="text-xs">
              {group}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {showAddButton && (
          <SmartAddButton
            exercise={exercise}
            size="sm"
            className="h-8 w-8 p-0"
            showFeedback={true}
          />
        )}
        {showRemoveButton && (
          <Button
            onClick={() => onRemoveExercise(exercise.id)}
            size="sm"
            variant="ghost"
            className={`h-8 w-8 p-0 ${
              preferences.darkMode 
                ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                : 'text-red-500 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
        <Button
          onClick={() => toggleFavoriteExercise(exercise.id)}
          size="sm"
          variant="ghost"
          className={`h-8 w-8 p-0 ${
            preferences.favoriteExercises?.includes(exercise.id)
              ? 'text-red-500 hover:text-red-600' 
              : preferences.darkMode 
                ? 'text-gray-400 hover:text-red-500' 
                : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${
            preferences.favoriteExercises?.includes(exercise.id) ? 'fill-current' : ''
          }`} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`h-full ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 to-white'}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b p-4`}>
          <TabsList className={`w-full ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'}`}>
            <TabsTrigger value="shortlist" className="flex-1 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Shortlist ({favoritedExercises.length})
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex-1 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Class Plan ({currentClass.exercises.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="shortlist" className="flex-1 p-6 mt-0">
          <Card className={`h-full ${preferences.darkMode ? 'border-gray-600 bg-gray-800' : 'border-sage-200 bg-white'}`}>
            <CardHeader>
              <CardTitle className={`text-lg ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Favorite Exercises
              </CardTitle>
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                Your favorited exercises ready to add to classes
              </p>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              {favoritedExercises.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className={`h-12 w-12 mx-auto mb-4 ${
                    preferences.darkMode ? 'text-gray-600' : 'text-sage-300'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${
                    preferences.darkMode ? 'text-gray-300' : 'text-sage-600'
                  }`}>
                    No favorites yet
                  </h3>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                    Browse the exercise library and favorite exercises to see them here
                  </p>
                  <Button 
                    onClick={onAddExercise}
                    className="mt-4 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                  >
                    Browse Exercises
                  </Button>
                </div>
              ) : (
                favoritedExercises.map((exercise) => (
                  <ExerciseListItem 
                    key={exercise.id} 
                    exercise={exercise} 
                    showAddButton={true}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="flex-1 p-6 mt-0">
          <Card className={`h-full ${preferences.darkMode ? 'border-gray-600 bg-gray-800' : 'border-sage-200 bg-white'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <input
                    type="text"
                    value={currentClass.name}
                    onChange={(e) => onUpdateClassName(e.target.value)}
                    className={`text-lg font-semibold bg-transparent border-none outline-none ${
                      preferences.darkMode ? 'text-white' : 'text-sage-800'
                    }`}
                    placeholder="Class name..."
                  />
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    {currentClass.exercises.length} exercises • {currentClass.totalDuration} minutes
                  </p>
                </div>
                <Button 
                  onClick={onAddExercise}
                  size="sm"
                  className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Exercise
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
              {currentClass.exercises.length === 0 ? (
                <div className="text-center py-12">
                  <Plus className={`h-12 w-12 mx-auto mb-4 ${
                    preferences.darkMode ? 'text-gray-600' : 'text-sage-300'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${
                    preferences.darkMode ? 'text-gray-300' : 'text-sage-600'
                  }`}>
                    Start building your class
                  </h3>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                    Add exercises from your favorites or browse the exercise library
                  </p>
                  <Button 
                    onClick={onAddExercise}
                    className="mt-4 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                  >
                    Browse Exercises
                  </Button>
                </div>
              ) : (
                currentClass.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      preferences.darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-sage-100 text-sage-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <ExerciseListItem 
                        exercise={exercise} 
                        showRemoveButton={true}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
