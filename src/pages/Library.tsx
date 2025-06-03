
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryExerciseLibrary } from '@/components/CategoryExerciseLibrary';
import { Exercise } from '@/types/reformer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { useClassPlanSync } from '@/hooks/useClassPlanSync';
import { toast } from '@/hooks/use-toast';

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { preferences } = useUserPreferences();
  const { exercises, loading: exercisesLoading, refetch } = useExercises();
  const { addExerciseToCurrentPlan, currentExerciseCount } = useClassPlanSync();

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
    console.log('🔵 Library: handleAddExercise called with:', exercise.name);
    console.log('🔵 Library: Current exercise count before adding:', currentExerciseCount);
    
    try {
      const success = addExerciseToCurrentPlan(exercise);
      
      if (success) {
        console.log('🔵 Library: Exercise added successfully, navigating to plan');
        toast({
          title: "Added to class",
          description: `"${exercise.name}" has been added to your class plan.`,
        });
        
        // Navigate to plan page to show the updated class
        navigate('/plan');
      } else {
        throw new Error('Failed to add exercise to plan');
      }
    } catch (error) {
      console.error('🔴 Library: Error in handleAddExercise:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise to class.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20 safe-area-pb`}>
      <div className="min-h-screen flex flex-col">
        <CategoryExerciseLibrary onExerciseSelect={handleAddExercise} />
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Library;
