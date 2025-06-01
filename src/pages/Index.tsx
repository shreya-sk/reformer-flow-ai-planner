
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useUserStats } from '@/hooks/useUserStats';
import { AuthPage } from '@/components/AuthPage';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  TrendingUp, 
  Dumbbell, 
  Clock, 
  Star, 
  Store,
  ChevronRight,
  Calendar,
  Target,
  Sparkles
} from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { classPlans, loading } = useClassPlans();
  const { preferences } = useUserPreferences();
  const { stats } = useUserStats();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      const hasCompletedOnboarding = localStorage.getItem('onboarding-completed');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user, loading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  const handlePlanClass = () => {
    navigate('/plan');
  };

  const recentClasses = classPlans.slice(0, 3);
  const weeklyProgress = Math.min((stats.totalClassesCreated * 10), 100);

  const userInitials = user?.user_metadata?.full_name
    ?.split(' ')
    ?.map((n: string) => n[0])
    ?.join('')
    ?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Enhanced Header with Profile */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-sage-800">Good morning! 👋</h1>
            <p className="text-sm text-sage-600">Ready to create something amazing?</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="rounded-full p-1 hover:bg-sage-100"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={preferences.profileImage} />
              <AvatarFallback className="bg-sage-600 text-white text-sm font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Action */}
        <Button
          onClick={handlePlanClass}
          className="w-full bg-gradient-to-r from-sage-500 via-sage-600 to-sage-700 hover:from-sage-600 hover:to-sage-800 text-white py-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          <Plus className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="text-lg font-semibold">Plan New Class</div>
            <div className="text-sm text-sage-200">Start building your next session</div>
          </div>
        </Button>

        {/* This Week Progress */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">This Week</h3>
                <p className="text-blue-100">Your progress</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{stats.totalClassesCreated}</span>
                <span className="text-blue-200">classes created</span>
              </div>
              <Progress value={weeklyProgress} className="h-2 bg-blue-400" />
              <p className="text-sm text-blue-100">Keep up the great work! 🎉</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-sage-700 mb-1">{stats.totalClassesCreated}</div>
              <div className="text-xs text-sage-600">Classes</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-sage-700 mb-1">{stats.totalExercisesUsed}</div>
              <div className="text-xs text-sage-600">Exercises</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg rounded-2xl border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-sage-700 mb-1">{Math.round(stats.totalClassesCreated * 45 / 60)}h</div>
              <div className="text-xs text-sage-600">Content</div>
            </CardContent>
          </Card>
        </div>

        {/* What's New in Store */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <Store className="h-5 w-5 text-sage-600" />
              What's New in Store
              <Badge className="bg-red-500 text-white ml-auto">New</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sage-50 to-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sage-800">Advanced Core Series</div>
                  <div className="text-sm text-sage-600">12 new challenging exercises</div>
                </div>
                <ChevronRight className="h-4 w-4 text-sage-400" />
              </div>
              <Button
                onClick={() => navigate('/store')}
                variant="outline"
                className="w-full border-sage-200 text-sage-700 hover:bg-sage-50 rounded-xl"
              >
                Explore Store
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Class Plans */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-sage-600" />
              Recent Classes
              {recentClasses.length > 0 && (
                <Badge variant="outline" className="text-sage-600 ml-auto">
                  {recentClasses.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentClasses.length > 0 ? (
              <div className="space-y-3">
                {recentClasses.map((classPlan) => (
                  <div
                    key={classPlan.id}
                    onClick={() => navigate('/plan', { state: { loadedClass: classPlan } })}
                    className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl cursor-pointer hover:bg-sage-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-sage-500 to-sage-600 rounded-xl flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sage-800">{classPlan.name}</div>
                      <div className="text-sm text-sage-600">
                        {classPlan.exercises.filter(ex => ex.category !== 'callout').length} exercises • {classPlan.totalDuration}min
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-sage-400" />
                  </div>
                ))}
                <Button
                  onClick={() => navigate('/plan')}
                  variant="outline"
                  className="w-full border-sage-200 text-sage-700 hover:bg-sage-50 rounded-xl mt-3"
                >
                  View All Classes
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-sage-400" />
                <p className="text-sage-600 mb-4">No classes yet</p>
                <Button
                  onClick={handlePlanClass}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  Create Your First Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sage-600" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="text-xl font-bold text-green-700 mb-1">{stats.customExerciseCount}</div>
                <div className="text-xs text-green-600">Custom Exercises</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-xl font-bold text-purple-700 mb-1">95%</div>
                <div className="text-xs text-purple-600">Success Rate</div>
              </div>
            </div>
            <Button
              onClick={() => navigate('/statistics')}
              variant="outline"
              className="w-full border-sage-200 text-sage-700 hover:bg-sage-50 rounded-xl mt-4"
            >
              View Detailed Stats
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation onPlanClass={handlePlanClass} />
    </div>
  );
};

export default Index;
