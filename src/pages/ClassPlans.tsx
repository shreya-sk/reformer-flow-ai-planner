
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Clock, Play, MoreHorizontal, Copy, EyeOff, ArrowLeft } from 'lucide-react';
import { useClassPlans } from '@/hooks/useClassPlans';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ClassPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classPlans, loading, deleteClassPlan } = useClassPlans();
  const [hiddenPlans, setHiddenPlans] = useState<Set<string>>(new Set());

  // Meditation app color palette for cards
  const cardColors = [
    'bg-gradient-to-br from-blue-200 to-blue-300',
    'bg-gradient-to-br from-yellow-200 to-orange-200',
    'bg-gradient-to-br from-purple-200 to-purple-300',
    'bg-gradient-to-br from-green-200 to-green-300',
    'bg-gradient-to-br from-pink-200 to-pink-300',
    'bg-gradient-to-br from-indigo-200 to-indigo-300',
  ];

  // Use reformer images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png'
  ];

  const handleTeachPlan = (plan: any) => {
    navigate(`/teaching/${plan.id}`);
  };

  const handleDuplicatePlan = (plan: any) => {
    navigate('/plan', { state: { loadPlan: plan } });
  };

  const handleHidePlan = (planId: string) => {
    setHiddenPlans(prev => new Set([...prev, planId]));
  };

  const getRandomImage = (classId: string) => {
    const index = classId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % reformerImages.length;
    return reformerImages[index];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-900 via-gray-900 to-black pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg">
            <p className="text-white/70">Please sign in to view your class plans.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-900 via-gray-900 to-black pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">Loading your class plans...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Filter out hidden plans and sort by most recent
  const visiblePlans = classPlans
    .filter(plan => !hiddenPlans.has(plan.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-900 via-gray-900 to-black pb-24 text-white">
      {/* Header - matching meditation app style */}
      <div className="flex items-center justify-between p-4 pt-12 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-2xl font-semibold text-white">Class Plans</h1>
        
        <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{visiblePlans.length}</span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {visiblePlans.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-0 rounded-3xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-sage-600/20 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-sage-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Class Plans Yet</h3>
              <p className="text-white/60 text-sm mb-6">Create your first class plan to get started</p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-6"
              >
                Create Class Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {visiblePlans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`${cardColors[index % cardColors.length]} border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative`}
              >
                <CardContent className="p-0 relative h-48">
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <img 
                      src={plan.image || getRandomImage(plan.id)}
                      alt={plan.name}
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    {/* Top - Plan Type Badge */}
                    <div className="flex justify-between items-start">
                      <Badge className="bg-white/20 text-gray-800 border-0 rounded-full px-3 py-1 text-sm backdrop-blur-sm">
                        Reformer
                      </Badge>
                      
                      {/* Options Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-800 hover:bg-white/20 rounded-full w-8 h-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
                          <DropdownMenuItem 
                            onClick={() => handleDuplicatePlan(plan)}
                            className="text-gray-700 hover:bg-sage-100 rounded-xl m-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate & Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleHidePlan(plan.id)}
                            className="text-gray-700 hover:bg-red-100 rounded-xl m-1"
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Bottom - Plan Info */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {plan.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-700 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{plan.totalDuration || 0}min</span>
                          </div>
                          <span>{plan.exercises?.filter(ex => ex.category !== 'callout').length || 0} exercises</span>
                        </div>
                        
                        {/* Play Button - floating style */}
                        <Button
                          onClick={() => handleTeachPlan(plan)}
                          className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 p-0"
                        >
                          <Play className="h-5 w-5 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ClassPlans;
