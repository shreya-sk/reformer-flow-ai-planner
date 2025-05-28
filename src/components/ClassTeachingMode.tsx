
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Clock,
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
import { useUserPreferences } from '@/hooks/useUserPreferences';
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
  const { preferences } = useUserPreferences();

  // Filter out callouts from exercises
  const exercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
  const currentExercise = exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

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
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 to-sage-50'}`}>
      {/* Simple Header with Timer */}
      <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-b shadow-sm`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className={`${preferences.darkMode ? 'text-gray-400 hover:text-white' : 'text-sage-600 hover:text-sage-800'}`}
              >
                <X className="h-4 w-4 mr-2" />
                Exit
              </Button>
              
              <h1 className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {classPlan.name}
              </h1>
              <Badge variant="outline">
                {currentExerciseIndex + 1} of {exercises.length}
              </Badge>
            </div>
            
            {/* Global Timer */}
            <div className="flex items-center gap-2">
              <Timer className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              {isEditingGlobalTime ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tempGlobalTime}
                    onChange={(e) => setTempGlobalTime(parseInt(e.target.value) || 45)}
                    className="w-20 h-8 text-sm"
                    min="1"
                    max="120"
                  />
                  <Button onClick={handleGlobalTimeEdit} size="sm" variant="ghost" className="h-8 px-2 text-xs">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold ${
                    globalTimeLeft < 300 ? 'text-red-500' : preferences.darkMode ? 'text-white' : 'text-sage-800'
                  }`}>
                    {formatTime(globalTimeLeft)}
                  </span>
                  <Button
                    onClick={() => setIsEditingGlobalTime(true)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content - Reorganized */}
      <div className="p-6 space-y-6">
        {/* Exercise Title & Controls */}
        <div className="text-center space-y-4">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              {currentExercise.name}
            </h2>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="outline">{currentExercise.difficulty}</Badge>
              <Badge className={`${preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}`}>
                {currentExercise.category}
              </Badge>
              <SpringVisual springs={currentExercise.springs} />
            </div>
          </div>

          {/* Exercise Timer */}
          {currentExercise.duration && currentExercise.duration > 0 ? (
            <div className={`text-5xl font-bold ${
              exerciseTimeLeft < 30 ? 'text-red-500' : preferences.darkMode ? 'text-white' : 'text-sage-800'
            }`}>
              {formatTime(exerciseTimeLeft)}
            </div>
          ) : (
            <div className={`text-3xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              {currentExercise.repsOrDuration || 'Hold position'}
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              variant="outline"
              size="lg"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
            
            <Button
              onClick={nextExercise}
              disabled={currentExerciseIndex === exercises.length - 1}
              variant="outline"
              size="lg"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Exercise Details in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Teaching Cues */}
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getEnhancedCues(currentExercise).map((cue, index) => (
                  <div key={index} className={`p-3 rounded-lg ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} border-l-4 border-sage-500`}>
                    <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                      💡 {cue}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <Settings className="h-5 w-5" />
                  Setup & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  {getSetupInstructions(currentExercise)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Progressions & Regressions */}
            <div className="grid grid-cols-1 gap-4">
              {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                      <TrendingUp className="h-5 w-5" />
                      Make it Harder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentExercise.progressions.slice(0, 3).map((progression, index) => (
                        <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                          ▲ {progression}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {currentExercise.regressions && currentExercise.regressions.length > 0 && (
                <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                      <TrendingDown className="h-5 w-5" />
                      Make it Easier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentExercise.regressions.slice(0, 3).map((regression, index) => (
                        <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                          ▼ {regression}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Safety Notes */}
            {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
              <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-amber-200`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                    <Shield className="h-5 w-5" />
                    Safety Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentExercise.contraindications.map((item, index) => (
                      <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                        ⚠️ {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Exercise Image/Video at Bottom */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
          <CardContent className="p-4">
            {currentExercise.image ? (
              <div className="relative h-64 rounded-lg overflow-hidden">
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
              <div className={`h-64 rounded-lg ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'} flex flex-col items-center justify-center`}>
                <ImageIcon className={`h-16 w-16 mb-3 ${preferences.darkMode ? 'text-gray-500' : 'text-sage-400'}`} />
                <span className={`text-lg font-medium ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                  No reference image available
                </span>
                <span className={`text-sm ${preferences.darkMode ? 'text-gray-500' : 'text-sage-500'}`}>
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
