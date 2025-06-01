
import { useParams, useNavigate } from 'react-router-dom';
import { useClassPlans } from '@/hooks/useClassPlans';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useEffect, useState } from 'react';
import { ClassPlan } from '@/types/reformer';

const Teaching = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classPlans, loading, refetch } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [foundClass, setFoundClass] = useState<ClassPlan | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  console.log('🎯 Teaching page - classId:', classId);
  console.log('🎯 Available class plans:', classPlans?.length || 0, 'plans');
  console.log('🎯 Loading state:', loading);
  console.log('🎯 User state:', user?.id);

  // Handle navigation when user is not authenticated
  useEffect(() => {
    if (!user) {
      console.log('🎯 No user found, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  // Search for the class plan once data is loaded
  useEffect(() => {
    if (!loading && !searchAttempted && classPlans.length > 0 && classId) {
      console.log('🎯 Searching for class plan...');
      console.log('🎯 Available class IDs:', classPlans.map(c => c.id));
      
      const classPlan = classPlans.find(c => c.id === classId);
      
      if (classPlan) {
        console.log('🎯 Found class plan:', classPlan.name);
        setFoundClass(classPlan);
      } else {
        console.log('🎯 Class not found, attempting refetch...');
        // Try refetching data in case it's stale
        refetch();
      }
      
      setSearchAttempted(true);
    }
  }, [loading, classPlans, classId, searchAttempted, refetch]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  // Show loading while we're fetching data or haven't attempted search yet
  if (loading || !searchAttempted) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Loading class...
          </h1>
          <p className={`text-sm mt-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
            Please wait while we prepare your class for teaching mode
          </p>
        </div>
      </div>
    );
  }

  // If we've searched but still no class found
  if (searchAttempted && !foundClass) {
    console.log('🎯 Class not found after search. ClassId:', classId);
    console.log('🎯 Available class IDs:', classPlans.map(c => c.id));
    
    return (
      <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h1 className={`text-2xl font-bold mb-4 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Class not found
            </h1>
            <p className={`mb-6 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
              The class you're looking for doesn't exist or may have been deleted. Please try going back to your class list and selecting a class again.
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-sage-600 text-white px-6 py-3 rounded-lg hover:bg-sage-700 transition-colors font-medium"
            >
              Back to My Classes
            </button>
            <button 
              onClick={() => {
                setSearchAttempted(false);
                setFoundClass(null);
                refetch();
              }}
              className={`w-full border px-6 py-3 rounded-lg transition-colors font-medium ${
                preferences.darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-sage-300 text-sage-600 hover:bg-sage-50'
              }`}
            >
              Refresh & Try Again
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-xs">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <p><strong>Looking for ID:</strong> {classId}</p>
              <p><strong>Available classes:</strong> {classPlans.length}</p>
              <p><strong>Available IDs:</strong></p>
              <div className="max-h-20 overflow-y-auto">
                {classPlans.map((c, i) => (
                  <div key={i} className="text-xs">
                    {i + 1}. {c.id} - "{c.name}"
                  </div>
                ))}
              </div>
              <p><strong>Search attempted:</strong> {searchAttempted ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If we have a found class, show teaching mode
  if (foundClass) {
    console.log('🎯 Rendering teaching mode for class:', foundClass.name);
    
    // Validate that the class has exercises
    const realExercises = foundClass.exercises.filter(ex => ex.category !== 'callout');
    
    if (realExercises.length === 0) {
      return (
        <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className={`text-2xl font-bold mb-4 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Empty Class
              </h1>
              <p className={`mb-6 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                This class "{foundClass.name}" doesn't have any exercises to teach. Please add some exercises to the class first.
              </p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/plan`, { state: { loadedClass: foundClass } })}
                className="w-full bg-sage-600 text-white px-6 py-3 rounded-lg hover:bg-sage-700 transition-colors font-medium"
              >
                Edit Class
              </button>
              <button 
                onClick={() => navigate('/')}
                className={`w-full border px-6 py-3 rounded-lg transition-colors font-medium ${
                  preferences.darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-sage-300 text-sage-600 hover:bg-sage-50'
                }`}
              >
                Back to Classes
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ClassTeachingMode
        classPlan={foundClass}
        onClose={() => navigate('/')}
      />
    );
  }

  // Fallback loading state
  return (
    <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
        <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
          Preparing class...
        </h1>
      </div>
    </div>
  );
};

export default Teaching;
