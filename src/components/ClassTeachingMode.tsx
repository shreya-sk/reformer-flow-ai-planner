import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X,
  Timer,
  Edit2,
  Image as ImageIcon,
  Lightbulb,
  Settings,
  Shield,
  TrendingUp,
  TrendingDown,
  Dumbbell
} from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';

interface ClassTeachingModeProps {
  classPlan: ClassPlan;
  onClose: () => void;
}

export const ClassTeachingMode = ({ classPlan, onClose }: ClassTeachingModeProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(classPlan.classDuration * 60);
  const [isEditingGlobalTime, setIsEditingGlobalTime] = useState(false);
  const [tempGlobalTime, setTempGlobalTime] = useState(classPlan.classDuration || 45);

  // Filter out callouts from exercises
  const exercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
  const currentExercise = exercises[currentExerciseIndex];

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

  // Global timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && globalTimeLeft > 0) {
      interval = setInterval(() => {
        setGlobalTimeLeft(time => Math.max(0, time - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, globalTimeLeft]);

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

  const handleGlobalTimeEdit = () => {
    setGlobalTimeLeft(tempGlobalTime * 60);
    setIsEditingGlobalTime(false);
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
    
    return defaultSetups[exercise.category as keyof typeof defaultSetups] || 
           "Position client according to exercise requirements, ensuring proper alignment and spring setup.";
  };

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100 via-sage-200 to-sage-300">
      {/* Compact Header with Timer and Controls Only */}
      <div className="bg-sage-600/90 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="p-3">
          <div className="flex items-center justify-between">
            {/* Left: Exit Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:text-sage-100 hover:bg-white/20"
            >
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
            
            {/* Center: Exercise Info */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">
                {currentExercise.name}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="outline" className="border-white/30 text-white bg-white/10 text-xs">
                  {currentExerciseIndex + 1} of {exercises.length}
                </Badge>
                <SpringVisual springs={currentExercise.springs} />
              </div>
            </div>
            
            {/* Right: Global Timer */}
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-white" />
              {isEditingGlobalTime ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tempGlobalTime}
                    onChange={(e) => setTempGlobalTime(parseInt(e.target.value) || 45)}
                    className="w-16 h-7 text-xs border-white/30 bg-white/20 text-white"
                    min="1"
                    max="120"
                  />
                  <Button onClick={handleGlobalTimeEdit} size="sm" variant="ghost" className="h-7 px-1 text-xs text-white">
                    ✓
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className={`text-lg font-bold ${
                    globalTimeLeft < 300 ? 'text-red-200' : 'text-white'
                  }`}>
                    {formatTime(globalTimeLeft)}
                  </span>
                  <Button
                    onClick={() => setIsEditingGlobalTime(true)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-white hover:bg-white/20"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Compact Layout */}
      <div className="p-4 space-y-4">
        {/* Exercise Timer & Controls - Compact */}
        <div className="text-center space-y-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-sage-300 shadow-md">
            {currentExercise.duration && currentExercise.duration > 0 ? (
              <div className={`text-4xl font-bold ${
                exerciseTimeLeft < 30 ? 'text-red-500' : 'text-sage-800'
              }`}>
                {formatTime(exerciseTimeLeft)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-sage-800">
                {currentExercise.repsOrDuration || 'Hold position'}
              </div>
            )}
          </div>
          
          {/* Control Buttons - Compact */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              variant="outline"
              className="border-sage-400 hover:bg-sage-100"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-3"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={nextExercise}
              disabled={currentExerciseIndex === exercises.length - 1}
              variant="outline"
              className="border-sage-400 hover:bg-sage-100"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Exercise Details in 2 Compact Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Setup Instructions - Compact */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-300 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-sage-800">
                  <Settings className="h-4 w-4 text-sage-600" />
                  Setup & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-xs leading-relaxed text-sage-700">
                  {getSetupInstructions(currentExercise)}
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentExercise.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-sage-100 text-sage-700 px-2 py-0">
                      <Dumbbell className="h-2 w-2 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teaching Cues - Compact Bullet Points */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-300 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-sage-800">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {getEnhancedCues(currentExercise).map((cue, index) => (
                    <li key={index} className="text-xs leading-relaxed text-sage-700 flex items-start gap-2">
                      <span className="text-sage-500 font-bold">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Combined Progressions & Regressions */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-300 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-sage-800">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Progressions */}
                {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-green-600 mb-1">Make it Harder:</h4>
                    <ul className="space-y-0.5">
                      {currentExercise.progressions.slice(0, 2).map((progression, index) => (
                        <li key={index} className="text-xs text-sage-700 flex items-start gap-1">
                          <span className="text-green-600">▲</span>
                          <span>{progression}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regressions */}
                {currentExercise.regressions && currentExercise.regressions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-blue-600 mb-1">Make it Easier:</h4>
                    <ul className="space-y-0.5">
                      {currentExercise.regressions.slice(0, 2).map((regression, index) => (
                        <li key={index} className="text-xs text-sage-700 flex items-start gap-1">
                          <span className="text-blue-600">▼</span>
                          <span>{regression}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Notes - Compact */}
            {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-amber-300 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                    <Shield className="h-4 w-4" />
                    Safety Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-0.5">
                    {currentExercise.contraindications.slice(0, 3).map((item, index) => (
                      <li key={index} className="text-xs text-sage-700 flex items-start gap-1">
                        <span className="text-amber-600">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Exercise Image/Video at Bottom - Compact */}
        <Card className="bg-white/80 backdrop-blur-sm border-sage-300 shadow-sm max-w-3xl mx-auto">
          <CardContent className="p-4">
            {currentExercise.image ? (
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img 
                  src={currentExercise.image} 
                  alt={currentExercise.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/60 text-white text-xs">
                    Reference Image
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="h-48 rounded-lg bg-sage-100 flex flex-col items-center justify-center border-2 border-dashed border-sage-300">
                <ImageIcon className="h-12 w-12 mb-2 text-sage-400" />
                <span className="text-sm font-medium text-sage-600">
                  No reference image available
                </span>
                <span className="text-xs text-sage-500 mt-1">
                  {currentExercise.name}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
