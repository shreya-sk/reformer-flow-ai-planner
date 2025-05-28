
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100 relative overflow-hidden">
      {/* Organic background patterns */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <defs>
            <pattern id="organic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
              <circle cx="75" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#organic-pattern)" className="text-sage-400"/>
        </svg>
      </div>

      {/* Floating Exit Button - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={onClose}
          variant="ghost"
          size="lg"
          className="bg-white/80 backdrop-blur-sm border border-sage-200 text-sage-700 hover:bg-white/90 hover:text-sage-800 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <X className="h-5 w-5 mr-2" />
          <span className="font-medium">Exit Teaching</span>
        </Button>
      </div>

      {/* Global Timer - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/80 backdrop-blur-sm border border-sage-200 rounded-2xl shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-sage-600" />
            {isEditingGlobalTime ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={tempGlobalTime}
                  onChange={(e) => setTempGlobalTime(parseInt(e.target.value) || 45)}
                  className="w-20 h-8 text-sm border-sage-300 bg-white"
                  min="1"
                  max="120"
                />
                <Button onClick={handleGlobalTimeEdit} size="sm" variant="ghost" className="h-8 px-2 text-sm">
                  ✓
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${
                  globalTimeLeft < 300 ? 'text-red-500' : 'text-sage-800'
                }`}>
                  {formatTime(globalTimeLeft)}
                </span>
                <Button
                  onClick={() => setIsEditingGlobalTime(true)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-sage-600 hover:bg-sage-100"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-6 space-y-6 relative z-10">
        {/* Exercise Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-sage-200 rounded-2xl px-6 py-3 shadow-lg">
            <Badge variant="outline" className="border-sage-300 text-sage-700 bg-sage-50 text-sm px-3 py-1">
              {currentExerciseIndex + 1} of {exercises.length}
            </Badge>
            <SpringVisual springs={currentExercise.springs} />
          </div>
          
          <h1 className="text-3xl font-bold text-sage-800 leading-tight">
            {currentExercise.name}
          </h1>
        </div>

        {/* Exercise Timer & Controls */}
        <div className="text-center space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-sage-200 shadow-xl max-w-sm mx-auto">
            {currentExercise.duration && currentExercise.duration > 0 ? (
              <div className={`text-6xl font-bold ${
                exerciseTimeLeft < 30 ? 'text-red-500' : 'text-sage-800'
              }`}>
                {formatTime(exerciseTimeLeft)}
              </div>
            ) : (
              <div className="text-3xl font-bold text-sage-800">
                {currentExercise.repsOrDuration || 'Hold position'}
              </div>
            )}
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              variant="outline"
              size="lg"
              className="border-sage-300 hover:bg-sage-100 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
            
            <Button
              onClick={nextExercise}
              disabled={currentExerciseIndex === exercises.length - 1}
              variant="outline"
              size="lg"
              className="border-sage-300 hover:bg-sage-100 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Exercise Details in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Setup Instructions */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3 text-sage-800">
                  <Settings className="h-5 w-5 text-sage-600" />
                  Setup & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm leading-relaxed text-sage-700">
                  {getSetupInstructions(currentExercise)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-sage-100 text-sage-700 px-3 py-1 rounded-full">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teaching Cues */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3 text-sage-800">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {getEnhancedCues(currentExercise).map((cue, index) => (
                    <li key={index} className="text-sm leading-relaxed text-sage-700 flex items-start gap-3">
                      <span className="text-sage-500 font-bold text-lg">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Combined Progressions & Regressions */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3 text-sage-800">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <TrendingDown className="h-5 w-5 text-blue-600" />
                  Modifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Progressions */}
                {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2">Make it Harder:</h4>
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
                    <h4 className="text-sm font-semibold text-blue-600 mb-2">Make it Easier:</h4>
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

            {/* Safety Notes */}
            {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-3 text-amber-600">
                    <Shield className="h-5 w-5" />
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
        </div>

        {/* Exercise Image/Video at Bottom */}
        <Card className="bg-white/80 backdrop-blur-sm border-sage-200 shadow-lg rounded-2xl max-w-4xl mx-auto">
          <CardContent className="p-6">
            {currentExercise.image ? (
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <img 
                  src={currentExercise.image} 
                  alt={currentExercise.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/60 text-white text-sm">
                    Reference Image
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-2xl bg-sage-50 flex flex-col items-center justify-center border-2 border-dashed border-sage-300">
                <ImageIcon className="h-16 w-16 mb-3 text-sage-400" />
                <span className="text-lg font-medium text-sage-600">
                  No reference image available
                </span>
                <span className="text-sm text-sage-500 mt-1">
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
