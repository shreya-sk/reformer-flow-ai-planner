
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { AuthPage } from '@/components/AuthPage';
import { Header } from '@/components/Header';
import { ClassPlanList } from '@/components/ClassPlanList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { ClassPlan } from '@/types/reformer';

const Index = () => {
  const { user, loading } = useAuth();
  const { savedClasses, deleteClassPlan, updateClassPlan } = useClassPlans();
  const navigate = useNavigate();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  const loadClass = (classPlan: ClassPlan) => {
    // Navigate to plan class page with the loaded class
    navigate('/plan', { state: { loadedClass: classPlan } });
  };

  const handlePlanClass = () => {
    navigate('/plan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200 px-6 py-5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sage-700 to-sage-900 bg-clip-text text-transparent">
                My Classes
              </h1>
              <p className="text-sage-600 text-sm">
                {savedClasses.length} saved class{savedClasses.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          
          <div className="text-sage-600">
            Welcome back, {user.email?.split('@')[0]}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        <ClassPlanList
          savedClasses={savedClasses}
          onDeleteClass={deleteClassPlan}
          onLoadClass={loadClass}
          onUpdateClass={updateClassPlan}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation onPlanClass={handlePlanClass} />
    </div>
  );
};

export default Index;
