
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { ClassBuilder } from '@/components/ClassBuilder';
import { Exercise } from '@/types/reformer';

const PlanClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const { updateUserExercise, customizeSystemExercise } = useExercises();
  const {
    currentClassPlan,
    getRealExerciseCount,
    addExercise,
    removeExercise,
    updateClassName,
    reorderExercises,
    syncExerciseUpdates,
    clearClassPlan
  } = usePersistedClassPlan();
  const [isTeachingMode, setIsTeachingMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const realExerciseCount = getRealExerciseCount();

  if (!user) {
    return <AuthPage />;
  }

  if (isTeachingMode) {
    return <ClassTeachingMode classPlan={currentClassPlan} onClose={() => setIsTeachingMode(false)} />;
  }

  const handleSaveClass = async () => {
    console.log('💾 Save attempt - real exercises:', realExerciseCount);
    console.log('💾 Current class state:', {
      name: currentClassPlan.name,
      exerciseCount: currentClassPlan.exercises.length,
      realExerciseCount,
      exercises: currentClassPlan.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        isCustom: ex.isCustom,
        isSystemExercise: ex.isSystemExercise
      }))
    });

    if (realExerciseCount === 0) {
      setSaveError("Add some exercises to your class before saving.");
      setTimeout(() => setSaveError(null), 3000);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const classToSave = {
        ...currentClassPlan,
        name: currentClassPlan.name || `Class ${Date.now()}`
      };

      console.log('💾 Starting save process for:', classToSave.name, 'with', realExerciseCount, 'real exercises');
      const savedClass = await saveClassPlan(classToSave);
      console.log('💾 Save successful:', savedClass);

      setSaveSuccess(true);
      
      setTimeout(() => {
        clearClassPlan();
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('💾 Save failed:', error);
      setIsSaving(false);
      setSaveSuccess(false);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(`Could not save class: ${errorMessage}`);
      setTimeout(() => setSaveError(null), 5000);
    }
  };

  const handleAddExercise = () => {
    navigate('/library');
  };

  const handleAddCallout = (name: string, position: number) => {
    console.log('PlanClass handleAddCallout called with name:', name, 'position:', position);
    const { createCallout } = usePersistedClassPlan();
    createCallout(name, '#e5e7eb');
  };

  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    try {
      if (updatedExercise.isSystemExercise) {
        await customizeSystemExercise(updatedExercise, {
          name: updatedExercise.name,
          duration: updatedExercise.duration,
          springs: updatedExercise.springs,
          cues: updatedExercise.cues,
          notes: updatedExercise.notes,
          difficulty: updatedExercise.difficulty,
          setup: updatedExercise.setup,
          repsOrDuration: updatedExercise.repsOrDuration,
          tempo: updatedExercise.tempo,
          targetAreas: updatedExercise.targetAreas,
          breathingCues: updatedExercise.breathingCues,
          teachingFocus: updatedExercise.teachingFocus,
          modifications: updatedExercise.modifications
        });
      } else {
        await updateUserExercise(updatedExercise.id, updatedExercise);
      }

      syncExerciseUpdates(updatedExercise);
    } catch (error) {
      console.error('Error updating exercise:', error);
      setSaveError("Could not save exercise changes.");
      setTimeout(() => setSaveError(null), 3000);
    }
  };

  const handleReorderExercises = (exercises: Exercise[]) => {
    reorderExercises(exercises);
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-50 via-white to-sage-100'} pb-20 relative overflow-hidden`}>
      {/* Enhanced background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50/80 via-white/90 to-sage-100/80 backdrop-blur-xl"></div>
      
      {/* Floating translucent elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-sage-200/20 rounded-full blur-xl"></div>
      <div className="absolute top-60 right-20 w-24 h-24 bg-sage-300/15 rounded-full blur-lg"></div>
      <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-sage-100/25 rounded-full blur-2xl"></div>

      {/* Save Status Messages */}
      {saveError && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
          Class saved successfully! Redirecting...
        </div>
      )}

      {/* Class Builder Content with backdrop blur */}
      <div className="relative z-10 px-2 sm:px-3 pt-4">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-4 mb-4">
          <ClassBuilder 
            currentClass={currentClassPlan} 
            onRemoveExercise={removeExercise} 
            onReorderExercises={handleReorderExercises} 
            onUpdateExercise={handleUpdateExercise} 
            onAddExercise={handleAddExercise} 
            onAddCallout={handleAddCallout} 
            onUpdateClassName={updateClassName} 
            onSaveClass={handleSaveClass} 
            isSaving={isSaving}
            saveSuccess={saveSuccess}
          />
        </div>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default PlanClass;
