
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassHeader } from '@/components/plan-class/ClassHeader';
import { TabbedPlanView } from '@/components/plan-class/TabbedPlanView';
import { BottomNavigation } from '@/components/BottomNavigation';
import { toast } from '@/hooks/use-toast';
import { AuthPage } from '@/components/AuthPage';

const PlanClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const {
    currentClass,
    removeExercise,
    updateClassName,
    updateClassDuration,
    addCallout,
    clearClassPlan,
    reorderExercises
  } = usePersistedClassPlan();

  if (!user) {
    return <AuthPage />;
  }

  const handleSaveClass = async () => {
    const realExercises = currentClass.exercises.filter(ex => ex.category !== 'callout');
    if (realExercises.length === 0) {
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
    
    clearClassPlan();
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleAddExercise = () => {
    navigate('/library');
  };

  const handleUpdateCallout = (calloutId: string, newName: string) => {
    const updatedExercises = currentClass.exercises.map(exercise => 
      exercise.id === calloutId && exercise.category === 'callout'
        ? { ...exercise, name: newName }
        : exercise
    );
    reorderExercises(updatedExercises);
  };

  const handleDeleteCallout = (calloutId: string) => {
    const updatedExercises = currentClass.exercises.filter(exercise => 
      !(exercise.id === calloutId && exercise.category === 'callout')
    );
    reorderExercises(updatedExercises);
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      <ClassHeader
        currentClass={currentClass}
        onUpdateClassName={updateClassName}
        onSaveClass={handleSaveClass}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
      />

      <TabbedPlanView
        currentClass={currentClass}
        onRemoveExercise={removeExercise}
        onUpdateClassName={updateClassName}
        onUpdateClassDuration={updateClassDuration}
        onAddExercise={handleAddExercise}
        onAddCallout={addCallout}
        onUpdateCallout={handleUpdateCallout}
        onDeleteCallout={handleDeleteCallout}
        onReorderExercises={reorderExercises}
      />

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default PlanClass;
