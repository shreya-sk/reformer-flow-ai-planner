
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { AuthPage } from '@/components/AuthPage';
import { ClassPlanList } from '@/components/ClassPlanList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Calendar, Clock, Dumbbell, Star, Trash2, Settings } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { classPlans, loading, deleteClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleEditClass = (classPlan: ClassPlan) => {
    console.log('🎯 Index: Editing class plan:', classPlan.id, classPlan.name);
    navigate('/plan', { state: { loadedClass: classPlan } });
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await deleteClassPlan(classId);
      showSuccessToast("Class deleted", "Class has been removed from your library.");
    } catch (error) {
      console.error('Error deleting class:', error);
      showErrorToast("Delete failed", "Could not delete the class. Please try again.");
    }
  };

  const handlePlanClass = () => {
    navigate('/plan');
  };

  const totalExercises = classPlans.reduce((sum, plan) => 
    sum + plan.exercises.filter(ex => ex.category !== 'callout').length, 0
  );

  const totalDuration = classPlans.reduce((sum, plan) => sum + plan.totalDuration, 0);

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} pb-20`}>
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-sage-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-sage-800">Reformerly</h1>
            <p className="text-sm text-sage-600">Plan & Teach Classes</p>
          </div>
          <Button
            onClick={() => navigate('/profile')}
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats - Mobile Compact */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-sage-700 mb-1">{classPlans.length}</div>
              <div className="text-xs text-sage-600">Classes</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-sage-700 mb-1">{totalExercises}</div>
              <div className="text-xs text-sage-600">Exercises</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-sage-700 mb-1">{Math.round(totalDuration / 60)}h</div>
              <div className="text-xs text-sage-600">Content</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Button */}
        <Button
          onClick={handlePlanClass}
          className="w-full bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Plan New Class
        </Button>

        {/* Classes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-sage-800">Your Classes</h2>
            {classPlans.length > 0 && (
              <Badge variant="outline" className="text-sage-600">
                {classPlans.length} saved
              </Badge>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : classPlans.length > 0 ? (
            <ClassPlanList
              classes={classPlans}
              onEditClass={handleEditClass}
              onDeleteClass={handleDeleteClass}
            />
          ) : (
            <Card className="border-2 border-dashed border-sage-200">
              <CardContent className="p-8 text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-sage-400" />
                <h3 className="text-lg font-medium text-sage-700 mb-2">No classes yet</h3>
                <p className="text-sage-600 mb-6 text-sm">Create your first class to get started</p>
                <Button
                  onClick={handlePlanClass}
                  className="bg-sage-600 hover:bg-sage-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Class
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation onPlanClass={handlePlanClass} />
    </div>
  );
};

export default Index;
