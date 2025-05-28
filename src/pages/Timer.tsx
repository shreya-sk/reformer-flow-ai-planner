
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { BottomNavigation } from '@/components/BottomNavigation';

const Timer = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setTimeLeft(minutes * 60 + seconds);
  }, [minutes, seconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isFinished) {
      handleReset();
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(minutes * 60 + seconds);
  };

  const adjustMinutes = (delta: number) => {
    const newMinutes = Math.max(0, Math.min(60, minutes + delta));
    setMinutes(newMinutes);
  };

  const adjustSeconds = (delta: number) => {
    const newSeconds = Math.max(0, Math.min(59, seconds + delta));
    setSeconds(newSeconds);
  };

  const getTimerColor = () => {
    const totalTime = minutes * 60 + seconds;
    const percentage = (timeLeft / totalTime) * 100;
    
    if (isFinished) return preferences.darkMode ? 'text-red-400' : 'text-red-500';
    if (percentage > 50) return preferences.darkMode ? 'text-sage-400' : 'text-sage-600';
    if (percentage > 25) return preferences.darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return preferences.darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getProgressPercentage = () => {
    const totalTime = minutes * 60 + seconds;
    if (totalTime === 0) return 0;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getProgressColor = () => {
    if (isFinished) return '#ef4444';
    return preferences.darkMode ? '#9ca3af' : '#5e745e';
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-50 via-white to-sage-100'} pb-20`}>
      {/* Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b px-4 py-4 sticky top-0 z-40`}>
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className={`${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-100'}`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className={`h-6 w-px ${preferences.darkMode ? 'bg-gray-600' : 'bg-sage-300'}`} />
          
          <h1 className={`text-xl font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Timer</h1>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <div className="max-w-md mx-auto">
          {/* Timer Card */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-sage-200'} shadow-2xl backdrop-blur-sm`}>
            <CardContent className="p-6 md:p-8">
              {/* Circular Progress and Timer Display */}
              <div className="relative mb-8">
                {/* Circular Progress Ring */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto timer-circle">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      stroke={preferences.darkMode ? '#374151' : '#e5e7eb'}
                      strokeWidth="8"
                      fill="transparent"
                      className="opacity-20"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      stroke={getProgressColor()}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgressPercentage() / 100)}`}
                      className="transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Timer Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl md:text-5xl font-bold ${getTimerColor()} transition-colors duration-300`}>
                        {formatTime(timeLeft)}
                      </div>
                      {isFinished && (
                        <div className={`${preferences.darkMode ? 'text-red-400' : 'text-red-500'} text-sm font-medium mt-1 animate-pulse`}>
                          Time's Up!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Setting Controls */}
              {!isRunning && !isFinished && (
                <div className="flex justify-center gap-4 mb-8">
                  <div className="text-center">
                    <label className={`block text-xs font-medium mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                      Minutes
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => adjustMinutes(-1)}
                        size="sm"
                        variant="outline"
                        className={`w-8 h-8 p-0 ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 hover:bg-sage-50'}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(Math.max(0, Math.min(60, parseInt(e.target.value) || 0)))}
                        className={`w-12 text-center text-sm ${preferences.darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-sage-300'}`}
                        min="0"
                        max="60"
                      />
                      <Button
                        onClick={() => adjustMinutes(1)}
                        size="sm"
                        variant="outline"
                        className={`w-8 h-8 p-0 ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 hover:bg-sage-50'}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <label className={`block text-xs font-medium mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                      Seconds
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => adjustSeconds(-15)}
                        size="sm"
                        variant="outline"
                        className={`w-8 h-8 p-0 ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 hover:bg-sage-50'}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                        className={`w-12 text-center text-sm ${preferences.darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-sage-300'}`}
                        min="0"
                        max="59"
                      />
                      <Button
                        onClick={() => adjustSeconds(15)}
                        size="sm"
                        variant="outline"
                        className={`w-8 h-8 p-0 ${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 hover:bg-sage-50'}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center gap-3 mb-6">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className={`${
                    isFinished 
                      ? 'bg-sage-600 hover:bg-sage-700' 
                      : isRunning 
                        ? preferences.darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-sage-600 hover:bg-sage-700'
                  } text-white px-6 md:px-8 h-12 md:h-14 text-sm md:text-base`}
                >
                  {isFinished ? (
                    'New Timer'
                  ) : isRunning ? (
                    <>
                      <Pause className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className={`${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300'} h-12 md:h-14 px-4 md:px-6`}
                >
                  <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>

              {/* Quick Presets */}
              <div className={`pt-4 border-t ${preferences.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-center text-xs font-medium mb-3 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  Quick Times
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '30s', minutes: 0, seconds: 30 },
                    { label: '1m', minutes: 1, seconds: 0 },
                    { label: '2m', minutes: 2, seconds: 0 },
                    { label: '3m', minutes: 3, seconds: 0 },
                    { label: '5m', minutes: 5, seconds: 0 },
                    { label: '10m', minutes: 10, seconds: 0 },
                  ].map((preset) => (
                    <Button
                      key={preset.label}
                      onClick={() => {
                        setMinutes(preset.minutes);
                        setSeconds(preset.seconds);
                        setIsRunning(false);
                        setIsFinished(false);
                      }}
                      size="sm"
                      variant="ghost"
                      className={`text-xs h-8 ${preferences.darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-sage-600 hover:bg-sage-100'}`}
                      disabled={isRunning}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Timer;
