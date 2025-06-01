
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Clock, Users, Play, ArrowLeft, Plus } from 'lucide-react';
import { useClassPlans } from '@/hooks/useClassPlans';

const ClassPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classPlans, loading } = useClassPlans();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <p className="text-sage-600">Please sign in to view your class plans.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sage-600">Loading your class plans...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 pb-24">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40 shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-sage-600 rounded-full p-2 hover:bg-sage-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <h1 className="text-xl font-semibold text-sage-800">My Class Plans</h1>
            
            <Button
              size="sm"
              onClick={() => navigate('/plan')}
              className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {classPlans.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-sage-100 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-sage-400" />
              </div>
              <h3 className="text-lg font-semibold text-sage-800 mb-2">No Class Plans Yet</h3>
              <p className="text-sage-600 text-sm mb-6">Create your first class plan to get started</p>
              <Button
                onClick={() => navigate('/plan')}
                className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Class Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {classPlans.map((plan) => (
              <Card key={plan.id} className="bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sage-800 text-lg truncate">{plan.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-sage-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{plan.totalDuration || 0}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{plan.exercises?.length || 0} exercises</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-sage-100 text-sage-700 border-0 rounded-full">
                      Mixed
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/teaching/${plan.id}`)}
                      className="flex-1 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white rounded-2xl"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Teach
                    </Button>
                    <Button
                      onClick={() => navigate('/plan', { state: { loadPlan: plan } })}
                      variant="outline"
                      size="sm"
                      className="border-sage-200 bg-white/80 text-sage-700 hover:bg-sage-50 rounded-2xl px-4"
                    >
                      Edit
                    </Button>
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
