
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const currentExercise = classPlan.exercises[currentExerciseIndex];

  useEffect(() => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration * 60);
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

  const getSpringVisual = (springs: string) => {
    const springConfig = {
      'light': [{ color: 'bg-green-500', count: 1, name: 'Light' }],
      'medium': [{ color: 'bg-yellow-500', count: 1, name: 'Medium' }],
      'heavy': [{ color: 'bg-red-500', count: 2, name: 'Heavy' }],
      'mixed': [
        { color: 'bg-red-500', count: 1, name: 'Heavy' },
        { color: 'bg-yellow-500', count: 1, name: 'Medium' },
        { color: 'bg-green-500', count: 1, name: 'Light' }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-3">
        <span className="text-white text-lg font-medium">Springs:</span>
        <div className="flex items-center gap-2">
          {config.map((spring, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="flex gap-1">
                {Array.from({ length: spring.count }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full ${spring.color} shadow-lg border-2 border-white/20`} />
                ))}
              </div>
              <span className="text-white/80 text-sm">{spring.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
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
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const PregnancyIcon = () => (
    <div className="bg-pink-100 rounded-full p-2">
      <svg className="h-6 w-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.91 1.47 2.09 2.66 2.09 4.16v1c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-1c0-1.5 1.18-2.69 2.09-4.16.91-1.47 1.41-3.1 1.41-4.84 0-3.87-3.13-7-7-7zm-1 15h2v1h-2v-1zm0-2h2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
      </svg>
    </div>
  );

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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 z-50 text-white overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-gray-700">
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

        <div className="w-32" />
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={`text-4xl md:text-6xl lg:text-8xl font-bold mb-4 ${getTimerColor()}`}>
              {formatTime(timeRemaining)}
            </div>
            
            <Progress 
              value={progress} 
              className="w-full max-w-md mx-auto h-3 mb-6 bg-gray-700"
            />

            {/* Timer Controls */}
            <div className="flex justify-center gap-4 mb-6">
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
          <Card className="bg-gray-800/50 border-gray-600">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Exercise Image/Video */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  <div className="bg-gray-700 rounded-lg aspect-square flex items-center justify-center mb-4">
                    {currentExercise.image ? (
                      <img 
                        src={currentExercise.image} 
                        alt={currentExercise.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <img 
                        src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
                        alt="Default exercise"
                        className="w-full h-full object-cover rounded-lg opacity-50"
                      />
                    )}
                  </div>
                  
                  {currentExercise.videoUrl && (
                    <video 
                      src={currentExercise.videoUrl} 
                      controls 
                      className="w-full rounded-lg"
                      poster={currentExercise.image}
                    >
                      Your browser does not support video playback.
                    </video>
                  )}
                </div>

                {/* Exercise Details */}
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{currentExercise.name}</h2>
                      {currentExercise.isPregnancySafe && <PregnancyIcon />}
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge className="bg-blue-600 text-white text-sm">{currentExercise.category}</Badge>
                      <Badge className="bg-purple-600 text-white text-sm">{currentExercise.difficulty}</Badge>
                      <Badge className="bg-green-600 text-white text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentExercise.duration}min
                      </Badge>
                    </div>

                    {/* Springs Display */}
                    <div className="mb-6">
                      {getSpringVisual(currentExercise.springs)}
                    </div>
                  </div>

                  {currentExercise.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{currentExercise.description}</p>
                    </div>
                  )}

                  {currentExercise.cues && currentExercise.cues.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Teaching Cues</h3>
                      <div className="space-y-2">
                        {currentExercise.cues.map((cue, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-sage-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-300 bg-gray-700/50 p-3 rounded-lg flex-1">{cue}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Muscle Groups:</span>
                      <span className="text-white ml-2">{currentExercise.muscleGroups.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Equipment:</span>
                      <span className="text-white ml-2">{currentExercise.equipment.join(', ') || 'None'}</span>
                    </div>
                  </div>

                  {currentExercise.notes && (
                    <div className="bg-gray-700/50 p-4 rounded-lg mt-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Notes:</h4>
                      <p className="text-sm text-gray-300">{currentExercise.notes}</p>
                    </div>
                  )}
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
              <ChevronLeft className="h-4 w-4 mr-2" />
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
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
