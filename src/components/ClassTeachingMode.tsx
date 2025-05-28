
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  X
} from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ClassTeachingModeProps {
  classPlan: ClassPlan;
  onClose: () => void;
}

export const ClassTeachingMode = ({ classPlan, onClose }: ClassTeachingModeProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { preferences } = useUserPreferences();

  const currentExercise = classPlan.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / classPlan.exercises.length) * 100;

  const nextExercise = () => {
    if (currentExerciseIndex < classPlan.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeElapsed(0);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setTimeElapsed(0);
    }
  };

  if (!currentExercise) return null;

  return (
    <div className={`min-h-screen ${preferences.darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sage-25 to-sage-50'} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
            {classPlan.name}
          </h1>
          <p className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
            Teaching Mode • Exercise {currentExerciseIndex + 1} of {classPlan.exercises.length}
          </p>
        </div>
        <Button 
          onClick={onClose}
          variant="ghost"
          size="sm"
          className={preferences.darkMode ? 'text-gray-400 hover:text-white' : 'text-sage-600 hover:text-sage-800'}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-sage-500">
          <span>Start</span>
          <span>{Math.round(progress)}% Complete</span>
          <span>End</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Exercise Card */}
        <div className="lg:col-span-2">
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'} shadow-lg`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className={`text-xl mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    {currentExercise.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-sage-100 text-sage-700'}`}>
                      {currentExercise.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentExercise.repsOrDuration || `${currentExercise.duration}min`}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentExercise.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
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

              {/* Description */}
              {currentExercise.description && (
                <div>
                  <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    Description
                  </h4>
                  <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                    {currentExercise.description}
                  </p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button
                  onClick={previousExercise}
                  disabled={currentExerciseIndex === 0}
                  variant="outline"
                  size="lg"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
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

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Exercise Details */}
          <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-sm ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                Exercise Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                <span className={preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}>
                  {currentExercise.repsOrDuration || `${currentExercise.duration} minutes`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                <span className={preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}>
                  {currentExercise.muscleGroups.join(', ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                <span className={preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}>
                  {currentExercise.difficulty} level
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Cues */}
          {currentExercise.cues && currentExercise.cues.length > 0 && (
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm flex items-center gap-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <Lightbulb className="h-4 w-4" />
                  Teaching Cues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {currentExercise.cues.map((cue, index) => (
                    <li key={index} className={`flex items-start gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                      <span className="text-sage-500 font-bold">•</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Contraindications */}
          {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
            <Card className={`${preferences.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-sage-200'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm flex items-center gap-2 text-amber-600`}>
                  <AlertTriangle className="h-4 w-4" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {currentExercise.contraindications.map((item, index) => (
                    <li key={index} className={`flex items-start gap-2 ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                      <span className="text-amber-500 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
