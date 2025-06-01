
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, X, ArrowLeft } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';

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

  const getExerciseImage = () => {
    const index = currentExerciseIndex % reformerImages.length;
    return reformerImages[index];
  };

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sage-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Top Bar - Minimal */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-12">
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        {/* Timer - Clean and minimal */}
        <div className="text-center">
          <div className="text-2xl font-light text-white/90 mb-1">
            {currentExercise.duration && currentExercise.duration > 0 ? formatTime(exerciseTimeLeft) : '00:00'}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wide">
            {currentExerciseIndex + 1} of {exercises.length}
          </div>
        </div>

        <div className="w-12"></div> {/* Spacer for center alignment */}
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* Large Circular Image */}
        <div className="relative mb-8">
          <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 bg-sage-800/20 backdrop-blur-sm">
            <img 
              src={currentExercise.image || getExerciseImage()}
              alt={currentExercise.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Subtle glow around image */}
          <div className="absolute inset-0 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-sage-400/20 to-sage-600/20 blur-2xl -z-10"></div>
        </div>

        {/* Exercise Info - Minimal and Clean */}
        <div className="text-center mb-12 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-light text-white mb-3 leading-tight">
            {currentExercise.name}
          </h1>
          <p className="text-lg text-white/60 font-light mb-4">
            Release tension and find your flow
          </p>
          
          {/* Category badge */}
          <Badge variant="outline" className="border-white/20 text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-4 py-1">
            {currentExercise.category}
          </Badge>
        </div>

        {/* Teaching Cues - Subtle and Faded */}
        {currentExercise.cues && currentExercise.cues.length > 0 && (
          <div className="max-w-sm mx-auto mb-8">
            <div className="space-y-2">
              {currentExercise.cues.slice(0, 2).map((cue, index) => (
                <p key={index} className="text-sm text-white/40 text-center font-light leading-relaxed">
                  {cue}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls - Floating */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-6 pb-12">
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={progressPercentage} 
            className="h-1 bg-white/10 rounded-full overflow-hidden"
          />
        </div>

        {/* Floating Control Pills */}
        <div className="flex items-center justify-center gap-4">
          {/* Previous */}
          <Button 
            onClick={previousExercise} 
            disabled={currentExerciseIndex === 0} 
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-30 disabled:hover:bg-white/10 transition-all duration-300"
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          {/* Play/Pause - Larger central button */}
          <Button 
            onClick={handlePlayPause} 
            size="icon" 
            className="w-20 h-20 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md shadow-lg transition-all duration-300 transform hover:scale-105" 
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </Button>
          
          {/* Next */}
          <Button 
            onClick={nextExercise} 
            disabled={currentExerciseIndex === exercises.length - 1} 
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-30 disabled:hover:bg-white/10 transition-all duration-300"
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        {/* Class info - Very subtle */}
        <div className="text-center mt-4">
          <p className="text-xs text-white/30 font-light">
            {classPlan.name} • {classPlan.classDuration}min class
          </p>
        </div>
      </div>
    </div>
  );
}
