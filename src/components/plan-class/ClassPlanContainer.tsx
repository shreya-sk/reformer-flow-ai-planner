import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
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
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [showLibrary, setShowLibrary] = useState(false);
  
  // Use the persisted class plan hook instead of undo/redo for now
  const {
    currentClass,
    addExercise,
    removeExercise,
    reorderExercises,
    updateClassName,
    clearClassPlan
  } = usePersistedClassPlan();

  // Handle initial loading from navigation state
  useEffect(() => {
    const cartExercises = location.state?.cartExercises || [];
    const loadedClass = location.state?.loadedClass;
    
    if (loadedClass) {
      // Load the class from navigation state
      console.log('🔵 Loading class from navigation:', loadedClass);
      // We'd need to add a method to load a full class plan
    } else if (cartExercises.length > 0) {
      // Add cart exercises to the current class
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

  // Debug: Log current class state changes
  useEffect(() => {
    console.log('🔵 Current class state changed:', {
      name: currentClass.name,
      exerciseCount: currentClass.exercises.length,
      totalDuration: currentClass.totalDuration,
      exercises: currentClass.exercises.map(ex => ({ id: ex.id, name: ex.name }))
    });
  }, [currentClass]);

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
        <div className="p-4">
          <ExerciseLibrary />
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
    </div>
  );
};