
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const Library = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { preferences } = useUserPreferences();

  if (loading) {
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

  const startNewClass = () => {
    navigate('/plan');
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      {/* Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-4 sticky top-0 z-40`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className={`${preferences.darkMode ? 'text-gray-300 hover:text-white' : 'text-sage-600 hover:text-sage-800'}`}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
            
            <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Exercise Library</h1>
          </div>

          <Button 
            onClick={startNewClass}
            className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
          >
            Plan New Class
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-85px)]">
        <ExerciseLibrary onAddExercise={handleAddExercise} />
        
        {/* Welcome Panel */}
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className={`bg-gradient-to-br ${preferences.darkMode ? 'from-gray-700 to-gray-800' : 'from-sage-100 to-sage-200'} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
              <BookOpen className={`h-10 w-10 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-500'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-700'}`}>Explore Exercises</h3>
            <p className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'} text-sm leading-relaxed mb-4`}>
              Browse our comprehensive exercise library. Click on any exercise to view details, or use the add button to start building your class.
            </p>
            <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-sage-50 border-sage-200'} rounded-lg p-4 border`}>
              <p className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} font-medium text-sm`}>
                💡 Tip: Use filters to find exercises by muscle group or position
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Library;
