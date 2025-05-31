
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, X, Timer, Wind, Shield, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface MobileTeachingModeProps {
  classPlan: ClassPlan;
  onClose: () => void;
}

export const MobileTeachingMode = ({ classPlan, onClose }: MobileTeachingModeProps) => {
  const { preferences } = useUserPreferences();
  const teachingPrefs = preferences.teachingModePreferences;
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);

  // Filter out callouts from exercises
  const exercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
  const currentExercise = exercises[currentExerciseIndex];

  // Calculate progress percentage
  const progressPercentage = exercises.length > 0 ? ((currentExerciseIndex + 1) / exercises.length) * 100 : 0;

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
    return ["Focus on form and controlled movement"];
  };

  const getSetupInstructions = (exercise: Exercise): string => {
    if (exercise.setup) return exercise.setup;
    
    const defaultSetups = {
      'supine': "Position client supine on carriage, head on headrest.",
      'prone': "Guide client to prone position, ensure proper shoulder placement.",
      'standing': "Position client standing, establish proper posture.",
      'sitting': "Seat client with feet flat, spine elongated.",
      'side-lying': "Position client on side with body aligned.",
      'kneeling': "Guide client to kneeling position, ensure alignment."
    };
    return defaultSetups[exercise.category as keyof typeof defaultSetups] || "Position client according to exercise requirements.";
  };

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-sage-800 text-white relative overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-sage-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-sage-700 rounded-xl"
          >
            <X className="h-5 w-5 mr-2" />
            Exit
          </Button>
          
          <div className="flex-1 mx-4">
            <Progress value={progressPercentage} className="h-2 bg-sage-700" />
            <div className="text-center text-xs text-sage-300 mt-1">
              {currentExerciseIndex + 1} of {exercises.length}
            </div>
          </div>
          
          <div className="text-xs text-sage-300">
            {classPlan.classDuration}min
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-32 space-y-4">
        {/* Exercise Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-white">{currentExercise.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline" className="border-sage-400 text-sage-200 bg-sage-700/50 text-xs">
              {currentExercise.category}
            </Badge>
            <div className="flex items-center gap-1">
              <SpringVisual springs={currentExercise.springs} size="sm" />
            </div>
            {currentExercise.repsOrDuration && (
              <Badge variant="outline" className="border-blue-400 text-blue-200 bg-blue-700/50 text-xs">
                {currentExercise.repsOrDuration}
              </Badge>
            )}
          </div>
        </div>

        {/* Exercise Image */}
        {teachingPrefs?.showExerciseImage && currentExercise.image && (
          <div className="relative rounded-xl overflow-hidden bg-sage-700/30">
            <img 
              src={currentExercise.image} 
              alt={currentExercise.name} 
              className="w-full h-48 object-cover" 
            />
          </div>
        )}

        {/* Setup Instructions */}
        {teachingPrefs?.showSetupInstructions && (
          <div className="bg-sage-700/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-sage-300 mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </h3>
            <p className="text-sage-100 text-sm leading-relaxed">
              {getSetupInstructions(currentExercise)}
            </p>
          </div>
        )}

        {/* Teaching Cues */}
        {teachingPrefs?.showTeachingCues && (
          <div className="bg-sage-700/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <span className="text-amber-400">💡</span>
              Teaching Cues
            </h3>
            <ul className="space-y-2">
              {getEnhancedCues(currentExercise).slice(0, 3).map((cue, index) => (
                <li key={index} className="text-sage-100 text-sm flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Breathing Cues */}
        {teachingPrefs?.showBreathingCues && currentExercise.breathingCues && currentExercise.breathingCues.length > 0 && (
          <div className="bg-cyan-900/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Wind className="h-4 w-4" />
              Breathing
            </h3>
            <ul className="space-y-1">
              {currentExercise.breathingCues.slice(0, 2).map((cue, index) => (
                <li key={index} className="text-cyan-100 text-sm flex items-start gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progressions & Regressions */}
        {teachingPrefs?.showProgressionsRegressions && (
          <div className="grid grid-cols-2 gap-3">
            {currentExercise.regressions && currentExercise.regressions.length > 0 && (
              <div className="bg-blue-900/30 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Easier
                </h4>
                <ul className="space-y-1">
                  {currentExercise.regressions.slice(0, 2).map((item, index) => (
                    <li key={index} className="text-blue-100 text-xs">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {currentExercise.progressions && currentExercise.progressions.length > 0 && (
              <div className="bg-green-900/30 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-green-300 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Harder
                </h4>
                <ul className="space-y-1">
                  {currentExercise.progressions.slice(0, 2).map((item, index) => (
                    <li key={index} className="text-green-100 text-xs">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Safety Notes */}
        {teachingPrefs?.showSafetyNotes && currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
          <div className="bg-amber-900/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Safety Notes
            </h3>
            <ul className="space-y-1">
              {currentExercise.contraindications.slice(0, 2).map((item, index) => (
                <li key={index} className="text-amber-100 text-xs flex items-start gap-2">
                  <span className="text-amber-400">⚠️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-sage-900/95 backdrop-blur-sm p-4 space-y-4">
        {/* Timer */}
        {teachingPrefs?.showTimer && (
          <div className="text-center">
            {currentExercise.duration && currentExercise.duration > 0 ? (
              <div className={`text-4xl font-bold mb-2 ${exerciseTimeLeft < 30 ? 'text-red-300' : 'text-white'}`}>
                {formatTime(exerciseTimeLeft)}
              </div>
            ) : (
              <div className="text-xl font-bold text-white mb-2">
                {currentExercise.repsOrDuration || 'Hold position'}
              </div>
            )}
          </div>
        )}
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={previousExercise} 
            disabled={currentExerciseIndex === 0} 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-sage-700 rounded-xl disabled:opacity-30 h-12 w-12"
          >
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <Button 
            onClick={handlePlayPause} 
            size="icon" 
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl h-14 w-14" 
          >
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
          </Button>
          
          <Button 
            onClick={nextExercise} 
            disabled={currentExerciseIndex === exercises.length - 1} 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-sage-700 rounded-xl disabled:opacity-30 h-12 w-12"
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
