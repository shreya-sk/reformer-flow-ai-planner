
import { useParams, useNavigate } from 'react-router-dom';
import { useClassPlans } from '@/hooks/useClassPlans';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const Teaching = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savedClasses } = useClassPlans();
  const { preferences } = useUserPreferences();

  if (!user) {
    navigate('/');
    return null;
  }

  const classPlan = savedClasses.find(c => c.id === classId);

  if (!classPlan) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Class not found
          </h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <ClassTeachingMode
      classPlan={classPlan}
      onClose={() => navigate('/')}
    />
  );
};

export default Teaching;
