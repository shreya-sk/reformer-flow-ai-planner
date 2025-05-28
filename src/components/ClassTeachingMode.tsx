
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Pause, SkipBack, SkipForward, X, Timer, Edit2, Image as ImageIcon, Lightbulb, Settings, Shield, TrendingUp, TrendingDown, Dumbbell } from 'lucide-react';
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
    return defaultSetups[exercise.category as keyof typeof defaultSetups] || "Position client according to exercise requirements, ensuring proper alignment and spring setup.";
  };

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100 to-sage-50 relative pb-6">
      {/* Floating Top Controls */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 flex justify-between items-center bg-gradient-to-b from-sage-600 to-transparent">
        <Button 
          onClick={onClose} 
          variant="secondary" 
          size="sm" 
          className="bg-white/80 backdrop-blur-sm text-sage-700 hover:bg-white/90 hover:text-sage-800 rounded-xl shadow-lg transition-all duration-300"
        >
          <X className="h-4 w-4 mr-2" />
          <span className="font-medium">Exit</span>
        </Button>

        {/* Global Timer */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-2">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-sage-600" />
            {isEditingGlobalTime ? (
              <div className="flex items-center gap-1">
                <Input 
                  type="number" 
                  value={tempGlobalTime} 
                  onChange={e => setTempGlobalTime(parseInt(e.target.value) || 45)} 
                  className="w-16 h-7 text-sm border-sage-300 bg-white" 
                  min="1" 
                  max="120" 
                />
                <Button onClick={handleGlobalTimeEdit} size="sm" variant="ghost" className="h-7 px-2 text-sm">✓</Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className={`text-lg font-bold ${globalTimeLeft < 300 ? 'text-red-500' : 'text-sage-800'}`}>
                  {formatTime(globalTimeLeft)}
                </span>
                <Button 
                  onClick={() => setIsEditingGlobalTime(true)} 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-sage-600 hover:bg-sage-100"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 space-y-4 relative z-10">
        {/* Exercise Header and Progress */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sage-200 rounded-xl px-4 py-2 shadow-lg">
            <Badge variant="outline" className="border-sage-300 text-sage-700 bg-sage-50 text-sm px-2">
              {currentExerciseIndex + 1} of {exercises.length}
            </Badge>
            <SpringVisual springs={currentExercise.springs} />
          </div>
          
          <h1 className="font-bold text-sage-800 text-2xl">
            {currentExercise.name}
          </h1>
        </div>

        {/* Two Column Layout for Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Timer & Controls */}
          <div className="space-y-4">
            {/* Exercise Timer */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-sage-200 shadow-lg rounded-xl text-center">
              {currentExercise.duration && currentExercise.duration > 0 ? (
                <div className={`text-5xl font-bold ${exerciseTimeLeft < 30 ? 'text-red-500' : 'text-sage-800'}`}>
                  {formatTime(exerciseTimeLeft)}
                </div>
              ) : (
                <div className="text-2xl font-bold text-sage-800">
                  {currentExercise.repsOrDuration || 'Hold position'}
                </div>
              )}
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button 
                onClick={previousExercise} 
                disabled={currentExerciseIndex === 0} 
                variant="outline" 
                size="sm" 
                className="border-sage-300 hover:bg-sage-100 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 h-12 w-12"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={handlePlayPause} 
                className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-14 w-14"
              >
                {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
              </Button>
              
              <Button 
                onClick={nextExercise} 
                disabled={currentExerciseIndex === exercises.length - 1} 
                variant="outline" 
                size="sm" 
                className="border-sage-300 hover:bg-sage-100 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 h-12 w-12"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Teaching Cues */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-sage-800">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {getEnhancedCues(currentExercise).map((cue, index) => (
                    <li key={index} className="text-sm leading-relaxed text-sage-700 flex items-start gap-2">
                      <span className="text-sage-500 font-bold text-base">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Safety Notes */}
            {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-600">
                    <Shield className="h-4 w-4" />
                    Safety Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1">
                    {currentExercise.contraindications.slice(0, 4).map((item, index) => (
                      <li key={index} className="text-sm text-sage-700 flex items-start gap-2">
                        <span className="text-amber-600">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Instructions & Image */}
          <div className="space-y-4">
            {/* Setup Instructions */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-sage-800">
                  <Settings className="h-4 w-4 text-sage-600" />
                  Setup & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm leading-relaxed text-sage-700">
                  {getSetupInstructions(currentExercise)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-sage-100 text-sage-700 px-2 rounded-lg">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Combined Progressions & Regressions */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-sage-800">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Progressions */}
                {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-1">Make it Harder:</h4>
                    <ul className="space-y-1">
                      {currentExercise.progressions.slice(0, 3).map((progression, index) => (
                        <li key={index} className="text-sm text-sage-700 flex items-start gap-2">
                          <span className="text-green-600 font-bold">▲</span>
                          <span>{progression}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regressions */}
                {currentExercise.regressions && currentExercise.regressions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">Make it Easier:</h4>
                    <ul className="space-y-1">
                      {currentExercise.regressions.slice(0, 3).map((regression, index) => (
                        <li key={index} className="text-sm text-sage-700 flex items-start gap-2">
                          <span className="text-blue-600 font-bold">▼</span>
                          <span>{regression}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exercise Image/Video */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-xl overflow-hidden">
              {currentExercise.image ? (
                <div className="relative h-56">
                  <img 
                    src={currentExercise.image} 
                    alt={currentExercise.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/60 text-white text-xs">
                      Reference Image
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="h-56 bg-sage-50 flex flex-col items-center justify-center border-2 border-dashed border-sage-300">
                  <ImageIcon className="h-12 w-12 mb-2 text-sage-400" />
                  <span className="text-base font-medium text-sage-600">
                    No reference image available
                  </span>
                  <span className="text-xs text-sage-500 mt-1">
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
