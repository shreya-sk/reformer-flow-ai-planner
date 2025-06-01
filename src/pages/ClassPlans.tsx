
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useClassPlans } from '@/hooks/useClassPlans';
import { WalletStyleClassCards } from '@/components/WalletStyleClassCards';

const ClassPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classPlans, loading, deleteClassPlan } = useClassPlans();
  const [hiddenPlans, setHiddenPlans] = useState<Set<string>>(new Set());

  const handleTeachPlan = (plan: any) => {
    navigate(`/teaching/${plan.id}`);
  };

  const handleDuplicatePlan = (plan: any) => {
    navigate('/plan', { state: { loadPlan: plan } });
  };

  const handleHidePlan = (planId: string) => {
    setHiddenPlans(prev => new Set([...prev, planId]));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-25 to-white pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg">
            <p className="text-sage-700">Please sign in to view your class plans.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-25 to-white pb-24">
        <div className="flex items-center justify-center h-64 px-4">
          <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sage-700">Loading your class plans...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-25 to-white pb-24">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-sage-200 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-12 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-sage-700 hover:text-sage-900 hover:bg-sage-100 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-2xl font-semibold text-sage-800">Class Plans</h1>
        
        <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{visiblePlans.length}</span>
        </div>
      </div>

      <WalletStyleClassCards 
        classPlans={visiblePlans}
        onTeachPlan={handleTeachPlan}
        onDuplicatePlan={handleDuplicatePlan}
        onHidePlan={handleHidePlan}
      />

      <BottomNavigation />
    </div>
  );
};

export default ClassPlans;
