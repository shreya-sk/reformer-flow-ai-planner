
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Trash2, 
  GripVertical, 
  Clock, 
  Plus,
  Save,
  ChevronDown,
  ChevronUp,
  Edit2
} from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ClassPlanCartProps {
  currentClass: ClassPlan;
  onUpdateClassName: (name: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (exercises: Exercise[]) => void;
  onUpdateExercise: (exercise: Exercise) => void;
  onSaveClass: () => void;
  onAddExercise: () => void;
}

export const ClassPlanCart = ({
  currentClass,
  onUpdateClassName,
  onRemoveExercise,
  onReorderExercises,
  onUpdateExercise,
  onSaveClass,
  onAddExercise
}: ClassPlanCartProps) => {
  const { preferences } = useUserPreferences();
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Exercise>>({});

  const getSpringVisual = (springs: string) => {
    if (springs === 'none') return null;
    
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
              <div key={i} className={`w-3 h-3 rounded-full ${spring.color}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const addCallout = (index: number, type: 'warm-up' | 'legs' | 'arms' | 'cool-down') => {
    const calloutExercise: Exercise = {
      id: `callout-${Date.now()}`,
      name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      category: 'callout',
      difficulty: 'beginner',
      duration: 0,
      muscleGroups: [],
      equipment: [],
      springs: 'none',
      isPregnancySafe: true,
      description: `${type} section divider`,
      cues: [],
      notes: ''
    };

    const newExercises = [...currentClass.exercises];
    newExercises.splice(index, 0, calloutExercise);
    onReorderExercises(newExercises);
  };

  const handleExerciseClick = (exerciseId: string) => {
    if (expandedExercise === exerciseId) {
      setExpandedExercise(null);
      setEditingExercise(null);
    } else {
      setExpandedExercise(exerciseId);
    }
  };

  const startEditing = (exercise: Exercise) => {
    setEditingExercise(exercise.id);
    setEditForm(exercise);
  };

  const saveEdit = () => {
    if (editingExercise && editForm) {
      onUpdateExercise(editForm as Exercise);
      setEditingExercise(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingExercise(null);
    setEditForm({});
  };

  if (currentClass.exercises.length === 0) {
    return (
      <div className={`flex-1 ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} flex flex-col items-center justify-center p-8`}>
        <div className={`rounded-full w-24 h-24 flex items-center justify-center mb-6 ${
          preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'
        }`}>
          <Plus className={`h-12 w-12 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
        </div>
        
        <h3 className={`text-2xl font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          Your Class Plan is Empty
        </h3>
        
        <p className={`text-center mb-6 max-w-md ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
          Browse the exercise library and add exercises to start building your class plan.
        </p>
        
        <Button 
          onClick={onAddExercise}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg"
        >
          Browse Exercise Library
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex-1 ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} flex flex-col h-full`}>
      {/* Header */}
      <div className={`p-6 border-b ${preferences.darkMode ? 'border-gray-700 bg-gray-800' : 'border-sage-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Class Plan
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  {currentClass.exercises.filter(ex => ex.category !== 'callout').length}
                </div>
                <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  Exercises
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  {currentClass.exercises.filter(ex => ex.category !== 'callout').reduce((sum, ex) => sum + ex.duration, 0)}
                </div>
                <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  Minutes
                </div>
              </div>
            </div>
          </div>
          
          <Input
            value={currentClass.name}
            onChange={(e) => onUpdateClassName(e.target.value)}
            placeholder="Enter class name..."
            className={`text-lg font-semibold ${
              preferences.darkMode 
                ? 'border-gray-600 focus:border-gray-500 bg-gray-700 text-white' 
                : 'border-sage-300 focus:border-sage-500 bg-white'
            }`}
          />
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {currentClass.exercises.map((exercise, index) => (
            <div key={exercise.id}>
              {/* Callout Buttons */}
              <div className="flex justify-center gap-2 mb-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addCallout(index, 'warm-up')}
                  className={`text-xs ${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-600'}`}
                >
                  + Warm-up
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addCallout(index, 'legs')}
                  className={`text-xs ${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-600'}`}
                >
                  + Legs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addCallout(index, 'arms')}
                  className={`text-xs ${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-600'}`}
                >
                  + Arms
                </Button>
              </div>

              <Card className={`${
                preferences.darkMode 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-sage-200 bg-white'
              } ${exercise.category === 'callout' ? 'border-l-4 border-l-amber-400' : 'cursor-pointer hover:shadow-md'} transition-all`}
              onClick={() => exercise.category !== 'callout' && handleExerciseClick(exercise.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'} cursor-grab`} />
                      {exercise.category !== 'callout' && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          preferences.darkMode ? 'bg-gray-700 text-white' : 'bg-sage-100 text-sage-800'
                        }`}>
                          {currentClass.exercises.filter((ex, idx) => idx <= index && ex.category !== 'callout').length}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'} ${
                            exercise.category === 'callout' ? 'text-amber-600 text-lg' : ''
                          }`}>
                            {exercise.name}
                          </h4>
                          {exercise.category !== 'callout' && expandedExercise === exercise.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(exercise);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {exercise.category !== 'callout' && (
                            <div className="flex items-center gap-1">
                              {expandedExercise === exercise.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveExercise(exercise.id);
                            }}
                            className={`${
                              preferences.darkMode 
                                ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {exercise.category !== 'callout' && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                            <span className={preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}>
                              {exercise.duration}min
                            </span>
                          </div>
                          
                          {getSpringVisual(exercise.springs) && (
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`}>
                                Springs:
                              </span>
                              {getSpringVisual(exercise.springs)}
                            </div>
                          )}

                          <Badge className={`text-xs ${
                            preferences.darkMode 
                              ? 'bg-gray-700 text-gray-300 border-gray-600' 
                              : 'bg-sage-100 text-sage-700 border-sage-200'
                          }`}>
                            {exercise.category}
                          </Badge>
                        </div>
                      )}

                      {/* Expanded Content */}
                      {expandedExercise === exercise.id && exercise.category !== 'callout' && (
                        <div className={`mt-4 p-4 rounded-lg ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'}`}>
                          {editingExercise === exercise.id ? (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Duration (minutes)</label>
                                <Input
                                  type="number"
                                  value={editForm.duration}
                                  onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value)})}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea
                                  value={editForm.notes || ''}
                                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={saveEdit} className="bg-sage-600 hover:bg-sage-700">
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {exercise.description && (
                                <div>
                                  <h5 className="font-medium text-sm mb-1">Description</h5>
                                  <p className="text-sm opacity-80">{exercise.description}</p>
                                </div>
                              )}
                              {exercise.cues && exercise.cues.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-sm mb-2">Cues</h5>
                                  <ul className="text-sm space-y-1">
                                    {exercise.cues.map((cue, idx) => (
                                      <li key={idx} className="opacity-80">• {cue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {exercise.notes && (
                                <div>
                                  <h5 className="font-medium text-sm mb-1">Notes</h5>
                                  <p className="text-sm opacity-80">{exercise.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Final callout options */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addCallout(currentClass.exercises.length, 'cool-down')}
              className={`text-xs ${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-600'}`}
            >
              + Cool-down
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-6 border-t ${preferences.darkMode ? 'border-gray-700 bg-gray-800' : 'border-sage-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            onClick={onAddExercise}
            variant="outline"
            className={`flex-1 ${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-600'}`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Exercises
          </Button>
          
          <Button
            onClick={onSaveClass}
            disabled={currentClass.exercises.filter(ex => ex.category !== 'callout').length === 0}
            className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Class Plan
          </Button>
        </div>
      </div>
    </div>
  );
};
