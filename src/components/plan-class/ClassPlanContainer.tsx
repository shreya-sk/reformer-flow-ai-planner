
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassHeader } from './ClassHeader';
import { ClassPlanCart } from './ClassPlanCart';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { Exercise, ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

export const ClassPlanContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { saveClassPlan, savedClasses } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [showLibrary, setShowLibrary] = useState(false);
  
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

  // Clear navigation state after using it
  useEffect(() => {
    if (location.state?.cartExercises || location.state?.loadedClass) {
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
      totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0),
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
    
    resetUndoHistory(classToSave);
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleAddExercise = () => {
    setShowLibrary(true);
  };

  const handleLibraryAddExercise = (exercise: Exercise) => {
    addExerciseToClass(exercise);
    
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (showLibrary) {
    return (
      <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20 safe-area-pb`}>
        <ClassHeader
          currentClass={currentClass}
          onUpdateClassName={updateClassName}
          onSaveClass={handleSaveClass}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          showBackButton={true}
          onBack={() => setShowLibrary(false)}
        />
        <ExerciseLibrary />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20 safe-area-pb`}>
      <ClassHeader
        currentClass={currentClass}
        onUpdateClassName={updateClassName}
        onSaveClass={handleSaveClass}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <ClassPlanCart
        currentClass={currentClass}
        onUpdateClassName={updateClassName}
        onRemoveExercise={removeExerciseFromClass}
        onReorderExercises={reorderExercises}
        onUpdateExercise={updateExerciseInClass}
        onSaveClass={handleSaveClass}
        onAddExercise={handleAddExercise}
      />
    </div>
  );
};
