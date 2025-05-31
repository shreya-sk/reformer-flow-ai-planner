
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
import { Plus, Calendar, Clock, Dumbbell } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { classPlans, loading, deleteClassPlan } = useClassPlans();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading...</p>
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
      console.log('Class deleted successfully');
    } catch (error) {
      console.error('Error deleting class:', error);
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
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-25 via-white to-blue-50'} pb-20`}>
      {/* Compact Mobile Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-blue-800">Reformerly</h1>
            <p className="text-xs text-blue-600">Plan & Teach Classes</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <span>{classPlans.length} classes</span>
            <span>•</span>
            <span>{Math.round(totalDuration / 60)}h content</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Action Button */}
        <Button
          onClick={handlePlanClass}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Plan New Class
        </Button>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-700 mb-1">{classPlans.length}</div>
              <div className="text-xs text-blue-600">Classes</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-700 mb-1">{totalExercises}</div>
              <div className="text-xs text-blue-600">Exercises</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-700 mb-1">{Math.round(totalDuration / 60)}h</div>
              <div className="text-xs text-blue-600">Content</div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-800">Your Classes</h2>
            {classPlans.length > 0 && (
              <Badge variant="outline" className="text-blue-600">
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
            <Card className="border-2 border-dashed border-blue-200">
              <CardContent className="p-8 text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-medium text-blue-700 mb-2">No classes yet</h3>
                <p className="text-blue-600 mb-6 text-sm">Create your first class to get started</p>
                <Button
                  onClick={handlePlanClass}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
