
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
      'light': [{ color: 'bg-emerald-400', count: 1, name: 'Light' }],
      'medium': [{ color: 'bg-amber-400', count: 1, name: 'Medium' }],
      'heavy': [{ color: 'bg-rose-400', count: 2, name: 'Heavy' }],
      'mixed': [
        { color: 'bg-rose-400', count: 1, name: 'Heavy' },
        { color: 'bg-amber-400', count: 1, name: 'Medium' },
        { color: 'bg-emerald-400', count: 1, name: 'Light' }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-3">
        <span className="text-sage-100 text-sm font-medium">Springs:</span>
        <div className="flex items-center gap-3">
          {config.map((spring, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: spring.count }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${spring.color} shadow-lg border-2 border-white/30`} />
                ))}
              </div>
              <span className="text-sage-200 text-sm">{spring.name}</span>
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
    if (percentage > 50) return 'text-sage-200';
    if (percentage > 25) return 'text-amber-300';
    return 'text-rose-300';
  };

  const PregnancyIcon = () => (
    <div className="bg-pink-100 rounded-full p-2">
      <span className="text-pink-600 font-bold text-sm">👶✓</span>
    </div>
  );

  if (!currentExercise) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-sage-900 via-sage-800 to-sage-900 z-50 flex items-center justify-center">
        <div className="text-sage-100 text-center">
          <h2 className="text-3xl font-bold mb-6">Class Complete! 🎉</h2>
          <Button onClick={onClose} className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3">
            Return to Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sage-900 via-sage-800 to-sage-900 z-50 text-sage-100 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-sage-800/50 backdrop-blur-md border-b border-sage-700">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-sage-100 hover:bg-sage-700/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Exit Teaching Mode
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold text-sage-100">{classPlan.name}</h1>
          <p className="text-sm text-sage-300">
            Exercise {currentExerciseIndex + 1} of {classPlan.exercises.length}
          </p>
        </div>

        <div className="w-32" />
      </div>

      <div className="container mx-auto p-6 space-y-8">
        {/* Timer Section */}
        <div className="text-center">
          <div className={`text-6xl md:text-8xl font-bold mb-6 ${getTimerColor()} drop-shadow-lg`}>
            {formatTime(timeRemaining)}
          </div>
          
          <Progress 
            value={progress} 
            className="w-full max-w-lg mx-auto h-4 mb-8 bg-sage-700"
          />

          {/* Timer Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className={`${isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sage-600 hover:bg-sage-700'} text-white shadow-lg`}
            >
              {isTimerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={handleReset}
              size="lg"
              className="bg-sage-700 hover:bg-sage-800 text-white shadow-lg"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Exercise Info Card */}
        <Card className="bg-sage-100/10 backdrop-blur-md border-sage-600 shadow-2xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Exercise Image */}
              <div className="space-y-4">
                <div className="bg-sage-800/20 rounded-xl aspect-square flex items-center justify-center overflow-hidden">
                  {currentExercise.image ? (
                    <img 
                      src={currentExercise.image} 
                      alt={currentExercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src="/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png" 
                      alt="Default exercise"
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                </div>
                
                {currentExercise.videoUrl && (
                  <video 
                    src={currentExercise.videoUrl} 
                    controls 
                    className="w-full rounded-xl shadow-lg"
                    poster={currentExercise.image}
                  >
                    Your browser does not support video playback.
                  </video>
                )}
              </div>

              {/* Exercise Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-3xl font-bold text-sage-100">{currentExercise.name}</h2>
                    {currentExercise.isPregnancySafe && <PregnancyIcon />}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge className="bg-sage-600/30 text-sage-200 border-sage-500 text-sm px-3 py-1">
                      {currentExercise.category}
                    </Badge>
                    <Badge className="bg-amber-600/30 text-amber-200 border-amber-500 text-sm px-3 py-1">
                      {currentExercise.difficulty}
                    </Badge>
                    <Badge className="bg-sage-500/30 text-sage-200 border-sage-400 text-sm px-3 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentExercise.duration}min
                    </Badge>
                  </div>

                  {getSpringVisual(currentExercise.springs)}
                </div>

                {currentExercise.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-sage-100 mb-3">Description</h3>
                    <p className="text-sage-200 leading-relaxed bg-sage-800/20 p-4 rounded-lg">
                      {currentExercise.description}
                    </p>
                  </div>
                )}

                {/* Equipment and Muscle Groups in organized layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sage-800/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-sage-200 mb-2">Equipment:</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentExercise.equipment.map((equip, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-sage-700/50 text-sage-200">
                          {equip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-sage-800/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-sage-200 mb-2">Muscle Groups:</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentExercise.muscleGroups.map((group, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-sage-700/50 text-sage-200">
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {currentExercise.cues && currentExercise.cues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-sage-100 mb-4">Teaching Cues</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {currentExercise.cues.map((cue, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-4 rounded-lg bg-sage-800/20 border border-sage-700"
                        >
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-sage-600 text-white">
                            {index + 1}
                          </div>
                          <p className="text-sage-200 leading-relaxed">{cue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentExercise.notes && (
                  <div className="bg-sage-800/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-sage-200 mb-2">Notes:</h4>
                    <p className="text-sm text-sage-300">{currentExercise.notes}</p>
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
            className="bg-sage-700/50 hover:bg-sage-600 text-sage-100 border border-sage-600"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Exercise
          </Button>

          <div className="text-center">
            <p className="text-sage-300 text-sm">
              {classPlan.exercises.length - currentExerciseIndex - 1} exercises remaining
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentExerciseIndex === classPlan.exercises.length - 1}
            className="bg-sage-600 hover:bg-sage-700 text-white"
          >
            Next Exercise
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
