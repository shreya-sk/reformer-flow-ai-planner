
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
  Clock
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

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-sage-200'} border-b backdrop-blur-sm sticky top-0 z-40`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sage-700 to-sage-900 bg-clip-text text-transparent">
                ReformerPro
              </h1>
            </div>
            
            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <div className={`text-right ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                <p className="text-sm font-medium">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                </p>
                <p className="text-xs opacity-70">
                  {savedClasses.length} saved classes
                </p>
              </div>
              <Avatar 
                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-sage-400 transition-all"
                onClick={() => navigate('/profile')}
              >
                <AvatarImage src={preferences.profileImage} alt="Profile" />
                <AvatarFallback className="text-sm font-semibold bg-sage-100 text-sage-800">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Quick Stats - Reduced Size */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div className={`p-2 rounded-lg ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center gap-1 justify-center">
              <Target className={`h-3 w-3 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
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
              <span className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
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
              <span className={`text-lg font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {savedClasses.reduce((total, plan) => total + plan.exercises.filter(ex => ex.category !== 'callout').length, 0)}
              </span>
            </div>
            <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} text-center`}>
              Exercises
            </p>
          </div>
        </div>

        {/* Quick Actions - Reduced Size */}
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Button 
            onClick={() => navigate('/plan')}
            className="flex-1 bg-sage-600 hover:bg-sage-700 text-white py-3 text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Class
          </Button>
          
          <Button 
            onClick={() => navigate('/library')}
            variant="outline"
            className={`flex-1 py-3 text-sm ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 text-sage-700 hover:bg-sage-50'}`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Library
          </Button>
        </div>

        {/* My Classes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              My Classes
            </h2>
            {savedClasses.length > 0 && (
              <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                {savedClasses.length} class{savedClasses.length === 1 ? '' : 'es'}
              </p>
            )}
          </div>

          {savedClasses.length === 0 ? (
            <div className={`text-center py-8 px-4 ${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
              <div className={`w-12 h-12 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Plus className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-500' : 'text-sage-500'}`} />
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
