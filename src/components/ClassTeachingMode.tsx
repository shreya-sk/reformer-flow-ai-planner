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
  Edit2,
  Dumbbell,
  Eye,
  Shield
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

  // Get current callout context
  const getCurrentCallout = () => {
    let currentCallout = '';
    for (let i = currentExerciseIndex; i >= 0; i--) {
      if (classPlan.exercises[i].category === 'callout') {
        currentCallout = classPlan.exercises[i].name;
        break;
      }
    }
    return currentCallout;
  };

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
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 to-sage-50'} p-3`}>
      {/* Compact Header */}
      <div className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border rounded-lg p-3 mb-3 shadow-sm`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className={`h-8 ${preferences.darkMode ? 'text-gray-400 hover:text-white' : 'text-sage-600 hover:text-sage-800'}`}
            >
              <X className="h-4 w-4 mr-1" />
              Exit
            </Button>
            
            <div className="flex items-center gap-2">
              <Timer className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`} />
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
            {classPlan.name} • {currentExerciseIndex + 1}/{classPlan.exercises.length}
          </div>
        </div>
        
        <Progress value={progress} className="h-1" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-3 h-[calc(100vh-120px)]">
        {/* Left Side - Exercise Info & Teaching Cues (60%) */}
        <div className="col-span-7 space-y-3 overflow-y-auto">
          {/* Exercise Title & Current Callout */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className={`text-xl font-bold mb-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    {currentExercise.name}
                  </h2>
                  {getCurrentCallout() && (
                    <Badge variant="secondary" className="text-xs">
                      {getCurrentCallout()}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SpringVisual springs={currentExercise.springs} />
                  {currentExercise.isPregnancySafe && (
                    <Baby className="h-4 w-4 text-pink-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline">{currentExercise.repsOrDuration || `${currentExercise.duration}min`}</Badge>
                <Badge variant="outline">{currentExercise.difficulty}</Badge>
                <Badge className={`${preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}`}>
                  {currentExercise.category}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Cues - Largest Section */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm flex-1`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-lg flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                <Lightbulb className="h-5 w-5" />
                Teaching Cues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getEnhancedCues(currentExercise).map((cue, index) => (
                <div key={index} className={`p-3 rounded-lg ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-50'} border-l-4 border-sage-500`}>
                  <p className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    {cue}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Compact Info Grid (40%) */}
        <div className="col-span-5 space-y-3 overflow-y-auto">
          {/* Setup Instructions */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                <Settings className="h-4 w-4" />
                Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xs leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                {getSetupInstructions(currentExercise)}
              </p>
            </CardContent>
          </Card>

          {/* Progressions & Regressions Combined */}
          <div className="grid grid-cols-2 gap-2">
            {currentExercise.progressions && currentExercise.progressions.length > 0 && (
              <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
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

            {currentExercise.regressions && currentExercise.regressions.length > 0 && (
              <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs flex items-center gap-1 text-blue-600">
                    <TrendingDown className="h-3 w-3" />
                    Easier
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1">
                    {currentExercise.regressions.slice(0, 2).map((regression, index) => (
                      <li key={index} className={`text-xs ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                        • {regression}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Safety & Contraindications */}
          {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs flex items-center gap-1 text-amber-600">
                  <Shield className="h-3 w-3" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
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

          {/* Equipment Icons */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-sm`}>
            <CardHeader className="pb-1">
              <CardTitle className={`text-xs flex items-center gap-1 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                <Dumbbell className="h-3 w-3" />
                Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {currentExercise.equipment.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs h-5">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Timer & Controls */}
      <div className={`fixed bottom-0 left-0 right-0 ${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} border-t p-4 shadow-lg`}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Exercise Image */}
            <div className={`w-full h-24 rounded-lg overflow-hidden ${preferences.darkMode ? 'bg-gray-700' : 'bg-sage-100'}`}>
              {currentExercise.image ? (
                <img 
                  src={currentExercise.image} 
                  alt={currentExercise.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className={`text-2xl font-bold ${preferences.darkMode ? 'text-gray-500' : 'text-sage-400'}`}>
                    {currentExerciseIndex + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Timer Display */}
            <div className="text-center">
              {currentExercise.duration && currentExercise.duration > 0 && (
                <div>
                  <div className={`text-3xl font-bold mb-1 ${
                    exerciseTimeLeft < 30 ? 'text-red-500' : preferences.darkMode ? 'text-white' : 'text-sage-800'
                  }`}>
                    {formatTime(exerciseTimeLeft)}
                  </div>
                  <div className={`text-xs ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Exercise Time
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={previousExercise}
                disabled={currentExerciseIndex === 0}
                variant="outline"
                size="sm"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white px-6"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={nextExercise}
                disabled={currentExerciseIndex === classPlan.exercises.length - 1}
                variant="outline"
                size="sm"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
