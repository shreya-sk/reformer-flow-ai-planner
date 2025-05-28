
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Calendar, Clock, BookOpen, LogOut } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';
import { useClassPlans } from '@/hooks/useClassPlans';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { savedClasses } = useClassPlans();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const totalDuration = savedClasses.reduce((sum, cls) => sum + cls.totalDuration, 0);
  const totalExercises = savedClasses.reduce((sum, cls) => sum + cls.exercises.length, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-25 via-white to-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-sage-600 hover:text-sage-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="h-6 w-px bg-sage-300" />
            
            <h1 className="text-xl font-semibold text-sage-800">Profile</h1>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Profile Info Card */}
          <Card className="border-sage-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-sage-50 to-white">
              <CardTitle className="flex items-center gap-3 text-sage-800">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Welcome back!</h2>
                  <p className="text-sage-600 text-sm">Pilates Instructor</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-sage-500" />
                  <span className="text-sage-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-sage-500" />
                  <span className="text-sage-700">
                    Member since {new Date(user.created_at || '').toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-sage-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-sage-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800 mb-1">{savedClasses.length}</div>
                <div className="text-sm text-sage-600">Saved Classes</div>
              </CardContent>
            </Card>

            <Card className="border-sage-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-sage-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800 mb-1">{formatDuration(totalDuration)}</div>
                <div className="text-sm text-sage-600">Total Duration</div>
              </CardContent>
            </Card>

            <Card className="border-sage-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-sage-600" />
                </div>
                <div className="text-2xl font-bold text-sage-800 mb-1">{totalExercises}</div>
                <div className="text-sm text-sage-600">Total Exercises</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-sage-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sage-800">Recent Classes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {savedClasses.length > 0 ? (
                <div className="space-y-3">
                  {savedClasses.slice(0, 5).map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-sage-50 rounded-lg border border-sage-200">
                      <div>
                        <h4 className="font-medium text-sage-800">{cls.name}</h4>
                        <p className="text-sm text-sage-600">
                          {cls.exercises.length} exercises • {formatDuration(cls.totalDuration)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-sage-100 text-sage-700">
                        {new Date(cls.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sage-500">No classes created yet</p>
                  <Button
                    onClick={() => navigate('/plan')}
                    className="mt-3 bg-sage-600 hover:bg-sage-700"
                  >
                    Create Your First Class
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Profile;
