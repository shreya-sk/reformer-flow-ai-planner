
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthPage } from '@/components/AuthPage';

const Timer = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [time, setTime] = useState(60); // Default 1 minute
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const setQuickTime = (minutes: number) => {
    const seconds = minutes * 60;
    setTime(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
  };

  const progress = initialTime > 0 ? ((initialTime - time) / initialTime) * 100 : 0;

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
            
            <h1 className="text-xl font-semibold text-sage-800">Class Timer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Timer Display */}
          <Card className="border-sage-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold text-sage-800">
                    {formatTime(time)}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    size="lg"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className="border-sage-300"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Timer Presets */}
          <Card className="border-sage-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <TimerIcon className="h-5 w-5" />
                Quick Timers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 5, 10, 15, 20, 30].map((minutes) => (
                  <Button
                    key={minutes}
                    onClick={() => setQuickTime(minutes)}
                    variant="outline"
                    className="border-sage-300 hover:bg-sage-50"
                  >
                    {minutes} min
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercise Timing Guide */}
          <Card className="border-sage-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sage-800">Exercise Timing Guide</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-sage-50 rounded-lg">
                  <span className="font-medium text-sage-800">Warm-up</span>
                  <span className="text-sage-600">5-10 minutes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-sage-50 rounded-lg">
                  <span className="font-medium text-sage-800">Main exercises</span>
                  <span className="text-sage-600">2-5 minutes each</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-sage-50 rounded-lg">
                  <span className="font-medium text-sage-800">Transitions</span>
                  <span className="text-sage-600">30-60 seconds</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-sage-50 rounded-lg">
                  <span className="font-medium text-sage-800">Cool-down</span>
                  <span className="text-sage-600">5-10 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Timer;
