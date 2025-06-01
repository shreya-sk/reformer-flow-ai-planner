
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { AuthPage } from '@/components/AuthPage';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { WalletStyleClassCards } from '@/components/WalletStyleClassCards';
import { ProfileButton } from '@/components/ProfileButton';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, loading } = useAuth();
  const { classPlans, loading: classPlansLoading } = useClassPlans();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (loading || classPlansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-white to-sage-100">
        <div className="animate-pulse text-sage-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleTeachPlan = (plan: any) => {
    navigate(`/teaching/${plan.id}`);
  };

  const handleDuplicatePlan = (plan: any) => {
    // For now, navigate to plan class with the plan data
    navigate('/plan', { state: { duplicatePlan: plan } });
    toast({
      title: "Plan Ready to Duplicate",
      description: "You can now modify and save the duplicated plan.",
    });
  };

  const handleHidePlan = (planId: string) => {
    // For now, just show a toast - this would need to be implemented in the backend
    toast({
      title: "Plan Hidden",
      description: "This feature will be implemented soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100 pb-20">
      {/* Enhanced Header with Profile */}
      <div className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-xl border-b border-white/30 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/f986f49e-45f2-4dd4-8758-4be41a199bfd.png" 
            alt="Logo" 
            className="h-10 w-10 rounded-full shadow-lg"
          />
          <h1 className="text-xl font-bold text-sage-800">Reformer</h1>
        </div>
        <ProfileButton />
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Animated Welcome Header */}
        <AnimatedHeader />

        {/* Class Plans Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-sage-800">Your Classes</h2>
          <WalletStyleClassCards 
            classPlans={classPlans}
            onTeachPlan={handleTeachPlan}
            onDuplicatePlan={handleDuplicatePlan}
            onHidePlan={handleHidePlan}
          />
        </div>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Index;
