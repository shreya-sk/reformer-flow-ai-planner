import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { ClassHeader } from './ClassHeader';
import { ClassPlanCart } from './ClassPlanCart';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { Exercise, ClassPlan } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';

export const ClassPlanContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Use the persisted class plan hook
  const {
    currentClass,
    addExercise,
    removeExercise,
    reorderExercises,
    updateClassName,
    updateClassDuration,
    updateClassNotes,
    updateClassImage,
    clearClassPlan
  } = usePersistedClassPlan();

  console.log('🔍 ClassPlanContainer Debug:', {
    'currentClass': currentClass,
    'currentClass.exercises': currentClass.exercises,
    'currentClass.exercises.length': currentClass.exercises.length
  });

  // Load class from navigation state if provided
  useEffect(() => {
    const cartExercises = location.state?.cartExercises;
    const loadedClass = location.state?.loadedClass;
    
    if (loadedClass) {
      // If we have a loaded class, we should set it in the persisted state
      // For now, we'll just navigate without state to avoid conflicts
      navigate(location.pathname, { replace: true });
    } else if (cartExercises && cartExercises.length > 0) {
      // Add cart exercises to current class
      cartExercises.forEach((exercise: Exercise) => {
        addExercise(exercise);
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, addExercise]);

  const {
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo(currentClass);

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
        description: "Redirecting to My Classes...",
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast({
        title: "Error saving class",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddExercise = () => {
    setShowLibrary(true);
  };

  const handleStartTeaching = () => {
    if (currentClass.exercises.length === 0) {
      toast({
        title: "Cannot start teaching",
        description: "Add some exercises to your class first.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/teaching/${currentClass.id}`);
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
          onStartTeaching={handleStartTeaching}
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
        onStartTeaching={handleStartTeaching}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Class Plan Cart */}
          <div className="lg:w-1/3">
            <ClassPlanCart
              currentClass={currentClass}
              onRemoveExercise={removeExercise}
              onReorderExercises={reorderExercises}
              onAddExercise={handleAddExercise}
            />
          </div>

          {/* Quick Add Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <h2 className="text-xl font-semibold text-sage-800 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={handleAddExercise}
                  className="w-full p-4 border-2 border-dashed border-sage-300 rounded-lg text-sage-600 hover:border-sage-400 hover:bg-sage-50 transition-colors"
                >
                  + Add Exercise from Library
                </button>
                
                {currentClass.exercises.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleSaveClass}
                      className="p-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                    >
                      Save Class
                    </button>
                    <button
                      onClick={handleStartTeaching}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Teaching
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};