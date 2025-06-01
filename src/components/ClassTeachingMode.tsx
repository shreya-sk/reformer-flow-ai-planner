
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, X, Timer, Image as ImageIcon, Lightbulb, Shield, TrendingUp, TrendingDown, Settings, Check, XCircle, Wind } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';
import { Layers } from 'lucide-react';

interface ClassTeachingModeProps {
  classPlan: ClassPlan;
  onClose: () => void;
}

export const ClassTeachingMode = ({
  classPlan,
  onClose
}: ClassTeachingModeProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);

  // Filter out callouts from exercises
  const exercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
  const currentExercise = exercises[currentExerciseIndex];

  // Calculate progress percentage
  const progressPercentage = exercises.length > 0 ? ((currentExerciseIndex + 1) / exercises.length) * 100 : 0;

  // Use reformer images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png'
  ];

  // Initialize exercise timer
  useEffect(() => {
    if (currentExercise && currentExercise.duration) {
      setExerciseTimeLeft(currentExercise.duration * 60);
    }
  }, [currentExercise]);

  // Exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && exerciseTimeLeft > 0) {
      interval = setInterval(() => {
        setExerciseTimeLeft(time => Math.max(0, time - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, exerciseTimeLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      const nextEx = exercises[currentExerciseIndex + 1];
      if (nextEx && nextEx.duration) {
        setExerciseTimeLeft(nextEx.duration * 60);
      }
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      const prevEx = exercises[currentExerciseIndex - 1];
      if (prevEx && prevEx.duration) {
        setExerciseTimeLeft(prevEx.duration * 60);
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getEnhancedCues = (exercise: Exercise): string[] => {
    const exerciseCues = exercise.cues || [];
    
    if (exerciseCues.length > 0) {
      return exerciseCues;
    }
    
    return ["Focus on proper alignment and breathing"];
  };

  const getExerciseImage = () => {
    const index = currentExerciseIndex % reformerImages.length;
    return reformerImages[index];
  };

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-900 via-sage-800 to-sage-900 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-sage-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-sage-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Fixed Timer & Progress Header - Music Player Style */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-sage-900/95 backdrop-blur-xl border-b border-sage-700/50">
        <div className="px-4 py-4">
          {/* Timer Display - Large and Central */}
          <div className="text-center mb-3">
            <div className={`text-4xl sm:text-6xl font-light mb-2 ${exerciseTimeLeft < 30 ? 'text-red-300' : 'text-white'}`}>
              {currentExercise.duration && currentExercise.duration > 0 ? formatTime(exerciseTimeLeft) : '00:00'}
            </div>
            <div className="text-sage-300 text-sm">
              {currentExerciseIndex + 1} of {exercises.length} • {Math.round(progressPercentage)}% Complete
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progressPercentage} className="h-2 bg-sage-700" />
          </div>

          {/* Translucent Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm" 
              className="text-sage-300 hover:text-white hover:bg-sage-700/50 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={previousExercise} 
              disabled={currentExerciseIndex === 0} 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-sage-700/50 rounded-full disabled:opacity-30 w-12 h-12"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={handlePlayPause} 
              size="icon" 
              className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16 backdrop-blur-sm" 
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
            
            <Button 
              onClick={nextExercise} 
              disabled={currentExerciseIndex === exercises.length - 1} 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-sage-700/50 rounded-full disabled:opacity-30 w-12 h-12"
            >
              <SkipForward className="h-6 w-6" />
            </Button>

            <div className="text-sage-300 text-sm bg-sage-700/50 rounded-full px-3 py-1 backdrop-blur-sm">
              {classPlan.classDuration}min class
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Music Player Layout */}
      <div className="pt-48 px-4 pb-6 max-w-6xl mx-auto relative">
        {/* Exercise Name - Album Title Style */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-light text-white mb-4 leading-tight">{currentExercise.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="border-sage-400 text-sage-200 bg-sage-700/50 backdrop-blur-sm rounded-full">
              {currentExercise.category}
            </Badge>
            <div className="flex items-center gap-2 text-sage-300">
              <span className="text-sm">Springs:</span>
              <SpringVisual springs={currentExercise.springs} />
            </div>
          </div>
        </div>

        {/* Central Exercise Image - Album Cover Style */}
        <div className="flex justify-center mb-8">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <img 
              src={currentExercise.image || getExerciseImage()}
              alt={currentExercise.name}
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
          </div>
        </div>

        {/* Teaching Cues - Subtle and Faded */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-sage-300 text-lg font-medium mb-4 flex items-center justify-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Teaching Cues
            </h3>
            <div className="space-y-2">
              {getEnhancedCues(currentExercise).slice(0, 3).map((cue, index) => (
                <p key={index} className="text-sage-400 text-sm leading-relaxed opacity-80">
                  {cue}
                </p>
              ))}
            </div>
          </div>

          {/* Breathing Cues */}
          {currentExercise.breathingCues && currentExercise.breathingCues.length > 0 && (
            <div className="text-center">
              <h4 className="text-sage-300 text-base font-medium mb-3 flex items-center justify-center gap-2">
                <Wind className="h-4 w-4" />
                Breathing
              </h4>
              <div className="space-y-2">
                {currentExercise.breathingCues.slice(0, 2).map((cue, index) => (
                  <p key={index} className="text-sage-400 text-sm opacity-70">
                    {cue}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
