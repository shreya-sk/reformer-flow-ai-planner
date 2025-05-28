
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthPage } from '@/components/AuthPage';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Header } from '@/components/Header';
import { 
  Plus, 
  Clock, 
  Calendar, 
  BookOpen, 
  Users, 
  Zap,
  Play,
  Edit2,
  Trash2,
  Copy
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { savedClasses, deleteClassPlan } = useClassPlans();
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteClass = (classId: string, className: string) => {
    if (window.confirm(`Delete "${className}"? This cannot be undone.`)) {
      deleteClassPlan(classId);
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Compact Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-sage-200'} backdrop-blur-sm border-b sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                ReformerPro
              </h1>
              <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                AI-Powered Class Planning
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/library')}
                variant="outline"
                size="sm"
                className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-700'}`}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Library
              </Button>
              <Button
                onClick={() => navigate('/plan')}
                size="sm"
                className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Class
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Welcome Section with Color */}
        <div className={`${preferences.darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-sage-100 via-sage-50 to-white'} rounded-xl p-6 border ${preferences.darkMode ? 'border-gray-600' : 'border-sage-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Instructor'}! 
              </h2>
              <p className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'} mb-4`}>
                Ready to create inspiring Pilates classes?
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                  <span className={preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}>{savedClasses.length} saved classes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className={`h-4 w-4 ${preferences.darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  <span className={preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}>AI-powered suggestions</span>
                </div>
              </div>
            </div>
            <div className={`hidden md:block w-24 h-24 ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-200'} rounded-full flex items-center justify-center`}>
              <Users className={`h-12 w-12 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-sage-200 hover:shadow-md'} cursor-pointer transition-all`} onClick={() => navigate('/plan')}>
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Plus className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Plan New Class</h3>
              <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>Create with AI suggestions</p>
            </CardContent>
          </Card>

          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-sage-200 hover:shadow-md'} cursor-pointer transition-all`} onClick={() => navigate('/library')}>
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <BookOpen className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Exercise Library</h3>
              <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>Browse 200+ exercises</p>
            </CardContent>
          </Card>

          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-sage-200 hover:shadow-md'} cursor-pointer transition-all`} onClick={() => navigate('/timer')}>
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Clock className={`h-6 w-6 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Class Timer</h3>
              <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>Time your sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Saved Classes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              My Classes
            </h2>
            {savedClasses.length > 0 && (
              <Badge variant="secondary" className={preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}>
                {savedClasses.length} classes
              </Badge>
            )}
          </div>

          {savedClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedClasses.map((classPlan) => (
                <Card key={classPlan.id} className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} hover:shadow-md transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className={`text-base ${preferences.darkMode ? 'text-white' : 'text-sage-800'} truncate`}>
                          {classPlan.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={`flex items-center gap-1 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                            <Calendar className="h-3 w-3" />
                            {formatDate(classPlan.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`flex items-center gap-1 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                          <Clock className="h-3 w-3" />
                          {classPlan.totalDuration}min
                        </span>
                        <span className={preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}>
                          {classPlan.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate('/plan', { state: { loadedClass: classPlan } })}
                        size="sm"
                        className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Load
                      </Button>
                      <Button
                        onClick={() => navigate('/plan', { state: { loadedClass: { ...classPlan, id: '', name: `${classPlan.name} (Copy)` } } })}
                        size="sm"
                        variant="outline"
                        className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300 text-sage-700'}`}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClass(classPlan.id, classPlan.name)}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} text-center py-12`}>
              <CardContent>
                <div className={`w-16 h-16 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Calendar className={`h-8 w-8 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
                </div>
                <h3 className={`text-lg font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-600'} mb-2`}>No classes yet</h3>
                <p className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'} text-sm mb-4`}>
                  Start building your first class to see it here
                </p>
                <Button 
                  onClick={() => navigate('/plan')}
                  className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Your First Class
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Index;
