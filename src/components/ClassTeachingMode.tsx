
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
  Users,
  Target,
  AlertTriangle,
  Lightbulb,
  X,
  Settings,
  TrendingUp,
  TrendingDown,
  Timer,
  Baby,
  Edit2
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
  const [tempGlobalTime, setTempGlobalTime] = useState(classPlan.classDuration);
  const { preferences } = useUserPreferences();

  const currentExercise = classPlan.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / classPlan.exercises.length) * 100;

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
    if (currentExerciseIndex < classPlan.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      const nextEx = classPlan.exercises[currentExerciseIndex + 1];
      if (nextEx && nextEx.duration) {
        setExerciseTimeLeft(nextEx.duration * 60);
      }
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      const prevEx = classPlan.exercises[currentExerciseIndex - 1];
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
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 to-sage-50'} p-4`}>
      {/* Global Timer Header */}
      <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border rounded-lg p-4 mb-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className={preferences.darkMode ? 'text-gray-400 hover:text-white' : 'text-sage-600 hover:text-sage-800'}
            >
              <X className="h-4 w-4 mr-1" />
              Exit
            </Button>
            
            <div className="flex items-center gap-2">
              <Timer className={`h-5 w-5 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
              <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                Class Time:
              </span>
              {isEditingGlobalTime ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={tempGlobalTime}
                    onChange={(e) => setTempGlobalTime(parseInt(e.target.value) || 45)}
                    className="w-16 h-6 text-xs"
                    min="1"
                    max="120"
                  />
                  <Button onClick={handleGlobalTimeEdit} size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    globalTimeLeft < 300 ? 'text-red-500' : preferences.darkMode ? 'text-white' : 'text-sage-800'
                  }`}>
                    {formatTime(globalTimeLeft)}
                  </span>
                  <Button
                    onClick={() => setIsEditingGlobalTime(true)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
            {classPlan.name} • Exercise {currentExerciseIndex + 1} of {classPlan.exercises.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>

      {/* New Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Setup Instructions */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              <Settings className="h-4 w-4" />
              Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
              {getSetupInstructions(currentExercise)}
            </p>
          </CardContent>
        </Card>

        {/* Teaching Cues */}
        <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              <Lightbulb className="h-4 w-4" />
              Professional Cues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {getEnhancedCues(currentExercise).map((cue, index) => (
                <li key={index} className={`flex items-start gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                  <span className="text-sage-500 font-bold text-xs mt-1">•</span>
                  <span className="text-xs leading-relaxed">{cue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Progressions */}
        {currentExercise.progressions && currentExercise.progressions.length > 0 && (
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-xs flex items-center gap-1 text-green-600`}>
                <TrendingUp className="h-3 w-3" />
                Progressions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {currentExercise.progressions.slice(0, 2).map((progression, index) => (
                  <li key={index} className={`text-xs ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    • {progression}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Safety Notes */}
        {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-xs flex items-center gap-1 text-amber-600`}>
                <AlertTriangle className="h-3 w-3" />
                Safety Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {currentExercise.contraindications.slice(0, 2).map((item, index) => (
                  <li key={index} className={`text-xs ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    • {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exercise Info and Timer Block */}
      <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={`text-lg mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                {currentExercise.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="text-xs">
                  {currentExercise.repsOrDuration || `${currentExercise.duration}min`}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentExercise.difficulty}
                </Badge>
                <Badge className={`text-xs ${preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}`}>
                  {currentExercise.category}
                </Badge>
                
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>Springs:</span>
                  <SpringVisual springs={currentExercise.springs} />
                </div>
                
                {currentExercise.isPregnancySafe && (
                  <div className="flex items-center gap-1">
                    <Baby className="h-3 w-3 text-pink-500" />
                    <span className="text-xs text-pink-500">Pregnancy Safe</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Exercise Timer - Prominent Display */}
          {currentExercise.duration && currentExercise.duration > 0 && (
            <div className="text-center bg-gradient-to-r from-sage-50 to-sage-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
              <div className={`text-3xl font-bold mb-1 ${
                exerciseTimeLeft < 30 ? 'text-red-500' : preferences.darkMode ? 'text-white' : 'text-sage-800'
              }`}>
                {formatTime(exerciseTimeLeft)}
              </div>
              <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                Exercise Time Remaining
              </div>
            </div>
          )}

          {/* Exercise Image */}
          <div className={`w-full h-48 rounded-lg overflow-hidden ${
            preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'
          }`}>
            {currentExercise.image ? (
              <img 
                src={currentExercise.image} 
                alt={currentExercise.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className={`text-4xl font-bold ${preferences.darkMode ? 'text-gray-500' : 'text-sage-400'}`}>
                  {currentExerciseIndex + 1}
                </span>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              variant="outline"
              size="lg"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="bg-sage-600 hover:bg-sage-700 text-white px-8"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              onClick={nextExercise}
              disabled={currentExerciseIndex === classPlan.exercises.length - 1}
              variant="outline"
              size="lg"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
