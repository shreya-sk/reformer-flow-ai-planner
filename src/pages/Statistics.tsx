
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Target, Trophy, TrendingUp, Dumbbell, Clock, Star } from 'lucide-react';

const Statistics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats } = useUserStats();
  const { preferences } = useUserPreferences();

  const weeklyProgress = 75; // Mock data
  const monthlyGoal = 12;
  const currentClasses = stats.totalClassesCreated;

  return (
    <div className={`min-h-screen pb-20 ${preferences.darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'}`}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-white/50 sticky top-0 z-40">
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-sage-600 rounded-full p-2 hover:bg-sage-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-sage-800">Your Statistics</h1>
            <p className="text-sm text-sage-600">Track your progress and achievements</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Weekly Progress */}
        <Card className="bg-gradient-to-r from-sage-500 to-sage-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">This Week</h3>
                <p className="text-sage-100">Classes created</p>
              </div>
              <Calendar className="h-8 w-8 text-sage-200" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{Math.floor(weeklyProgress / 10)}/10</span>
                <span className="text-sage-200">{weeklyProgress}% complete</span>
              </div>
              <Progress value={weeklyProgress} className="h-2 bg-sage-400" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white shadow-lg rounded-2xl border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-sage-800 mb-1">{stats.totalClassesCreated}</div>
              <div className="text-sm text-sage-600">Total Classes</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-sage-800 mb-1">{stats.totalExercisesUsed}</div>
              <div className="text-sm text-sage-600">Exercises Used</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-sage-800 mb-1">{stats.customExerciseCount}</div>
              <div className="text-sm text-sage-600">Custom Exercises</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-2xl border-0">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-sage-800 mb-1">85%</div>
              <div className="text-sm text-sage-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Goal */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <Star className="h-5 w-5 text-sage-600" />
              Monthly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sage-700">Classes this month</span>
                <span className="font-semibold text-sage-800">{currentClasses}/{monthlyGoal}</span>
              </div>
              <Progress value={(currentClasses / monthlyGoal) * 100} className="h-3" />
              <div className="text-sm text-sage-600">
                {monthlyGoal - currentClasses > 0 
                  ? `${monthlyGoal - currentClasses} more classes to reach your goal!`
                  : "🎉 Goal achieved! Set a new challenge?"
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Used Exercises */}
        {stats.mostUsedExercises.length > 0 && (
          <Card className="bg-white shadow-lg rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-sage-800">Top Exercises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.mostUsedExercises.slice(0, 5).map((exercise, index) => (
                <div key={exercise.exerciseId} className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-sage-600 text-white text-sm font-bold rounded-full">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sage-800">{exercise.exerciseName}</div>
                    <div className="text-xs text-sage-600">Used {exercise.usageCount} times</div>
                  </div>
                  <Badge variant="outline" className="text-sage-700">
                    {exercise.usageCount}x
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        <Card className="bg-white shadow-lg rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-sage-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-medium text-orange-700">First Class</div>
                <div className="text-xs text-orange-600">Created your first class plan</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="text-2xl mb-1">💪</div>
                <div className="text-sm font-medium text-blue-700">Exercise Explorer</div>
                <div className="text-xs text-blue-600">Used 10+ different exercises</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm font-medium text-green-700">Consistency</div>
                <div className="text-xs text-green-600">Created classes 3 days in a row</div>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium text-purple-700">Goal Crusher</div>
                <div className="text-xs text-purple-600">Reached monthly target</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
