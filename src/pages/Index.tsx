
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, Clock, Play, ArrowRight, Store, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useStatistics } from '@/hooks/useStatistics';
import { useExercises } from '@/hooks/useExercises';
import { useClassPlans } from '@/hooks/useClassPlans';
import { ProfileButton } from '@/components/ProfileButton';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [exerciseCarouselIndex, setExerciseCarouselIndex] = useState(0);
  const { stats, loading: statsLoading } = useStatistics();
  const { exercises, loading: exercisesLoading } = useExercises();
  const { classPlans, loading: classPlansLoading } = useClassPlans();

  useEffect(() => {
    if (user) {
      const onboardingCompleted = localStorage.getItem(`onboarding-completed-${user.id}`);
      setShowOnboarding(!onboardingCompleted);
    }
  }, [user]);

  // Get featured exercises for carousel
  const featuredExercises = exercises ? exercises.slice(0, 6) : [];
  const recentPlans = classPlans ? classPlans.slice(0, 3) : [];

  // Use reformer images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png'
  ];

  const classPlanCoverImage = '/lovable-uploads/f986f49e-45f2-4dd4-8758-4be41a199bfd.png';

  const nextExercise = () => {
    setExerciseCarouselIndex((prev) => 
      prev + 2 >= featuredExercises.length ? 0 : prev + 2
    );
  };

  const prevExercise = () => {
    setExerciseCarouselIndex((prev) => 
      prev - 2 < 0 ? Math.max(0, featuredExercises.length - 2) : prev - 2
    );
  };

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
        {/* Enhanced Background with Subtle Elements */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sage-200 to-sage-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-sage-100 to-sage-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-sage-200 to-sage-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          {/* Modern Header */}
          <div className="flex items-center justify-between p-6 pt-14">
            <div className="flex-1">
              <div className="mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-sage-800 via-sage-700 to-sage-600 bg-clip-text text-transparent mb-2">
                  Welcome back
                </h1>
                <p className="text-sage-600 text-base font-medium">
                  Ready to create amazing classes?
                </p>
              </div>
            </div>
            
            <ProfileButton />
          </div>

          {/* Enhanced Quick Stats */}
          <div className="px-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-xl border-0 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sage-50/80 to-sage-100/50"></div>
              <CardContent className="p-6 relative">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="group cursor-pointer" onClick={() => navigate('/statistics')}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-sage-800 to-sage-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">{stats.totalClasses}</div>
                    <div className="text-sm text-sage-600 font-semibold">Classes</div>
                  </div>
                  <div className="group cursor-pointer" onClick={() => navigate('/statistics')}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-sage-700 to-sage-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">{stats.totalHours}</div>
                    <div className="text-sm text-sage-600 font-semibold">Hours</div>
                  </div>
                  <div className="group cursor-pointer" onClick={() => navigate('/statistics')}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-sage-600 to-sage-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-1">{stats.exercisesUsed}</div>
                    <div className="text-sm text-sage-600 font-semibold">Exercises</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Store Preview with Carousel - Updated Design */}
          <div className="px-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 shadow-xl border border-white/40">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-2xl shadow-lg">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-sage-800">New Highlights</h2>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/store')} 
                  variant="ghost" 
                  className="text-sage-600 hover:bg-sage-100 rounded-2xl group"
                >
                  <span className="text-sm">Explore All</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
              
              {/* Carousel Container - Larger Images */}
              <div className="relative">
                <div className="flex gap-3 overflow-hidden">
                  {featuredExercises.slice(exerciseCarouselIndex, exerciseCarouselIndex + 2).map((exercise, index) => (
                    <Card key={exercise.id} className="flex-1 bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={reformerImages[(exerciseCarouselIndex + index) % reformerImages.length]}
                            alt={exercise.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-amber-700 to-amber-800 text-white border-0 rounded-full px-3 py-1 text-xs font-medium shadow-lg">
                              New
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-bold text-sm leading-tight mb-2">{exercise.name}</h3>
                            <div className="flex items-center gap-2 text-white/90 text-xs">
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
                
                {/* Carousel Controls */}
                {featuredExercises.length > 2 && (
                  <>
                    <Button
                      onClick={prevExercise}
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg w-8 h-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={nextExercise}
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg w-8 h-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Recent Class Plans */}
          <div className="px-6 mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-sage-800">Your Classes</h2>
                  <p className="text-sage-600 text-sm">Recently created class plans</p>
                </div>
                <Button 
                  onClick={() => navigate('/class-plans')}
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
                    <div className="p-4 bg-gradient-to-r from-sage-100 to-sage-200 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-sage-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-sage-800 mb-2">Start Your Journey</h3>
                    <p className="text-sage-600 mb-6">Create your first class plan</p>
                    <Button 
                      onClick={() => navigate('/plan')}
                      className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Class
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {recentPlans.map((plan, index) => (
                    <Card key={plan.id} className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center">
                          <div className="relative w-24 h-24 overflow-hidden rounded-l-2xl">
                            <img 
                              src={classPlanCoverImage}
                              alt={plan.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <h3 className="font-semibold text-sage-800 text-base mb-1">{plan.name}</h3>
                            <div className="flex items-center gap-3 text-sage-600 text-sm mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {plan.totalDuration || 0}min
                              </span>
                              <span>{plan.exercises?.length || 0} exercises</span>
                            </div>
                            <Button
                              onClick={() => navigate(`/teaching/${plan.id}`)}
                              size="sm"
                              className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <Play className="h-3 w-3 mr-2" />
                              Teach
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <BottomNavigation onPlanClass={() => navigate('/plan')} />
      </div>
    </>
  );
};

export default Index;
