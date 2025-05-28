
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AuthPage } from '@/components/AuthPage';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { 
  Plus, 
  Play, 
  Edit, 
  Copy, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Dumbbell,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { savedClasses, deleteClassPlan, loading } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());
  const [teachingClass, setTeachingClass] = useState<ClassPlan | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const toggleExpanded = (classId: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  const handlePlayClass = (classPlan: ClassPlan) => {
    setTeachingClass(classPlan);
  };

  const handleDeleteClass = (classId: string, className: string) => {
    if (window.confirm(`Delete "${className}"? This cannot be undone.`)) {
      deleteClassPlan(classId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate stats
  const totalClasses = savedClasses.length;
  const totalExercises = savedClasses.reduce((sum, cls) => sum + cls.exercises.length, 0);
  const avgClassDuration = totalClasses > 0 
    ? Math.round(savedClasses.reduce((sum, cls) => sum + cls.totalDuration, 0) / totalClasses)
    : 0;
  const recentClassesCount = savedClasses.filter(cls => {
    const daysDiff = (Date.now() - new Date(cls.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  if (teachingClass) {
    return (
      <ClassTeachingMode 
        classPlan={teachingClass} 
        onClose={() => setTeachingClass(null)} 
      />
    );
  }

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      {/* Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-6 sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Welcome back, {user.email?.split('@')[0]}! 👋
              </h1>
              <p className={`${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'} mt-1`}>
                Ready to create something amazing today?
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/plan')}
              size="lg"
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Class
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{totalClasses}</div>
                <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium flex items-center justify-center gap-1`}>
                  <BookOpen className="h-3 w-3" />
                  Total Classes
                </div>
              </CardContent>
            </Card>

            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{recentClassesCount}</div>
                <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium flex items-center justify-center gap-1`}>
                  <TrendingUp className="h-3 w-3" />
                  This Week
                </div>
              </CardContent>
            </Card>

            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{avgClassDuration}</div>
                <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium flex items-center justify-center gap-1`}>
                  <Clock className="h-3 w-3" />
                  Avg Duration (min)
                </div>
              </CardContent>
            </Card>

            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{totalExercises}</div>
                <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium flex items-center justify-center gap-1`}>
                  <Dumbbell className="h-3 w-3" />
                  Total Exercises
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'} mb-4`}>
            My Classes ({savedClasses.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>Loading your classes...</div>
            </div>
          ) : savedClasses.length === 0 ? (
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
              <CardContent className="p-12 text-center">
                <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
                  <BookOpen className={`h-10 w-10 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-400'}`} />
                </div>
                <h3 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-700'} mb-3`}>
                  No classes yet — Let's create your first class! ✨
                </h3>
                <p className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'} text-sm mb-6 max-w-md mx-auto`}>
                  Start building amazing Pilates sessions with our exercise library and intuitive class planner.
                </p>
                <Button 
                  onClick={() => navigate('/plan')}
                  size="lg"
                  className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Class
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedClasses.map((classPlan) => (
                <Card key={classPlan.id} className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'border-sage-200 hover:border-sage-300'} hover:shadow-md transition-all`}>
                  <CardContent className="p-0">
                    <Collapsible open={expandedClasses.has(classPlan.id)}>
                      <CollapsibleTrigger
                        onClick={() => toggleExpanded(classPlan.id)}
                        className={`w-full p-4 text-left ${preferences.darkMode ? 'hover:bg-gray-700' : 'hover:bg-sage-50'} transition-colors`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedClasses.has(classPlan.id) ? (
                              <ChevronDown className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
                            ) : (
                              <ChevronRight className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
                            )}
                            <div>
                              <h4 className={`font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{classPlan.name}</h4>
                              <div className={`flex items-center gap-4 text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} mt-1`}>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(classPlan.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {classPlan.totalDuration}min
                                </span>
                                <span>{classPlan.exercises.length} exercises</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayClass(classPlan);
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className={`px-4 pb-4 border-t ${preferences.darkMode ? 'border-gray-700' : 'border-sage-100'}`}>
                          {/* Action Buttons */}
                          <div className="flex gap-2 py-3">
                            <Button
                              onClick={() => navigate('/plan', { state: { loadedClass: classPlan } })}
                              size="sm"
                              className="bg-sage-600 hover:bg-sage-700 text-white"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                const duplicated = { ...classPlan, id: '', name: `${classPlan.name} (Copy)`, createdAt: new Date() };
                                navigate('/plan', { state: { loadedClass: duplicated } });
                              }}
                              size="sm"
                              variant="outline"
                              className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Duplicate
                            </Button>
                            <Button
                              onClick={() => handleDeleteClass(classPlan.id, classPlan.name)}
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>

                          {/* Exercise Preview */}
                          <div className="space-y-2">
                            <h5 className={`font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} text-sm`}>
                              Exercises ({classPlan.exercises.length})
                            </h5>
                            <div className="grid gap-2 max-h-32 overflow-y-auto">
                              {classPlan.exercises.slice(0, 3).map((exercise, index) => (
                                <div key={exercise.id} className={`flex items-center gap-3 p-2 ${preferences.darkMode ? 'bg-gray-700' : 'bg-white'} rounded border ${preferences.darkMode ? 'border-gray-600' : 'border-sage-200'}`}>
                                  <div className={`w-6 h-6 ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-200'} rounded-full flex items-center justify-center text-xs font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'} text-sm truncate`}>{exercise.name}</div>
                                    <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                                      {exercise.duration}min • {exercise.category}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {classPlan.exercises.length > 3 && (
                                <div className={`text-center text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'} py-1`}>
                                  +{classPlan.exercises.length - 3} more exercises
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Index;
