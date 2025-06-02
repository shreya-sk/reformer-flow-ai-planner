import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ProfileButton } from '@/components/ProfileButton';
import { AuthPage } from '@/components/AuthPage';
import { FloatingMenu } from '@/components/FloatingMenu';
import { VerticalClassCards } from '@/components/VerticalClassCards';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Zap, Star, TrendingUp, ChevronRight, Clock, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classPlans, loading } = useClassPlans();
  const { preferences } = useUserPreferences();
  const [teachingPlan, setTeachingPlan] = useState(null);

  if (!user) {
    return <AuthPage />;
  }

  if (teachingPlan) {
    return (
      <ClassTeachingMode 
        classPlan={teachingPlan}
        onClose={() => setTeachingPlan(null)}
      />
    );
  }

  const handleTeachPlan = (plan: any) => {
    console.log('Starting teaching mode for plan:', plan.name);
    setTeachingPlan(plan);
  };

  const handleDuplicatePlan = (plan: any) => {
    console.log('Duplicating plan:', plan.name);
    navigate('/plan', { state: { loadedClass: plan } });
  };

  const handleHidePlan = (planId: string) => {
    console.log('Hiding plan:', planId);
  };

  const highlights = [
    {
      id: 1,
      title: "Beginner Flow Basics",
      description: "Perfect for new clients",
      image: "/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png",
      exercises: 12,
      duration: 45,
      badge: "Popular"
    },
    {
      id: 2,
      title: "Core Power Series",
      description: "Advanced core strengthening",
      image: "/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png",
      exercises: 15,
      duration: 50,
      badge: "New"
    }
  ];

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-sage-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <AnimatedHeader />
          <ProfileButton />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* My Classes Section - Moved above highlights */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">My Classes</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/class-plans')}
              className="text-sage-600 hover:text-sage-800"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading your classes...</div>
          ) : (
            <VerticalClassCards 
              classPlans={classPlans.slice(0, 3)}
              onTeachPlan={handleTeachPlan}
              onDuplicatePlan={handleDuplicatePlan}
              onHidePlan={handleHidePlan}
            />
          )}
        </section>

        {/* New Highlights Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">New Highlights</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/store')}
              className="text-sage-600 hover:text-sage-800"
            >
              View Store <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((highlight) => (
              <Card key={highlight.id} className="bg-white/90 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={highlight.image} 
                    alt={highlight.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${
                      highlight.badge === 'New' ? 'bg-green-500' : 'bg-blue-500'
                    } text-white border-0 rounded-full px-3 py-1 text-xs backdrop-blur-sm`}>
                      {highlight.badge}
                    </Badge>
                  </div>

                  {/* Play Button */}
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="icon"
                      className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      <Play className="h-4 w-4 ml-0.5" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{highlight.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{highlight.duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{highlight.exercises} exercises</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-gradient-to-br from-sage-500 to-sage-600 text-white border-0 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/plan')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Plan Class</h3>
                <p className="text-xs text-white/80">Create a new class</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/library')}
            >
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Library</h3>
                <p className="text-xs text-white/80">Browse exercises</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <FloatingMenu isOpen={false} onClose={() => {}} />
      <BottomNavigation />
    </div>
  );
};

export default Index;
