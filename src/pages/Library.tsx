
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { MobileOptimizedExerciseLibrary } from '@/components/MobileOptimizedExerciseLibrary';
import { Exercise } from '@/types/reformer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { usePersistedClassPlan } from '@/hooks/usePersistedClassPlan';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { preferences } = useUserPreferences();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { addExercise } = usePersistedClassPlan();
  const isMobile = useIsMobile();

  if (loading || exercisesLoading) {
    return (
      <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} flex items-center justify-center`}>
        <div className={preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleAddExercise = (exercise: Exercise) => {
    console.log('🔵 Library handleAddExercise called with:', exercise);
    
    try {
      // Use the persisted class plan's addExercise function directly
      addExercise(exercise);
      console.log('🔵 Exercise added to persisted class plan successfully');
      
      toast({
        title: "Added to class",
        description: `"${exercise.name}" has been added to your class plan.`,
      });
      
      // Navigate to plan page to show the updated class
      navigate('/plan');
    } catch (error) {
      console.error('🔴 Error in Library handleAddExercise:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to class plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20 safe-area-pb`}>
      <div className="min-h-screen flex flex-col">
        {isMobile ? (
          <MobileOptimizedExerciseLibrary onExerciseSelect={handleAddExercise} />
        ) : (
          <ExerciseLibrary onAddExercise={handleAddExercise} />
        )}
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Library;
