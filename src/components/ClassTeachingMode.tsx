
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, Clock } from 'lucide-react';
import { ClassPlan, Exercise } from '@/types/reformer';

interface ClassTeachingModeProps {
  classPlan: ClassPlan;
  onClose: () => void;
}

export const ClassTeachingMode = ({ classPlan, onClose }: ClassTeachingModeProps) => {
  const navigate = useNavigate();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isScreenLocked, setIsScreenLocked] = useState(true);

  const currentExercise = classPlan.exercises[currentExerciseIndex];

  useEffect(() => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration * 60); // Convert to seconds
    }
  }, [currentExercise, currentExerciseIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleNext = () => {
    if (currentExerciseIndex < classPlan.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsTimerRunning(false);
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setIsTimerRunning(false);
    }
  };

  const handleReset = () => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration * 60);
      setIsTimerRunning(false);
    }
  };

  const progress = currentExercise 
    ? ((currentExercise.duration * 60 - timeRemaining) / (currentExercise.duration * 60)) * 100 
    : 0;

  const getTimerColor = () => {
    const percentage = (timeRemaining / (currentExercise?.duration * 60 || 1)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!currentExercise) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Class Complete!</h2>
          <Button onClick={onClose} variant="outline" className="text-black">
            Return to Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black z-50 text-white overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Teaching Mode
        </Button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold">{classPlan.name}</h1>
          <p className="text-sm text-gray-300">
            Exercise {currentExerciseIndex + 1} of {classPlan.exercises.length}
          </p>
        </div>

        <div className="w-24" /> {/* Spacer for balance */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className={`text-8xl md:text-9xl font-bold mb-4 ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          
          <Progress 
            value={progress} 
            className="w-full max-w-md mx-auto h-3 mb-6 bg-gray-700"
          />

          {/* Timer Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className={`${isTimerRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
            >
              {isTimerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Exercise Info */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">{currentExercise.name}</h2>
              <div className="flex justify-center gap-3 mb-4">
                <Badge className="bg-blue-600 text-white">{currentExercise.category}</Badge>
                <Badge className="bg-purple-600 text-white">{currentExercise.difficulty}</Badge>
                <Badge className="bg-green-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentExercise.duration}min
                </Badge>
              </div>
            </div>

            {currentExercise.description && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300">{currentExercise.description}</p>
              </div>
            )}

            {currentExercise.cues && currentExercise.cues.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Teaching Cues</h3>
                <ul className="space-y-1">
                  {currentExercise.cues.map((cue, index) => (
                    <li key={index} className="text-gray-300">• {cue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Springs:</span>
                <span className="text-white ml-2 capitalize">{currentExercise.springs}</span>
              </div>
              <div>
                <span className="text-gray-400">Muscle Groups:</span>
                <span className="text-white ml-2">{currentExercise.muscleGroups.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentExerciseIndex === 0}
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            Previous Exercise
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {classPlan.exercises.length - currentExerciseIndex - 1} exercises remaining
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentExerciseIndex === classPlan.exercises.length - 1}
            className="bg-sage-600 hover:bg-sage-700"
          >
            Next Exercise
            <SkipForward className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
