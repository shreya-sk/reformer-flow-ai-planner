
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Users, Clock, Play, ArrowRight, Store, Plus, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
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
  const recentPlans = classPlans ? classPlans.slice(0, 5) : [];

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
      
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white via-70% to-sage-100 pb-24 overflow-hidden relative">
        {/* Enhanced Background with Subtle Elements */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-sage-200 to-sage-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-sage-100 to-sage-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-sage-200 to-sage-300 rounded-full blur-3xl"></div>
          {/* Additional bottom blur effect */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-sage-200/40 to-transparent blur-2xl"></div>
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

          {/* New Highlights Section */}
          <div className="px-6 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">New Highlights</h2>
                  <p className="text-sm text-gray-600">Fresh exercises from our store</p>
                </div>
                <Button 
                  onClick={() => navigate('/store')} 
                  variant="ghost" 
                  className="text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {featuredExercises.slice(0, 3).map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={reformerImages[index % reformerImages.length]}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{exercise.name}</h3>
                        {index < 2 && (
                          <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{exercise.category} • {exercise.duration}min</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                        <Heart className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Your Classes Section with Better Visibility */}
          <div className="px-6 mb-8">
            <div className="bg-gradient-to-br from-sage-50/90 to-sage-100/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-sage-200/50">
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
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {recentPlans.map((plan, index) => (
                      <Card 
                        key={plan.id} 
                        className={`flex-shrink-0 w-40 bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group overflow-hidden ${
                          index > 0 ? 'ml-[-20px]' : ''
                        }`}
                        style={{
                          zIndex: recentPlans.length - index,
                          transform: index > 0 ? `translateX(-${index * 5}px) scale(${1 - index * 0.02})` : 'none'
                        }}
                      >
                        <CardContent className="p-0">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                            <img 
                              src={classPlanCoverImage}
                              alt={plan.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="font-semibold text-white text-xs mb-2 line-clamp-2">{plan.name}</h3>
                              <div className="flex items-center gap-2 text-white/90 text-[10px] mb-2">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{plan.totalDuration || 0}min</span>
                                <span>{plan.exercises?.length || 0} ex</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <Button
                              onClick={() => navigate(`/teaching/${plan.id}`)}
                              className="w-full bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs py-1"
                            >
                              <Play className="h-2.5 w-2.5 mr-1" />
                              Teach
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
