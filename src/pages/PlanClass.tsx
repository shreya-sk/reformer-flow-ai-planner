
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { ClassBuilder } from '@/components/ClassBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Undo, Redo } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

const PlanClass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { saveClassPlan, savedClasses } = useClassPlans();
  const { preferences } = useUserPreferences();
  
  // Get cart exercises from navigation state
  const cartExercises = location.state?.cartExercises || [];
  const loadedClass = location.state?.loadedClass;

  const initialClass: ClassPlan = loadedClass || {
    id: '',
    name: 'New Class',
    exercises: cartExercises,
    totalDuration: cartExercises.reduce((sum: number, ex: Exercise) => sum + ex.duration, 0),
    createdAt: new Date(),
    notes: '',
  };

  const {
    state: currentClass,
    set: setCurrentClass,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetUndoHistory
  } = useUndoRedo<ClassPlan>(initialClass);

  const [isEditing, setIsEditing] = useState(false);

  // Clear navigation state after using it
  useEffect(() => {
    if (location.state?.cartExercises || location.state?.loadedClass) {
      // Replace the current entry in history to clear the state
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const addExerciseToClass = (exercise: Exercise) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...exercise, id: `${exercise.id}-${Date.now()}` }],
      totalDuration: prev.totalDuration + exercise.duration,
    }));
  };

  const removeExerciseFromClass = (exerciseId: string) => {
    const exercise = currentClass.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentClass(prev => ({
        ...prev,
        exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
        totalDuration: prev.totalDuration - exercise.duration,
      }));
    }
  };

  const reorderExercises = (exercises: Exercise[]) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises,
    }));
  };

  const updateExerciseInClass = (updatedExercise: Exercise) => {
    setCurrentClass(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  const updateClassName = (name: string) => {
    setCurrentClass(prev => ({ ...prev, name }));
  };

  const handleSaveClass = async () => {
    if (currentClass.exercises.length === 0) {
      toast({
        title: "Cannot save empty class",
        description: "Add some exercises to your class before saving.",
        variant: "destructive",
      });
      return;
    }
    
    const classToSave = {
      ...currentClass,
      name: currentClass.name || `Class ${Date.now()}`,
    };
    
    await saveClassPlan(classToSave);
    
    toast({
      title: "Class saved!",
      description: "Redirecting to My Classes...",
    });
    
    // Reset undo history after saving
    resetUndoHistory(classToSave);
    
    // Navigate back to home after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-4 sticky top-0 z-40`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className={`${preferences.darkMode ? 'text-gray-300 hover:text-white' : 'text-sage-600 hover:text-sage-800'}`}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
            
            {isEditing ? (
              <Input
                value={currentClass.name}
                onChange={(e) => updateClassName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className={`text-lg font-semibold w-48 ${preferences.darkMode ? 'border-gray-600 focus:border-gray-500 bg-gray-700 text-white' : 'border-sage-300 focus:border-sage-500'}`}
                autoFocus
              />
            ) : (
              <h1 
                className={`text-lg font-semibold ${preferences.darkMode ? 'text-white hover:text-gray-200' : 'text-sage-800'} cursor-pointer hover:text-sage-900 transition-colors px-2 py-1 rounded ${preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-sage-50'}`}
                onClick={() => setIsEditing(true)}
              >
                {currentClass.name}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Undo/Redo buttons */}
            <div className="flex gap-1">
              <Button
                onClick={undo}
                disabled={!canUndo}
                size="sm"
                variant="outline"
                className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={!canRedo}
                size="sm"
                variant="outline"
                className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} px-3 py-1 rounded-full`}>
                <span className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{formatDuration(currentClass.totalDuration)}</span>
              </div>
              <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} px-3 py-1 rounded-full`}>
                <span className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{currentClass.exercises.length}</span>
                <span className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} ml-1`}>exercises</span>
              </div>
            </div>

            <Button 
              onClick={handleSaveClass}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
              disabled={currentClass.exercises.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Class
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-85px)]">
        <ExerciseLibrary onAddExercise={addExerciseToClass} />
        
        <ClassBuilder 
          currentClass={currentClass}
          onRemoveExercise={removeExerciseFromClass}
          onReorderExercises={reorderExercises}
          onUpdateExercise={updateExerciseInClass}
          savedClasses={savedClasses}
          onAddExercise={addExerciseToClass}
        />
      </div>
    </div>
  );
};

export default PlanClass;
