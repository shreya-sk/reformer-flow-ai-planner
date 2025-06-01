
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, Clock, Play, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useStatistics } from '@/hooks/useStatistics';
import { useExercises } from '@/hooks/useExercises';
import { useClassPlans } from '@/hooks/useClassPlans';

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

  // Get featured exercises with images - reduced to 2
  const featuredExercises = exercises ? exercises.slice(0, 2) : [];
  const recentPlans = classPlans ? classPlans.slice(0, 3) : [];

  // Use your uploaded reformer/pilates images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png'
  ];

  const classPlanCoverImage = '/lovable-uploads/f986f49e-45f2-4dd4-8758-4be41a199bfd.png';

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
            <p className="text-sage-600 text-sm">Please sign in to access the dashboard.</p>
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
          <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
            <div className="animate-spin w-6 h-6 border-3 border-sage-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sage-600 text-sm">Loading dashboard...</p>
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sage-300 to-sage-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-sage-200 to-sage-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-sage-300 to-sage-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative">
          {/* Enhanced Header with Floating Profile */}
          <div className="flex items-center justify-between p-4 pt-12">
            <div className="flex-1">
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent mb-1">
                  Welcome back
                </h1>
                <p className="text-sage-600 text-sm sm:text-base">
                  Ready to create amazing classes?
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/profile')}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 p-0 group"
            >
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarFallback className="bg-gradient-to-r from-sage-500 to-sage-600 text-white text-sm sm:text-lg">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </Button>
          </div>

          {/* Enhanced Quick Stats with Sage Colors */}
          <div className="px-4 mb-6">
            <Card className="bg-white/95 backdrop-blur-xl border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-sage-50 to-sage-100 opacity-60"></div>
              <CardContent className="p-4 sm:p-6 relative">
                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                  <div className="group">
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stats.totalClasses}</div>
                    <div className="text-xs sm:text-sm text-sage-600 font-medium">Classes</div>
                  </div>
                  <div className="group">
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sage-700 to-sage-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stats.totalHours}</div>
                    <div className="text-xs sm:text-sm text-sage-600 font-medium">Hours</div>
                  </div>
                  <div className="group">
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sage-600 to-sage-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stats.exercisesUsed}</div>
                    <div className="text-xs sm:text-sm text-sage-600 font-medium">Exercises</div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/statistics')}
                  variant="ghost" 
                  className="w-full mt-3 text-sage-600 hover:bg-sage-100 rounded-2xl group transition-all duration-300 text-xs sm:text-sm"
                >
                  <span>View Statistics</span>
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Store Preview with Better Separation */}
          <div className="px-4 mb-8">
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-sage-800">Discover Exercises</h2>
                </div>
                <Button 
                  onClick={() => navigate('/store')} 
                  variant="ghost" 
                  className="text-sage-600 hover:bg-sage-100 rounded-xl sm:rounded-2xl group text-xs sm:text-sm"
                >
                  <span>Explore</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {featuredExercises.slice(0, 2).map((exercise, index) => (
                  <Card key={exercise.id} className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={reformerImages[index % reformerImages.length]}
                          alt={exercise.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 rounded-full px-2 sm:px-3 py-1 text-xs font-medium">
                            New
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                          <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1">{exercise.name}</h3>
                          <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm">
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
          </div>

          {/* Enhanced Recent Class Plans - Carousel Style */}
          <div className="px-4 mb-8">
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-sage-800">Your Classes</h2>
                <Button 
                  onClick={() => navigate('/class-plans')}
                  variant="ghost" 
                  className="text-sage-600 hover:bg-sage-100 rounded-xl sm:rounded-2xl group text-xs sm:text-sm"
                >
                  <span>See All</span>
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
              
              {recentPlans.length === 0 ? (
                <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl shadow-xl">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-sage-100 to-sage-200 rounded-2xl sm:rounded-3xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 text-sage-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-sage-800 mb-2">Start Your Journey</h3>
                    <p className="text-sage-600 mb-4 sm:mb-6 text-sm sm:text-base">Create your first class plan</p>
                    <Button 
                      onClick={() => navigate('/plan')}
                      className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Create Class
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {recentPlans.map((plan, index) => (
                    <Card key={plan.id} className="flex-shrink-0 w-64 sm:w-72 bg-white/90 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-32 sm:h-40 overflow-hidden">
                          <img 
                            src={classPlanCoverImage}
                            alt={plan.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate mb-1">{plan.name}</h3>
                            <div className="flex items-center gap-3 text-white/90 text-xs sm:text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {plan.totalDuration || 0}min
                              </span>
                              <span>{plan.exercises?.length || 0} exercises</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <Button
                            onClick={() => navigate(`/teaching/${plan.id}`)}
                            className="w-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-xl sm:rounded-2xl py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                          >
                            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Teach
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Floating Button */}
          <div className="fixed bottom-28 sm:bottom-32 right-4 sm:right-6 z-20">
            <Button
              onClick={() => navigate('/plan')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>
          </div>
        </div>

        <BottomNavigation onPlanClass={() => navigate('/plan')} />
      </div>
    </>
  );
};

export default Index;
