
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserStats } from '@/hooks/useUserStats';
import { BarChart3, Target, Dumbbell, Calendar, TrendingUp } from 'lucide-react';

export const UserStatsSection = () => {
  const { stats } = useUserStats();

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-800">{stats.totalClassesCreated}</div>
              <div className="text-sm text-sage-600">Classes Created</div>
            </div>
            <div className="text-center p-3 bg-sage-50 rounded-lg">
              <div className="text-2xl font-bold text-sage-800">{stats.customExerciseCount}</div>
              <div className="text-sm text-sage-600">Custom Exercises</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Used Exercises */}
      {stats.mostUsedExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Most Used Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.mostUsedExercises.slice(0, 5).map((exercise, index) => (
              <div key={exercise.exerciseId} className="flex items-center justify-between p-2 bg-sage-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-sage-600 text-white text-xs font-bold rounded">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sage-800">{exercise.exerciseName}</div>
                    <div className="text-xs text-sage-600">
                      Last used: {exercise.lastUsed.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-sage-700">
                  {exercise.usageCount}x
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Classes */}
      {stats.mostUsedClassPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-sage-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.mostUsedClassPlans.slice(0, 3).map((classPlan) => (
              <div key={classPlan.classId} className="flex items-center justify-between p-2 bg-sage-50 rounded-lg">
                <div>
                  <div className="font-medium text-sage-800">{classPlan.className}</div>
                  <div className="text-xs text-sage-600">
                    Created: {classPlan.lastUsed.toLocaleDateString()}
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-sage-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
