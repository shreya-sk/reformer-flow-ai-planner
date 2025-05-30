import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassHeader } from './ClassHeader';
import { ClassPlanCart } from './ClassPlanCart';
import { MobileOptimizedExerciseLibrary } from '@/components/MobileOptimizedExerciseLibrary';
import { Exercise, ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export const ClassPlanContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Use the persisted class plan hook - this is the source of truth
  const {
    currentClass,
    addExercise,
    removeExercise,
    reorderExercises,
    updateClassName,
    clearClassPlan,
    addCallout
  } = usePersistedClassPlan();

  // Debug: Log whenever currentClass changes
  useEffect(() => {
    console.log('🔵 ClassPlanContainer: currentClass updated:', {
      name: currentClass.name,
      exerciseCount: currentClass.exercises.length,
      totalDuration: currentClass.totalDuration,
      exercises: currentClass.exercises.map(ex => ({ 
        id: ex.id, 
        name: ex.name, 
        duration: ex.duration 
      }))
    });
  }, [currentClass]);

  // Handle initial loading from navigation state
  useEffect(() => {
    const cartExercises = location.state?.cartExercises || [];
    const loadedClass = location.state?.loadedClass;
    
    if (loadedClass) {
      console.log('🔵 Loading class from navigation:', loadedClass);
      // TODO: Implement loadClass method in usePersistedClassPlan
    } else if (cartExercises.length > 0) {
      console.log('🔵 Loading cart exercises:', cartExercises.length);
      cartExercises.forEach((exercise: Exercise) => {
        addExercise(exercise);
      });
    }
    
    // Clear navigation state after using it
    if (location.state?.cartExercises || location.state?.loadedClass) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, addExercise]);

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
    
    try {
      await saveClassPlan(classToSave);
      
      toast({
        title: "Class saved!",
        description: "Your class has been saved successfully.",
      });
      
      // Clear the current class plan after saving
      clearClassPlan();
      
      // Navigate back to home
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error saving class:', error);
      toast({
        title: "Save failed",
        description: "Failed to save your class. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddExercise = () => {
    console.log('🔵 Opening exercise library');
    setShowLibrary(true);
  };

  // Handle exercise selection from library - this is the key fix!
  const handleExerciseSelection = (exercise: Exercise) => {
    console.log('🔵 Exercise selected from library:', exercise.name);
    addExercise(exercise);
    // Don't close library immediately, let user add multiple exercises
    toast({
      title: "Added to class",
      description: `"${exercise.name}" has been added to your class plan.`,
    });
  };

  const handleAddCallout = (name: string, position: number) => {
    console.log('🔵 Adding callout:', name, 'at position:', position);
    addCallout(name, position);
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    console.log('🔵 Updating exercise:', updatedExercise.name);
    const updatedExercises = currentClass.exercises.map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    );
    reorderExercises(updatedExercises);
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
          onUndo={() => {}} // Disabled for now
          onRedo={() => {}} // Disabled for now
          canUndo={false}
          canRedo={false}
          showBackButton={true}
          onBack={() => {
            console.log('🔵 Closing exercise library');
            setShowLibrary(false);
          }}
        />
        <div className="pt-4">
          <MobileOptimizedExerciseLibrary 
            onExerciseSelect={handleExerciseSelection}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20 safe-area-pb`}>
      <ClassHeader
        currentClass={currentClass}
        onUpdateClassName={updateClassName}
        onSaveClass={handleSaveClass}
        onUndo={() => {}} // Disabled for now
        onRedo={() => {}} // Disabled for now
        canUndo={false}
        canRedo={false}
      />

      <div className="p-4 space-y-6">
        {/* Current Class Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-sage-800">{currentClass.name}</h2>
              <p className="text-sm text-sage-600">
                {currentClass.exercises.length} exercises • {currentClass.totalDuration} min
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddExercise}
                className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </button>
              <button
                onClick={handleSaveClass}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={currentClass.exercises.length === 0}
              >
                Save Class
              </button>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <ClassPlanCart
          currentClass={currentClass}
          exercises={currentClass.exercises}
          totalDuration={currentClass.totalDuration}
          onUpdateClassName={updateClassName}
          onRemoveExercise={removeExercise}
          onReorderExercises={reorderExercises}
          onAddExercise={handleAddExercise}
          onSaveClass={handleSaveClass}
        />

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded-lg text-xs">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Exercises in state: {currentClass.exercises.length}</p>
            <p>Total duration: {currentClass.totalDuration} min</p>
            <p>Class name: {currentClass.name}</p>
            <details>
              <summary>Exercise Details</summary>
              <pre>{JSON.stringify(currentClass.exercises.map(ex => ({
                id: ex.id,
                name: ex.name,
                duration: ex.duration
              })), null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};