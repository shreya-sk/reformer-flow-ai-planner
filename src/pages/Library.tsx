
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { MobileOptimizedExerciseLibrary } from '@/components/MobileOptimizedExerciseLibrary';
import { Exercise } from '@/types/reformer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useExercises } from '@/hooks/useExercises';
import { useIsMobile } from '@/hooks/use-mobile';

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { preferences } = useUserPreferences();
  const { exercises, loading: exercisesLoading, refetchExercises } = useExercises();
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
    // Navigate directly to plan page with the exercise
    navigate('/plan', { state: { selectedExercises: [exercise] } });
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20 safe-area-pb`}>
      {/* Full Width Exercise Library */}
      <div className="min-h-screen flex flex-col">
        {isMobile ? (
          <MobileOptimizedExerciseLibrary
            exercises={exercises}
            onExerciseSelect={handleAddExercise}
            onRefresh={refetchExercises}
          />
        ) : (
          <ExerciseLibrary onAddExercise={handleAddExercise} />
        )}
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Library;
