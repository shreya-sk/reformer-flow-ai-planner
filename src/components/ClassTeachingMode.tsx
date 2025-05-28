
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, X, Timer, Image as ImageIcon, Lightbulb, Shield, TrendingUp, TrendingDown, Settings } from 'lucide-react';
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
    const baseCues = exercise.cues || [];
    const anatomicalCues = [
      "Engage deep abdominal muscles by drawing navel to spine",
      "Maintain neutral spine alignment with natural cervical curve",
      "Activate pelvic floor muscles throughout movement",
      "Keep shoulders away from ears, engaging latissimus dorsi",
      "Breathe laterally into ribcage on preparation, exhale on exertion"
    ];
    return baseCues.length > 0 ? baseCues : anatomicalCues.slice(0, 3);
  };

  const getSetupInstructions = (exercise: Exercise): string => {
    if (exercise.setup) return exercise.setup;
    const defaultSetups = {
      'supine': "Position client supine on carriage, head on headrest. Check spine alignment and adjust springs accordingly.",
      'prone': "Guide client to prone position, ensuring proper shoulder placement and abdominal engagement.",
      'standing': "Position client standing on platform or carriage, establish proper posture and spring tension.",
      'sitting': "Seat client with feet flat, spine elongated, shoulders over hips in neutral alignment.",
      'side-lying': "Position client on side with body aligned, supporting head and maintaining hip stability.",
      'kneeling': "Guide client to kneeling position, ensuring knee alignment and core engagement."
    };
    return defaultSetups[exercise.category as keyof typeof defaultSetups] || "Position client according to exercise requirements, ensuring proper alignment and spring setup.";
  };

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-sage-700 text-white">
      {/* Fixed Header with Timer - NO PROFILE PIC */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-sage-800/95 backdrop-blur-sm border-b border-sage-600">
        <div className="flex items-center justify-between p-4">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-sage-600 rounded-xl"
          >
            <X className="h-5 w-5 mr-2" />
            Exit Teaching
          </Button>
          
          {/* Timer in Header */}
          <div className="flex items-center gap-4 bg-sage-600/50 rounded-xl px-4 py-2">
            {currentExercise.duration && currentExercise.duration > 0 ? (
              <div className={`text-2xl font-bold ${exerciseTimeLeft < 30 ? 'text-red-300' : 'text-white'}`}>
                {formatTime(exerciseTimeLeft)}
              </div>
            ) : (
              <div className="text-lg font-bold text-white">
                {currentExercise.repsOrDuration || 'Hold position'}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={previousExercise} 
                disabled={currentExerciseIndex === 0} 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-sage-600 rounded-xl disabled:opacity-30 h-8 w-8 p-0"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handlePlayPause} 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 h-8"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button 
                onClick={nextExercise} 
                disabled={currentExerciseIndex === exercises.length - 1} 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-sage-600 rounded-xl disabled:opacity-30 h-8 w-8 p-0"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="mb-1">
              <Progress value={progressPercentage} className="h-2 bg-sage-600" />
            </div>
            <div className="text-center text-sm text-sage-200">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-6 pb-6 max-w-7xl mx-auto">
        {/* Exercise Name */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">{currentExercise.name}</h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-sage-400 text-sage-200 bg-sage-600/30">
              {currentExercise.category}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sage-300 text-sm">Springs:</span>
              <SpringVisual springs={currentExercise.springs} />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Setup & Cues */}
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-sage-300" />
                  Setup & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sage-100 leading-relaxed">{getSetupInstructions(currentExercise)}</p>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.equipment.map((item, index) => (
                    <Badge key={index} className="bg-sage-600/50 text-sage-100 border-sage-400/30">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getEnhancedCues(currentExercise).map((cue, index) => (
                    <li key={index} className="text-sage-100 leading-relaxed flex items-start gap-3">
                      <span className="text-sage-400 font-bold text-lg mt-0.5">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <TrendingDown className="h-5 w-5 text-blue-400" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Progressions
                    </h4>
                    <ul className="space-y-1">
                      {currentExercise.progressions.slice(0, 3).map((progression, index) => (
                        <li key={index} className="text-sage-100 text-sm flex items-start gap-2">
                          <span className="text-green-400">▲</span>
                          <span>{progression}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {currentExercise.regressions && currentExercise.regressions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-1">
                      <TrendingDown className="h-4 w-4" />
                      Regressions
                    </h4>
                    <ul className="space-y-1">
                      {currentExercise.regressions.slice(0, 3).map((regression, index) => (
                        <li key={index} className="text-sage-100 text-sm flex items-start gap-2">
                          <span className="text-blue-400">▼</span>
                          <span>{regression}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety */}
            {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
              <Card className="bg-amber-900/20 backdrop-blur-sm border-amber-500/30 rounded-2xl shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-200">
                    <Shield className="h-5 w-5" />
                    Safety Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {currentExercise.contraindications.slice(0, 4).map((item, index) => (
                      <li key={index} className="text-amber-100 text-sm flex items-start gap-2">
                        <span className="text-amber-400">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="space-y-4">
            {/* Exercise Image */}
            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg overflow-hidden">
              {currentExercise.image ? (
                <div className="relative h-96">
                  <img 
                    src={currentExercise.image} 
                    alt={currentExercise.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/60 text-white">
                      Reference Image
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-96 bg-sage-600/30 flex flex-col items-center justify-center border-2 border-dashed border-sage-400/50 rounded-2xl m-4">
                  <ImageIcon className="h-16 w-16 mb-4 text-sage-400" />
                  <span className="text-xl font-medium text-sage-200">
                    No reference image
                  </span>
                  <span className="text-sm text-sage-400 mt-2">
                    {currentExercise.name}
                  </span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
