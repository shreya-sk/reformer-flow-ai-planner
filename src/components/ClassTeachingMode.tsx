
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, RotateCcw, Heart, Share } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';

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

  const resetTimer = () => {
    if (currentExercise && currentExercise.duration) {
      setExerciseTimeLeft(currentExercise.duration * 60);
    }
    setIsPlaying(false);
  };

  const getExerciseImage = () => {
    const index = currentExerciseIndex % reformerImages.length;
    return reformerImages[index];
  };

  const totalDuration = currentExercise?.duration ? currentExercise.duration * 60 : 0;
  const progressPercentage = totalDuration > 0 ? ((totalDuration - exerciseTimeLeft) / totalDuration) * 100 : 0;

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-sage-900 to-black text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage-900/30 to-black/80"></div>
      
      {/* Top navigation */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-12">
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Share className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-8">
        {/* Large circular image with gradient border */}
        <div className="relative mb-8">
          <div className="w-80 h-80 rounded-full p-1 bg-gradient-to-r from-sage-400 via-sage-500 to-sage-600 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-sage-800">
              <img 
                src={currentExercise.image || getExerciseImage()}
                alt={currentExercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 w-80 h-80 rounded-full bg-gradient-to-r from-sage-400/20 via-sage-500/20 to-sage-600/20 blur-3xl -z-10"></div>
        </div>

        {/* Motivational text */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <p className="text-white/80 text-sm font-light">Feel your good time</p>
          </div>
        </div>

        {/* Exercise title and info */}
        <div className="text-center mb-8 max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-2">{currentExercise.name}</h1>
          <div className="flex items-center justify-center gap-3 text-white/60 text-sm mb-3">
            <span>{classPlan.name}</span>
            <span>•</span>
            <span className="capitalize">{currentExercise.category}</span>
          </div>
          
          {/* Spring visual and badge */}
          <div className="flex items-center justify-center gap-3">
            <SpringVisual springs={currentExercise.springs} className="scale-125" />
            <Badge variant="outline" className="border-white/30 text-white/70 bg-white/10 backdrop-blur-sm rounded-full">
              {currentExercise.difficulty}
            </Badge>
          </div>
        </div>

        {/* Teaching cues - scrollable */}
        {currentExercise.cues && currentExercise.cues.length > 0 && (
          <div className="max-w-sm mx-auto mb-8 max-h-20 overflow-y-auto">
            <div className="space-y-1">
              {currentExercise.cues.slice(0, 3).map((cue, index) => (
                <p key={index} className="text-xs text-white/50 text-center font-light leading-relaxed">
                  {cue}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom player controls */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-6 pb-12">
        {/* Progress bar with time */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span>{totalDuration > 0 ? formatTime(totalDuration - exerciseTimeLeft) : '00:00'}</span>
            <span>{formatTime(exerciseTimeLeft)}</span>
          </div>
          <div className="relative">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300"
              style={{ left: `${progressPercentage}%`, marginLeft: '-6px' }}
            />
          </div>
        </div>

        {/* Media controls */}
        <div className="flex items-center justify-center gap-8">
          <Button 
            onClick={previousExercise} 
            disabled={currentExerciseIndex === 0} 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 text-white/80 hover:text-white disabled:opacity-30 hover:bg-transparent"
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <Button 
            onClick={resetTimer} 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 text-white/80 hover:text-white hover:bg-transparent"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          {/* Large play/pause button */}
          <Button 
            onClick={handlePlayPause} 
            size="icon" 
            className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 shadow-xl hover:scale-105 transition-all duration-200" 
          >
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </Button>
          
          <Button 
            onClick={nextExercise} 
            disabled={currentExerciseIndex === exercises.length - 1} 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 text-white/80 hover:text-white disabled:opacity-30 hover:bg-transparent rotate-180"
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <div className="w-12 h-12" /> {/* Spacer for symmetry */}
        </div>

        {/* Exercise counter */}
        <div className="text-center mt-4">
          <p className="text-xs text-white/40">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </p>
        </div>
      </div>
    </div>
  );
}
