
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const Timer = () => {
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
    if (percentage > 50) return preferences.darkMode ? 'text-green-400' : 'text-green-600';
    if (percentage > 25) return preferences.darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return preferences.darkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 via-white to-sage-50'} p-6`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            Exercise Timer
          </h1>
          <p className={`${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
            Set your exercise duration and stay focused
          </p>
        </div>

        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-xl`}>
          <CardContent className="p-8">
            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className={`text-8xl font-bold mb-4 ${getTimerColor()} transition-colors duration-300`}>
                {formatTime(timeLeft)}
              </div>
              
              {isFinished && (
                <div className="mb-4">
                  <p className={`text-xl font-semibold ${preferences.darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Time's Up! 🎉
                  </p>
                </div>
              )}
            </div>

            {/* Time Setting Controls */}
            {!isRunning && !isFinished && (
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <label className={`block text-sm font-medium mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Minutes
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => adjustMinutes(-1)}
                      size="sm"
                      variant="outline"
                      className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(60, parseInt(e.target.value) || 0)))}
                      className={`w-20 text-center ${preferences.darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-sage-300'}`}
                      min="0"
                      max="60"
                    />
                    <Button
                      onClick={() => adjustMinutes(1)}
                      size="sm"
                      variant="outline"
                      className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <label className={`block text-sm font-medium mb-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    Seconds
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => adjustSeconds(-5)}
                      size="sm"
                      variant="outline"
                      className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className={`w-20 text-center ${preferences.darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-sage-300'}`}
                      min="0"
                      max="59"
                    />
                    <Button
                      onClick={() => adjustSeconds(5)}
                      size="sm"
                      variant="outline"
                      className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className={`${
                  isFinished 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : isRunning 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                } text-white px-8`}
              >
                {isFinished ? (
                  'Start New Timer'
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
                className={`${preferences.darkMode ? 'border-gray-600 text-gray-300' : 'border-sage-300'}`}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Quick Time Presets */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-center text-sm font-medium mb-4 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                Quick Presets
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[
                  { label: '30s', minutes: 0, seconds: 30 },
                  { label: '1min', minutes: 1, seconds: 0 },
                  { label: '2min', minutes: 2, seconds: 0 },
                  { label: '5min', minutes: 5, seconds: 0 },
                  { label: '10min', minutes: 10, seconds: 0 },
                  { label: '15min', minutes: 15, seconds: 0 },
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
                    className={`${preferences.darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-sage-600 hover:bg-sage-100'}`}
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
  );
};

export default Timer;
