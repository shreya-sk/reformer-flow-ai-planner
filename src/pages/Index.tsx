
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, Clock, Play, ArrowRight, Sparkles } from 'lucide-react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useStatistics } from '@/hooks/useStatistics';
import { useExercises } from '@/hooks/useExercises';
import { useClassPlans } from '@/hooks/useClassPlans';
import { Dumbbell, Users, Clock, Play, ArrowRight, Sparkles, Plus } from 'lucide-react';
const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { stats, loading: statsLoading } = useStatistics();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { classPlans, loading: classPlansLoading } = useClassPlans();

  useEffect(() => {
    if (user) {
      const onboardingCompleted = localStorage.getItem(`onboarding-completed-${user.id}`);
      setShowOnboarding(!onboardingCompleted);
    }
  }, [user]);

  // Get featured exercises with images
  const featuredExercises = exercises ? exercises.slice(0, 2) : [];
  const recentPlans = classPlans ? classPlans.slice(0, 3) : [];

  const handleSeeMorePlans = () => {
    navigate('/class-plans');
  };

  // Exercise images from the library
  const exerciseImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
  ];

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
      
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24 overflow-hidden">
        {/* Enhanced Background with Floating Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sage-300 to-sage-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative">
          {/* Enhanced Header with Floating Profile */}
          <div className="flex items-center justify-between p-6 pt-12">
            <div className="flex-1">
              <div className="mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent mb-2">
                  Welcome back
                </h1>
                <p className="text-sage-600 text-lg">
                  Ready to create amazing classes?
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/profile')}
              className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 p-0 group"
            >
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-gradient-to-r from-sage-500 to-sage-600 text-white text-xl">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </Button>
          </div>

          {/* Enhanced Quick Stats with Floating Cards */}
          <div className="px-6 mb-8">
            <Card className="bg-white/90 backdrop-blur-xl border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-sage-50 to-blue-50 opacity-50"></div>
              <CardContent className="p-6 relative">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="group">
                    <div className="text-3xl font-bold bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stats.totalClasses}</div>
                    <div className="text-sm text-sage-600 font-medium">Classes Created</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stats.totalHours}</div>
                    <div className="text-sm text-sage-600 font-medium">Hours Planned</div>
                  </div>
                  <div className="group">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stats.exercisesUsed}</div>
                    <div className="text-sm text-sage-600 font-medium">Exercises Used</div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/statistics')}
                  variant="ghost" 
                  className="w-full mt-4 text-sage-600 hover:bg-sage-100 rounded-2xl group transition-all duration-300"
                >
                  <span>View Full Statistics</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Store Preview with Big Images */}
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-sage-800">Discover New Exercises</h2>
              </div>
              <Button 
                onClick={() => navigate('/store')} 
                variant="ghost" 
                className="text-sage-600 hover:bg-sage-100 rounded-2xl group"
              >
                <span>Explore Store</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {featuredExercises.slice(0, 2).map((exercise, index) => (
                <Card key={exercise.id} className="bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={`${exerciseImages[index % exerciseImages.length]}?w=400&h=300&fit=crop`}
                        alt={exercise.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 rounded-full px-3 py-1 text-xs font-medium">
                          New
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-lg leading-tight mb-1">{exercise.name}</h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{exercise.duration}min</span>
                          </div>
                          <Badge className="bg-white/20 text-white border-0 rounded-full px-2 py-0.5 text-xs backdrop-blur-sm">
                            {exercise.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Recent Class Plans */}
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-sage-800">Your Recent Classes</h2>
              <Button 
                onClick={handleSeeMorePlans}
                variant="ghost" 
                className="text-sage-600 hover:bg-sage-100 rounded-2xl group"
              >
                <span>See All</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            
            {recentPlans.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="p-4 bg-gradient-to-r from-sage-100 to-blue-100 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-sage-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-sage-800 mb-2">Start Your Journey</h3>
                  <p className="text-sage-600 mb-6">Create your first class plan and begin teaching</p>
                  <Button 
                    onClick={() => navigate('/plan')}
                    className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Class
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentPlans.map((plan) => (
                  <Card key={plan.id} className="bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-blue-100 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-8 w-8 text-sage-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sage-800 text-lg truncate">{plan.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-sage-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {plan.totalDuration || 0}min
                            </span>
                            <span>{plan.exercises?.length || 0} exercises</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/teaching/${plan.id}`)}
                          className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Teach
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Floating Button */}
          <div className="fixed bottom-32 right-6 z-20">
            <Button
              onClick={() => navigate('/plan')}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </div>
        </div>

        <BottomNavigation onPlanClass={() => navigate('/plan')} />
      </div>
    </>
  );
};

export default Index;
