
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowLeft, Clock, Zap } from 'lucide-react';
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
            // Haptic feedback simulation
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
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
    if (percentage > 50) return 'text-emerald-600';
    if (percentage > 25) return 'text-amber-500';
    return 'text-red-500';
  };

  const getProgressPercentage = () => {
    const totalTime = minutes * 60 + seconds;
    if (totalTime === 0) return 0;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getBackgroundGradient = () => {
    if (isFinished) return 'from-red-100 via-red-50 to-orange-50';
    if (isRunning) return 'from-emerald-100 via-sage-50 to-blue-50';
    return 'from-sage-100 via-white to-emerald-50';
  };

  const getProgressColor = () => {
    const totalTime = minutes * 60 + seconds;
    const percentage = (timeLeft / totalTime) * 100;
    
    if (isFinished) return '#ef4444';
    if (percentage > 50) return '#059669';
    if (percentage > 25) return '#d97706';
    return '#dc2626';
  };

  const getBreathingAnimation = () => {
    if (!isRunning) return '';
    return 'animate-pulse';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} pb-20 transition-all duration-1000`}>
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-sage-300/20 rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-sage-200/50 px-4 py-3 relative z-10">
        <div className="flex items-center justify-center max-w-md mx-auto relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="absolute left-0 text-sage-600 hover:text-sage-800 hover:bg-sage-100/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-sage-500 to-emerald-600 rounded-full">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-sage-800 to-emerald-800 bg-clip-text text-transparent">
              Mindful Timer
            </h1>
          </div>
        </div>
      </header>

      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-sm">
          {/* Main Timer Card */}
          <Card className="bg-white/70 backdrop-blur-xl border-2 border-white/50 shadow-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sage-50/50 to-emerald-50/50 opacity-60"></div>
              
              {/* Timer Circle Container */}
              <div className="relative mb-8 z-10">
                <div className={`relative w-52 h-52 mx-auto ${getBreathingAnimation()}`}>
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                    isRunning ? 'from-emerald-400 to-sage-400' : 'from-sage-400 to-emerald-400'
                  } opacity-20 scale-110 animate-pulse`}></div>
                  
                  {/* Main progress ring */}
                  <svg className="transform -rotate-90 w-full h-full relative z-10">
                    {/* Background circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="rgba(94, 116, 94, 0.1)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke={getProgressColor()}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                      className="transition-all duration-1000 ease-linear drop-shadow-lg"
                      strokeLinecap="round"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(94, 116, 94, 0.3))'
                      }}
                    />
                  </svg>
                  
                  {/* Inner glow */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                  
                  {/* Timer Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center relative z-10">
                      <div className={`text-5xl font-light ${getTimerColor()} transition-all duration-500 font-mono tracking-wider`}>
                        {formatTime(timeLeft)}
                      </div>
                      {isFinished && (
                        <div className="text-red-500 text-sm font-medium mt-2 animate-bounce">
                          <Zap className="h-4 w-4 inline mr-1" />
                          Time's Up!
                        </div>
                      )}
                      {isRunning && (
                        <div className="text-emerald-600 text-xs font-medium mt-2">
                          Stay focused...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Controls */}
              {!isRunning && !isFinished && (
                <div className="flex justify-center gap-8 mb-8 relative z-10">
                  <div className="text-center">
                    <label className="block text-xs font-semibold mb-3 text-sage-700 uppercase tracking-wider">
                      Minutes
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => adjustMinutes(-1)}
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-700 transition-all duration-200 hover:scale-110"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(Math.max(0, Math.min(60, parseInt(e.target.value) || 0)))}
                        className="w-16 text-center font-mono text-lg border-2 border-sage-200 bg-white/80 backdrop-blur-sm"
                        min="0"
                        max="60"
                      />
                      <Button
                        onClick={() => adjustMinutes(1)}
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-700 transition-all duration-200 hover:scale-110"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <label className="block text-xs font-semibold mb-3 text-sage-700 uppercase tracking-wider">
                      Seconds
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => adjustSeconds(-15)}
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-700 transition-all duration-200 hover:scale-110"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                        className="w-16 text-center font-mono text-lg border-2 border-sage-200 bg-white/80 backdrop-blur-sm"
                        min="0"
                        max="59"
                      />
                      <Button
                        onClick={() => adjustSeconds(15)}
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-700 transition-all duration-200 hover:scale-110"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center gap-4 mb-6 relative z-10">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className={`relative overflow-hidden px-8 h-14 text-base font-medium transition-all duration-300 ${
                    isFinished 
                      ? 'bg-gradient-to-r from-sage-600 to-emerald-600 hover:from-sage-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : isRunning 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-emerald-600 to-sage-600 hover:from-emerald-700 hover:to-sage-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  } text-white border-0`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full transition-transform duration-1000 hover:translate-x-full"></div>
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
                  className="h-14 px-6 border-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400 transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Presets */}
              <div className="pt-6 border-t border-sage-200/50 relative z-10">
                <p className="text-center text-xs font-semibold mb-4 text-sage-600 uppercase tracking-wider">
                  Quick Start
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '30s', minutes: 0, seconds: 30, desc: 'Quick break' },
                    { label: '1m', minutes: 1, seconds: 0, desc: 'Breathing' },
                    { label: '2m', minutes: 2, seconds: 0, desc: 'Stretch' },
                    { label: '3m', minutes: 3, seconds: 0, desc: 'Exercise' },
                    { label: '5m', minutes: 5, seconds: 0, desc: 'Meditation' },
                    { label: '10m', minutes: 10, seconds: 0, desc: 'Focus time' },
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
                      className="h-auto py-3 px-2 rounded-xl transition-all duration-200 hover:scale-105 text-sage-700 hover:bg-sage-100/80 hover:text-sage-800 flex flex-col items-center bg-white/60 backdrop-blur-sm border border-sage-200/50"
                      disabled={isRunning}
                    >
                      <span className="font-semibold text-sm">{preset.label}</span>
                      <span className="text-xs opacity-75 mt-1">{preset.desc}</span>
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
