
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
      {/* Organic Flowing Header */}
      <header className="relative overflow-hidden h-28">
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

        <div className="relative px-6 py-3 flex items-center h-full">
          <div className="flex items-center space-x-4 ml-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-sage-50 tracking-wide">Welcome back,</h1>
              <p className="text-lg font-medium text-sage-100">{getFirstName()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Profile Picture - Overlapping */}
      <div className="relative -mt-12 flex justify-center mb-4 z-10">
        <div className="relative group">
          <Avatar className="h-24 w-24 cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-2 border-4 border-white shadow-2xl relative z-10 bg-white" onClick={() => navigate('/profile')}>
            <AvatarImage src={preferences.profileImage} alt="Profile" className="rounded-full" />
            <AvatarFallback className="font-bold bg-gradient-to-br from-sage-400 to-sage-600 rounded-full text-2xl text-sage-200">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-gradient-to-br from-sage-300/20 to-sage-500/20 rounded-full blur-xl scale-125 group-hover:scale-150 transition-all duration-500 -z-10"></div>
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
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

      <div className="p-4 space-y-4 pb-24">
        {/* Compact Stats Cards */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div className={`p-2 rounded-xl ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
            <div className="flex items-center gap-1 justify-center">
              <Target className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.length}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center mt-0.5`}>
              Classes
            </p>
          </div>
          
          <div className={`p-2 rounded-xl ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
            <div className="flex items-center gap-1 justify-center">
              <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.reduce((total, plan) => total + plan.totalDuration, 0)}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center mt-0.5`}>
              Minutes
            </p>
          </div>
          
          <div className={`p-2 rounded-xl ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
            <div className="flex items-center gap-1 justify-center">
              <BookOpen className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.reduce((total, plan) => total + plan.exercises.filter(ex => ex.category !== 'callout').length, 0)}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center mt-0.5`}>
              Exercises
            </p>
          </div>
        </div>

        {/* My Classes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className={`text-lg font-light ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              My Classes
            </h2>
            {savedClasses.length > 0 && (
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} bg-sage-100 dark:bg-gray-700 px-3 py-1 rounded-full`}>
                {savedClasses.length} class{savedClasses.length === 1 ? '' : 'es'}
              </p>
            )}
          </div>

          {savedClasses.length === 0 ? (
            <div className={`text-center py-6 px-4 ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
              <div className={`w-10 h-10 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Plus className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-500' : 'text-sage-500'}`} />
              </div>
              <h3 className={`text-base font-light mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                No classes yet
              </h3>
              <p className={`text-sm mb-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                Create your first class plan to get started
              </p>
              <Button onClick={() => navigate('/plan')} className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-full px-5 py-2 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            </div>
          ) : (
            <ClassPlanList classes={savedClasses} onEditClass={handleEditClass} onDeleteClass={handleDeleteClass} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
