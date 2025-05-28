
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassPlanCart } from '@/components/plan-class/ClassPlanCart';
import { ClassHeader } from '@/components/plan-class/ClassHeader';
import { Exercise } from '@/types/reformer';
import { toast } from '@/hooks/use-toast';
import { AuthPage } from '@/components/AuthPage';

const PlanClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const {
    currentClass,
    addExercise,
    removeExercise,
    updateClassName,
    reorderExercises,
    updateExercise,
    clearClassPlan
  } = usePersistedClassPlan();

  if (!user) {
    return <AuthPage />;
  }

  const handleSaveClass = async () => {
    if (currentClass.exercises.filter(ex => ex.category !== 'callout').length === 0) {
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

      <ClassPlanCart
        currentClass={currentClass}
        onUpdateClassName={updateClassName}
        onRemoveExercise={removeExercise}
        onReorderExercises={reorderExercises}
        onUpdateExercise={updateExercise}
        onSaveClass={handleSaveClass}
        onAddExercise={handleAddExercise}
      />
    </div>
  );
};

export default PlanClass;
