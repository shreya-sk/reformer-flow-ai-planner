
import { useParams, useNavigate } from 'react-router-dom';
import { useClassPlans } from '@/hooks/useClassPlans';
import { MobileTeachingMode } from '@/components/MobileTeachingMode';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useEffect } from 'react';

const Teaching = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classPlans, loading, refetch } = useClassPlans();
  const { preferences } = useUserPreferences();

  console.log('🎯 Teaching page - classId:', classId);
  console.log('🎯 Available class plans:', classPlans);
  console.log('🎯 Loading state:', loading);

  useEffect(() => {
    if (!loading && classPlans.length === 0) {
      console.log('🎯 No class plans found, refetching...');
      refetch();
    }
  }, [loading, classPlans.length, refetch]);

  if (!user) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Loading class...
          </h1>
        </div>
      </div>
    );
  }

  const classPlan = classPlans.find(c => c.id === classId);

  if (!classPlan) {
    console.log('🎯 Class not found. ClassId:', classId);
    console.log('🎯 Available class IDs:', classPlans.map(c => c.id));
    
    return (
      <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className={`text-2xl font-bold mb-4 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Class not found
          </h1>
          <p className={`mb-6 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
            The class you're looking for doesn't exist or may have been deleted.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-sage-600 text-white px-6 py-3 rounded-lg hover:bg-sage-700 transition-colors"
            >
              Back to Home
            </button>
            <button 
              onClick={() => refetch()}
              className={`w-full border px-6 py-3 rounded-lg transition-colors ${
                preferences.darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-sage-300 text-sage-600 hover:bg-sage-50'
              }`}
            >
              Refresh Classes
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-xs">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <p>Looking for ID: {classId}</p>
              <p>Available classes: {classPlans.length}</p>
              <p>Class IDs: {classPlans.map(c => c.id).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  console.log('🎯 Found class plan:', classPlan.name);

  return (
    <MobileTeachingMode
      classPlan={classPlan}
      onClose={() => navigate('/')}
    />
  );
};

export default Teaching;
