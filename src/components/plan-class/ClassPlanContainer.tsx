import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassHeader } from './ClassHeader';
import { ImprovedClassBuilder } from './ImprovedClassBuilder';
import { CategoryExerciseLibrary } from '@/components/CategoryExerciseLibrary';
import { ModernExerciseModal } from '@/components/ModernExerciseModal';
import { Exercise, ClassPlan } from '@/types/reformer';

export const ClassPlanContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Use the persisted class plan hook
  const {
    currentClassPlan,
    addExercise,
    removeExercise,
    reorderExercises,
    updateClassName,
    clearClassPlan,
    loadClass,
    syncExerciseUpdates
  } = usePersistedClassPlan();

  // Handle initial loading from navigation state
  useEffect(() => {
    const cartExercises = location.state?.cartExercises || [];
    const loadedClass = location.state?.loadedClass;
    
    if (loadedClass) {
      console.log('🔵 Loading class from navigation:', loadedClass);
      loadClass(loadedClass);
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
  }, [location.state, navigate, addExercise, loadClass]);

  const handleSaveClass = async () => {
    const realExercises = currentClassPlan.exercises.filter(ex => ex.category !== 'callout');
    
    if (realExercises.length === 0) {
      console.error('Cannot save empty class');
      return;
    }
    
    const classToSave = {
      ...currentClassPlan,
      name: currentClassPlan.name || `Class ${Date.now()}`,
    };
    
    try {
      console.log('💾 Saving class with exercises:', realExercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        isCustom: ex.isCustom,
        isSystemExercise: ex.isSystemExercise
      })));
      
      await saveClassPlan(classToSave);
      
      // Clear the current class plan after saving
      clearClassPlan();
      
      // Navigate back to home
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleAddExercise = () => {
    console.log('🔵 Opening exercise library');
    setShowLibrary(true);
  };

  const handleExerciseSelection = (exercise: Exercise) => {
    console.log('🔵 Exercise selected from library:', exercise.name);
    addExercise(exercise);
    console.log('🔵 Exercise added successfully');
  };

  const handleEditExercise = (exercise: Exercise) => {
    console.log('📝 Opening exercise for editing:', exercise.name);
    setEditingExercise(exercise);
    setShowEditModal(true);
  };

  // Fix: Make this function async to match the expected type
  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    console.log('💾 Saving exercise updates:', updatedExercise.name);
    syncExerciseUpdates(updatedExercise);
    setShowEditModal(false);
    setEditingExercise(null);
  };

  const handleReorderExercises = (exercises: Exercise[]) => {
    // Convert the exercises array to individual indices for the reorderExercises function
    // For now, we'll just update with the new exercise order directly
    currentClassPlan.exercises = exercises;
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (showLibrary) {
    return (
      <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-25 via-white to-blue-50'} pb-20 safe-area-pb`}>
        <ClassHeader
          currentClass={currentClassPlan}
          onUpdateClassName={updateClassName}
          onSaveClass={handleSaveClass}
          onUndo={() => {}}
          onRedo={() => {}}
          canUndo={false}
          canRedo={false}
          showBackButton={true}
          onBack={() => {
            console.log('🔵 Closing exercise library');
            setShowLibrary(false);
          }}
        />
        <div className="pt-4">
          <CategoryExerciseLibrary 
            onExerciseSelect={handleExerciseSelection}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-25 via-white to-blue-50'} pb-20 safe-area-pb`}>
      <ClassHeader
        currentClass={currentClassPlan}
        onUpdateClassName={updateClassName}
        onSaveClass={handleSaveClass}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
      />

      <div className="px-2 py-4">
        <ImprovedClassBuilder
          currentClass={currentClassPlan}
          onUpdateClassName={updateClassName}
          onRemoveExercise={removeExercise}
          onReorderExercises={handleReorderExercises}
          onUpdateExercise={handleUpdateExercise}
          onSaveClass={handleSaveClass}
          onAddExercise={handleAddExercise}
          onEditExercise={handleEditExercise}
        />
      </div>

      {/* Exercise Edit Modal */}
      {editingExercise && (
        <ModernExerciseModal
          exercise={editingExercise}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingExercise(null);
          }}
          onEdit={() => {
            // Already in edit mode
          }}
        />
      )}
    </div>
  );
};
