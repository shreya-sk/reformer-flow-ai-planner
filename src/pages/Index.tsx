
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassPlanList } from '@/components/ClassPlanList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { NavigationButtons } from '@/components/NavigationButtons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  BookOpen, 
  Sparkles, 
  User,
  Calendar,
  Target,
  Clock,
  Settings
} from 'lucide-react';
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
        variant: "destructive",
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
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Main Header Banner */}
      <header className="bg-gradient-to-r from-sage-600 to-sage-700 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Welcome Message & Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Hi <span className="text-sage-100">{getFirstName()}</span>!
                </h1>
                <p className="text-sage-100 text-sm opacity-90">Welcome back to ReformerPro</p>
              </div>
            </div>
            
            {/* Navigation & Profile */}
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate('/plan')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate('/library')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Library
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate('/timer')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Timer
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </nav>
              
              {/* Profile Avatar */}
              <div className="flex items-center space-x-3">
                <div className="text-right text-white hidden sm:block">
                  <p className="text-sm font-medium opacity-90">
                    {savedClasses.length} saved classes
                  </p>
                </div>
                <Avatar 
                  className="h-12 w-12 cursor-pointer hover:ring-4 hover:ring-white/30 transition-all border-2 border-white/20"
                  onClick={() => navigate('/profile')}
                >
                  <AvatarImage src={preferences.profileImage} alt="Profile" />
                  <AvatarFallback className="text-sm font-semibold bg-sage-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Quick Stats - Smaller */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div className={`p-2 rounded-lg ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center gap-1 justify-center">
              <Target className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.length}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center`}>
              Classes
            </p>
          </div>
          
          <div className={`p-2 rounded-lg ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center gap-1 justify-center">
              <Clock className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.reduce((total, plan) => total + plan.totalDuration, 0)}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center`}>
              Minutes
            </p>
          </div>
          
          <div className={`p-2 rounded-lg ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center gap-1 justify-center">
              <BookOpen className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.reduce((total, plan) => total + plan.exercises.filter(ex => ex.category !== 'callout').length, 0)}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center`}>
              Exercises
            </p>
          </div>
        </div>

        {/* My Classes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              My Classes
            </h2>
            {savedClasses.length > 0 && (
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                {savedClasses.length} class{savedClasses.length === 1 ? '' : 'es'}
              </p>
            )}
          </div>

          {savedClasses.length === 0 ? (
            <div className={`text-center py-6 px-4 ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
              <div className={`w-10 h-10 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Plus className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-500' : 'text-sage-500'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                No classes yet
              </h3>
              <p className={`text-sm mb-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                Create your first class plan to get started
              </p>
              <Button 
                onClick={() => navigate('/plan')}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Class
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

        {/* Navigation */}
        <NavigationButtons />
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Index;
