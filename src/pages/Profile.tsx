
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassPlans } from '@/hooks/useClassPlans';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useCustomExercises } from '@/hooks/useCustomExercises';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AuthPage } from '@/components/AuthPage';
import { BottomNavigation } from '@/components/BottomNavigation';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Dumbbell,
  Moon,
  Sun,
  Heart,
  Calendar,
  Award,
  Target
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { savedClasses } = useClassPlans();
  const { customExercises } = useCustomExercises();
  const { preferences, loading: prefsLoading, updatePreferences } = useUserPreferences();

  if (authLoading || prefsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Calculate meaningful stats
  const totalClasses = savedClasses.length;
  const totalCustomExercises = customExercises.length;
  const avgClassDuration = totalClasses > 0 
    ? Math.round(savedClasses.reduce((sum, cls) => sum + cls.totalDuration, 0) / totalClasses)
    : 0;
  
  const recentClassesCount = savedClasses.filter(cls => {
    const daysDiff = (Date.now() - new Date(cls.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const mostUsedCategories = savedClasses
    .flatMap(cls => cls.exercises)
    .reduce((acc, ex) => {
      acc[ex.category] = (acc[ex.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(mostUsedCategories)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      {/* Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-4 sticky top-0 z-40`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className={`${preferences.darkMode ? 'text-gray-300 hover:text-white' : 'text-sage-600 hover:text-sage-800'}`}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
            
            <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* User Info Card */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
          <CardHeader className={`${preferences.darkMode ? 'bg-gray-750' : 'bg-gradient-to-r from-sage-50 to-white'}`}>
            <CardTitle className={`text-xl ${preferences.darkMode ? 'text-white' : 'text-sage-800'} font-semibold flex items-center gap-2`}>
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} mb-1 block`}>
                  Email Address
                </Label>
                <p className={`${preferences.darkMode ? 'text-white' : 'text-sage-800'} text-lg`}>{user.email}</p>
              </div>
              <div className="text-right">
                <Label className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} mb-1 block`}>
                  Member Since
                </Label>
                <p className={`${preferences.darkMode ? 'text-white' : 'text-sage-800'} text-lg`}>{memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
          <CardHeader>
            <CardTitle className={`text-xl ${preferences.darkMode ? 'text-white' : 'text-sage-800'} font-semibold flex items-center gap-2`}>
              <TrendingUp className="h-5 w-5" />
              Your Teaching Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}>
                  <BookOpen className={`h-8 w-8 ${preferences.darkMode ? 'text-blue-400' : 'text-sage-600'}`} />
                </div>
                <div className={`text-3xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{totalClasses}</div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium`}>Classes Created</div>
              </div>

              <div className="text-center">
                <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}>
                  <Calendar className={`h-8 w-8 ${preferences.darkMode ? 'text-green-400' : 'text-sage-600'}`} />
                </div>
                <div className={`text-3xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{recentClassesCount}</div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium`}>This Week</div>
              </div>

              <div className="text-center">
                <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}>
                  <Clock className={`h-8 w-8 ${preferences.darkMode ? 'text-yellow-400' : 'text-sage-600'}`} />
                </div>
                <div className={`text-3xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{avgClassDuration}</div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium`}>Avg Duration (min)</div>
              </div>

              <div className="text-center">
                <div className={`${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}>
                  <Dumbbell className={`h-8 w-8 ${preferences.darkMode ? 'text-purple-400' : 'text-sage-600'}`} />
                </div>
                <div className={`text-3xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>{totalCustomExercises}</div>
                <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} font-medium`}>Custom Exercises</div>
              </div>
            </div>

            {topCategory !== 'None' && (
              <div className="mt-6 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} rounded-full`}>
                  <Award className={`h-4 w-4 ${preferences.darkMode ? 'text-yellow-400' : 'text-sage-600'}`} />
                  <span className={`text-sm font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    Most Used Category: {topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
          <CardHeader>
            <CardTitle className={`text-xl ${preferences.darkMode ? 'text-white' : 'text-sage-800'} font-semibold`}>
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {preferences.darkMode ? <Moon className="h-5 w-5 text-gray-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                <div>
                  <Label className={`text-sm font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    Dark Mode
                  </Label>
                  <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Toggle between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => updatePreferences({ darkMode: checked })}
              />
            </div>

            <Separator className={preferences.darkMode ? 'bg-gray-700' : 'bg-sage-200'} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-pink-500" />
                <div>
                  <Label className={`text-sm font-medium ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    Pregnancy-Safe Mode
                  </Label>
                  <p className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Show only pregnancy-safe exercises
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.showPregnancySafeOnly}
                onCheckedChange={(checked) => updatePreferences({ showPregnancySafeOnly: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'border-sage-200'} shadow-sm`}>
          <CardContent className="p-6">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className={`w-full ${preferences.darkMode ? 'border-red-600 text-red-400 hover:bg-red-900/20' : 'border-red-300 text-red-600 hover:bg-red-50'}`}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Profile;
