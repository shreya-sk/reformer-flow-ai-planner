
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ClassPlanList } from '@/components/ClassPlanList';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { AuthPage } from '@/components/AuthPage';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, BookOpen, Clock, Users, Target, Sparkles } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { savedClasses, loading } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [teachingClass, setTeachingClass] = useState<ClassPlan | null>(null);

  const handleCreateNewClass = () => {
    navigate('/plan');
  };

  const handleTeachClass = (classPlan: ClassPlan) => {
    setTeachingClass(classPlan);
  };

  const handleCloseTeaching = () => {
    setTeachingClass(null);
  };

  if (!user) {
    return <AuthPage />;
  }

  if (teachingClass) {
    return (
      <ClassTeachingMode 
        classPlan={teachingClass} 
        onClose={handleCloseTeaching} 
      />
    );
  }

  const stats = {
    totalClasses: savedClasses.length,
    totalMinutes: savedClasses.reduce((sum, c) => sum + c.totalDuration, 0),
    avgDuration: savedClasses.length > 0 ? Math.round(savedClasses.reduce((sum, c) => sum + c.totalDuration, 0) / savedClasses.length) : 0
  };

  return (
    <div className={`min-h-screen pb-20 ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      {/* Hero Section */}
      <div className={`${preferences.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${preferences.darkMode ? 'border-gray-700' : 'border-sage-100'}`}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-sage-500 to-sage-600 p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className={`text-4xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Reformer Studio
              </h1>
            </div>
            <p className={`text-xl ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'} mb-6 max-w-2xl mx-auto`}>
              Create, organize, and teach beautiful Pilates Reformer classes with intelligent exercise suggestions and seamless class flow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleCreateNewClass}
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Class
              </Button>
              <Button 
                onClick={() => navigate('/library')}
                variant="outline"
                size="lg"
                className={`px-8 py-3 text-lg ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-sage-300 text-sage-700 hover:bg-sage-50'}`}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Library
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'} shadow-sm`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${preferences.darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Users className={`h-6 w-6 ${preferences.darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  {stats.totalClasses}
                </div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  Saved Classes
                </div>
              </CardContent>
            </Card>

            <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'} shadow-sm`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${preferences.darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                  <Clock className={`h-6 w-6 ${preferences.darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  {stats.totalMinutes}
                </div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  Total Minutes
                </div>
              </CardContent>
            </Card>

            <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-sage-200'} shadow-sm`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${preferences.darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Target className={`h-6 w-6 ${preferences.darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  {stats.avgDuration}
                </div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  Avg Duration
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent Classes Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${preferences.darkMode ? 'border-white' : 'border-sage-600'}`}></div>
            <p className={`mt-4 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>Loading your classes...</p>
          </div>
        ) : savedClasses.length === 0 ? (
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardContent className="p-12 text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'}`}>
                <BookOpen className={`h-8 w-8 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Welcome to Reformer Studio!
              </h3>
              <p className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} mb-6 max-w-md mx-auto`}>
                Start creating your first class plan to organize and teach amazing Pilates Reformer sessions.
              </p>
              <Button 
                onClick={handleCreateNewClass}
                className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Your Class Library
              </h2>
              <Badge className={`${preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}`}>
                {savedClasses.length} {savedClasses.length === 1 ? 'class' : 'classes'}
              </Badge>
            </div>
            <ClassPlanList onTeachClass={handleTeachClass} />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation onPlanClass={handleCreateNewClass} />
    </div>
  );
};

export default Index;
