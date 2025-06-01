import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dumbbell, Users, Clock, Play } from 'lucide-react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { NavigationButtons } from '@/components/NavigationButtons';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useStatistics } from '@/hooks/useStatistics';
import { useExercises } from '@/hooks/useExercises';
import { useClassPlans } from '@/hooks/useClassPlans';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { stats, loading: statsLoading, error: statsError } = useStatistics();
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises();
  const { classPlans, loading: classPlansLoading, error: classPlansError } = useClassPlans();

  useEffect(() => {
    if (user) {
      const onboardingCompleted = localStorage.getItem(`onboarding-completed-${user.id}`);
      setShowOnboarding(!onboardingCompleted);
    }
  }, [user]);

  const featuredExercises = exercises ? exercises.filter(ex => ex.is_featured) : [];
  const recentPlans = classPlans ? classPlans.slice(0, 3) : [];

  const handleSeeMorePlans = () => {
    navigate('/class-plans');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <p className="text-sage-600">Please sign in to access the dashboard.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (statsLoading || exercisesLoading || classPlansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sage-600">Loading dashboard...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={() => {
            if (user) {
              localStorage.setItem(`onboarding-completed-${user.id}`, 'true');
            }
            setShowOnboarding(false);
          }} 
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-sage-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          {/* Header with Profile */}
          <div className="flex items-center justify-between p-4 pt-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-sage-800 mb-2">
                Welcome back
              </h1>
              <p className="text-sage-600">
                Ready to create amazing classes?
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/profile')}
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-sage-500 to-sage-600 text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>

          {/* Quick Stats Preview */}
          <div className="px-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-sage-800">{stats.totalClasses}</div>
                    <div className="text-xs text-sage-600">Classes Created</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sage-800">{stats.totalHours}</div>
                    <div className="text-xs text-sage-600">Hours Planned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sage-800">{stats.exercisesUsed}</div>
                    <div className="text-xs text-sage-600">Exercises Used</div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/statistics')}
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3 text-sage-600 hover:bg-sage-100 rounded-2xl"
                >
                  View Full Statistics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* What's New in Store */}
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-sage-800">What's New in Store</h2>
              <Button 
                onClick={() => navigate('/store')} 
                variant="ghost" 
                size="sm"
                className="text-sage-600 hover:bg-sage-100 rounded-2xl"
              >
                See All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredExercises.slice(0, 4).map((exercise) => (
                <Card key={exercise.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                  <CardContent className="p-3">
                    <div className="aspect-square bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl mb-2 flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-sage-400" />
                    </div>
                    <h3 className="font-medium text-sage-800 text-sm leading-tight line-clamp-2">{exercise.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="text-xs bg-sage-100 text-sage-600 border-0 rounded-full">
                        {exercise.category}
                      </Badge>
                      <span className="text-xs text-sage-500">{exercise.duration}min</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Class Plans */}
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-sage-800">Recent Class Plans</h2>
              <Button 
                onClick={handleSeeMorePlans}
                variant="ghost" 
                size="sm"
                className="text-sage-600 hover:bg-sage-100 rounded-2xl"
              >
                See More
              </Button>
            </div>
            
            {recentPlans.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-sage-100 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-sage-400" />
                  </div>
                  <p className="text-sage-600 text-sm mb-4">No class plans yet</p>
                  <Button 
                    onClick={() => navigate('/plan')}
                    className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl"
                    size="sm"
                  >
                    Create Your First Class
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentPlans.map((plan) => (
                  <Card key={plan.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-sage-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sage-800 truncate">{plan.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-sage-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {plan.total_duration || 0}min
                            </span>
                            <span>{plan.exercises?.length || 0} exercises</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/teaching/${plan.id}`)}
                          size="sm"
                          className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-4"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Teach
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Options */}
          <NavigationButtons />
        </div>

        <BottomNavigation onPlanClass={() => navigate('/plan')} />
      </div>
    </>
  );
};

export default Index;
