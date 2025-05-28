
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassPlanList } from '@/components/ClassPlanList';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, BookOpen, Sparkles, Target, Clock, Timer, Home } from 'lucide-react';
import { AuthPage } from '@/components/AuthPage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { savedClasses, deleteClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className={preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleEditClass = (classPlan: any) => {
    navigate('/plan', { state: { loadedClass: classPlan } });
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await deleteClassPlan(classId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete class plan",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      {/* Header with Profile Picture */}
      <header className="relative overflow-hidden h-32">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-500 via-sage-600 to-sage-700"></div>
        
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,160 C240,100 480,220 720,180 C960,140 1200,240 1440,200 L1440,320 L0,320 Z" fill="rgba(255,255,255,0.15)" />
          </svg>
          <svg className="absolute bottom-0 w-full h-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,240 C360,160 600,280 840,220 C1080,160 1320,260 1440,210 L1440,320 L0,320 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,280 C180,240 420,300 660,260 C900,220 1260,300 1440,280 L1440,320 L0,320 Z" fill="rgba(255,255,255,0.08)" />
          </svg>
        </div>

        <div className="relative px-6 py-6 flex flex-col items-center justify-center h-full">
          <Avatar className="w-16 h-16 mb-3 ring-4 ring-white/20 shadow-xl">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-sage-50 tracking-wide">Welcome back,</h1>
          <p className="text-lg font-medium text-sage-100">{getFirstName()}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Smaller Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} rounded-xl p-3 border shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    {savedClasses.length}
                  </p>
                  <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Saved Classes
                  </p>
                </div>
                <BookOpen className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
              </div>
            </div>

            <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} rounded-xl p-3 border shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    {savedClasses.reduce((total, plan) => total + plan.exercises.filter(ex => ex.category !== 'callout').length, 0)}
                  </p>
                  <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Total Exercises
                  </p>
                </div>
                <Target className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
              </div>
            </div>

            <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} rounded-xl p-3 border shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    {Math.round(savedClasses.reduce((total, plan) => total + plan.totalDuration, 0) / savedClasses.length) || 0}
                  </p>
                  <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Avg. Duration
                  </p>
                </div>
                <Clock className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
              </div>
            </div>

            <Button
              onClick={() => navigate('/plan')}
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl h-full flex flex-col items-center justify-center gap-1 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">New Class</span>
            </Button>
          </div>

          {/* Class Plans Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Your Class Plans
              </h2>
              {savedClasses.length > 0 && (
                <Button
                  onClick={() => navigate('/plan')}
                  className="bg-sage-600 hover:bg-sage-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              )}
            </div>

            {savedClasses.length === 0 ? (
              <div className="text-center py-12">
                <div className={`rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 ${
                  preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'
                }`}>
                  <BookOpen className={`h-12 w-12 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
                </div>
                
                <h3 className={`text-2xl font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  No class plans yet
                </h3>
                
                <p className={`text-center mb-6 max-w-md mx-auto ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  Create your first class plan to get started with organizing your Pilates sessions.
                </p>
                
                <Button 
                  onClick={() => navigate('/plan')}
                  className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Class
                </Button>
              </div>
            ) : (
              <ClassPlanList
                classes={savedClasses}
                onEditClass={handleEditClass}
                onDeleteClass={handleDeleteClass}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sage-600 via-sage-500 to-sage-600"></div>
          <svg className="absolute top-0 w-full h-4" viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,60 C360,20 600,50 840,30 C1080,10 1320,40 1440,25 L1440,0 L0,0 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
          
          <div className="relative flex items-center justify-around px-6 py-3 max-w-lg mx-auto">
            <Button onClick={() => navigate('/')} variant="ghost" className="flex flex-col items-center text-white hover:text-sage-200 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 p-2">
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Button>
            
            <Button onClick={() => navigate('/library')} variant="ghost" className="flex flex-col items-center text-white hover:text-sage-200 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 p-2">
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Library</span>
            </Button>
            
            <Button onClick={() => navigate('/plan')} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12">
              <Plus className="h-7 w-7" />
            </Button>
            
            <Button onClick={() => navigate('/timer')} variant="ghost" className="flex flex-col items-center text-white hover:text-sage-200 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 p-2">
              <Timer className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Timer</span>
            </Button>
            
            <Button onClick={() => navigate('/profile')} variant="ghost" className="flex flex-col items-center text-white hover:text-sage-200 hover:bg-white/20 rounded-2xl transition-all duration-300 transform hover:scale-110 p-2">
              <div className="w-5 h-5 rounded-full bg-white/30 mb-1 flex items-center justify-center">
                <span className="text-xs font-bold">{getUserInitials()[0]}</span>
              </div>
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
