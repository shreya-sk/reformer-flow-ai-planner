
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowLeft, Clock } from 'lucide-react';
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
    
    if (isFinished) return 'text-red-500';
    if (percentage > 50) return preferences.darkMode ? 'text-sage-400' : 'text-sage-600';
    if (percentage > 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressPercentage = () => {
    const totalTime = minutes * 60 + seconds;
    if (totalTime === 0) return 0;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getProgressColor = () => {
    if (isFinished) return '#ef4444';
    return '#5e745e';
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-50 via-white to-sage-100'} pb-20`}>
      {/* Minimalist Header */}
      <header className={`${preferences.darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-sage-100'} border-b backdrop-blur-lg px-4 py-3`}>
        <div className="flex items-center justify-center max-w-md mx-auto relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className={`absolute left-0 ${preferences.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-sage-600 hover:text-sage-800 hover:bg-sage-50'}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
            <h1 className={`text-lg font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>Timer</h1>
          </div>
        </div>
      </header>

      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-sm">
          {/* Main Timer Card */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-sage-200/50'} shadow-2xl backdrop-blur-xl border-2`}>
            <CardContent className="p-8">
              {/* Circular Progress and Timer Display */}
              <div className="relative mb-8">
                {/* Circular Progress Ring */}
                <div className="relative w-52 h-52 mx-auto">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke={preferences.darkMode ? '#374151' : '#e5e7eb'}
                      strokeWidth="6"
                      fill="transparent"
                      className="opacity-30"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke={getProgressColor()}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                      className="transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Timer Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-5xl font-light ${getTimerColor()} transition-colors duration-300 font-mono`}>
                        {formatTime(timeLeft)}
                      </div>
                      {isFinished && (
                        <div className="text-red-500 text-sm font-medium mt-2 animate-pulse">
                          Time's Up!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Setting Controls */}
              {!isRunning && !isFinished && (
                <div className="flex justify-center gap-6 mb-8">
                  <div className="text-center">
                    <label className={`block text-xs font-medium mb-3 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} uppercase tracking-wide`}>
                      Minutes
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => adjustMinutes(-1)}
                        size="sm"
                        variant="ghost"
                        className={`w-8 h-8 p-0 rounded-full ${preferences.darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-sage-600 hover:bg-sage-100'}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(Math.max(0, Math.min(60, parseInt(e.target.value) || 0)))}
                        className={`w-14 text-center font-mono ${preferences.darkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-sage-300 bg-white/50'}`}
                        min="0"
                        max="60"
                      />
                      <Button
                        onClick={() => adjustMinutes(1)}
                        size="sm"
                        variant="ghost"
                        className={`w-8 h-8 p-0 rounded-full ${preferences.darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-sage-600 hover:bg-sage-100'}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <label className={`block text-xs font-medium mb-3 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'} uppercase tracking-wide`}>
                      Seconds
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => adjustSeconds(-15)}
                        size="sm"
                        variant="ghost"
                        className={`w-8 h-8 p-0 rounded-full ${preferences.darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-sage-600 hover:bg-sage-100'}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                        className={`w-14 text-center font-mono ${preferences.darkMode ? 'border-gray-600 bg-gray-700/50 text-white' : 'border-sage-300 bg-white/50'}`}
                        min="0"
                        max="59"
                      />
                      <Button
                        onClick={() => adjustSeconds(15)}
                        size="sm"
                        variant="ghost"
                        className={`w-8 h-8 p-0 rounded-full ${preferences.darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-sage-600 hover:bg-sage-100'}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className={`${
                    isFinished 
                      ? 'bg-sage-600 hover:bg-sage-700' 
                      : isRunning 
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-sage-600 hover:bg-sage-700'
                  } text-white px-8 h-14 text-base shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  {isFinished ? (
                    'New Timer'
                  ) : isRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleReset}
                  size="lg"
                  variant="outline"
                  className={`${preferences.darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-sage-300 text-sage-600 hover:bg-sage-50'} h-14 px-6 shadow-sm`}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Presets */}
              <div className={`pt-6 border-t ${preferences.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-center text-xs font-medium mb-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'} uppercase tracking-wide`}>
                  Quick Presets
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
                      className={`text-sm h-10 rounded-lg transition-all duration-200 ${
                        preferences.darkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-sage-600 hover:bg-sage-100 hover:text-sage-700'
                      }`}
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
