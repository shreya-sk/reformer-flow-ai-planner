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
  const [currentCueIndex, setCurrentCueIndex] = useState(0);

  const currentExercise = classPlan.exercises[currentExerciseIndex];

  useEffect(() => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration * 60);
      setCurrentCueIndex(0);
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
        <span className="text-white/90 text-sm font-medium">Springs:</span>
        <div className="flex items-center gap-3">
          {config.map((spring, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: spring.count }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${spring.color} shadow-lg border-2 border-white/30`} />
                ))}
              </div>
              <span className="text-white/70 text-sm">{spring.name}</span>
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
    if (percentage > 50) return 'text-emerald-400';
    if (percentage > 25) return 'text-amber-400';
    return 'text-rose-400';
  };

  const PregnancyIcon = () => (
    <div className="bg-pink-100 rounded-full p-2">
      <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.91 1.47 2.09 2.66 2.09 4.16v1c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-1c0-1.5 1.18-2.69 2.09-4.16.91-1.47 1.41-3.1 1.41-4.84 0-3.87-3.13-7-7-7z"/>
      </svg>
    </div>
  );

  if (!currentExercise) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Class Complete! 🎉</h2>
          <Button onClick={onClose} className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3">
            Return to Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 text-white overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/30 backdrop-blur-md border-b border-white/10">
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Exit Teaching Mode
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold">{classPlan.name}</h1>
          <p className="text-sm text-white/70">
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
            className="w-full max-w-lg mx-auto h-4 mb-8 bg-white/20"
          />

          {/* Timer Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className={`${isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white shadow-lg`}
            >
              {isTimerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={handleReset}
              size="lg"
              className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Exercise Info Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Exercise Image */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl aspect-square flex items-center justify-center overflow-hidden">
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
                    <h2 className="text-3xl font-bold text-white">{currentExercise.name}</h2>
                    {currentExercise.isPregnancySafe && <PregnancyIcon />}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-sm px-3 py-1">
                      {currentExercise.category}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-sm px-3 py-1">
                      {currentExercise.difficulty}
                    </Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-sm px-3 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentExercise.duration}min
                    </Badge>
                  </div>

                  {getSpringVisual(currentExercise.springs)}
                </div>

                {currentExercise.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-white/80 leading-relaxed bg-white/5 p-4 rounded-lg">
                      {currentExercise.description}
                    </p>
                  </div>
                )}

                {currentExercise.cues && currentExercise.cues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Teaching Cues</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {currentExercise.cues.map((cue, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start gap-3 p-4 rounded-lg transition-all ${
                            index === currentCueIndex 
                              ? 'bg-sage-500/30 border border-sage-400/50' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            index === currentCueIndex 
                              ? 'bg-sage-500 text-white' 
                              : 'bg-white/20 text-white/70'
                          }`}>
                            {index + 1}
                          </div>
                          <p className="text-white/90 leading-relaxed">{cue}</p>
                        </div>
                      ))}
                    </div>
                    {currentExercise.cues.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => setCurrentCueIndex(Math.max(0, currentCueIndex - 1))}
                          disabled={currentCueIndex === 0}
                          className="bg-white/10 hover:bg-white/20 text-white"
                        >
                          Previous Cue
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setCurrentCueIndex(Math.min(currentExercise.cues.length - 1, currentCueIndex + 1))}
                          disabled={currentCueIndex === currentExercise.cues.length - 1}
                          className="bg-white/10 hover:bg-white/20 text-white"
                        >
                          Next Cue
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="text-white/60">Muscle Groups:</span>
                    <span className="text-white ml-2">{currentExercise.muscleGroups.join(', ')}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="text-white/60">Equipment:</span>
                    <span className="text-white ml-2">{currentExercise.equipment.join(', ') || 'None'}</span>
                  </div>
                </div>

                {currentExercise.notes && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2">Notes:</h4>
                    <p className="text-sm text-white/80">{currentExercise.notes}</p>
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
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Exercise
          </Button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
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
