
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Exercise, ClassPlan } from '@/types/reformer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Home,
  Clock,
  Users,
  Target,
  Dumbbell
} from 'lucide-react';

interface MobileTeachingModeProps {
  classPlan: ClassPlan;
  onClose: () => void;
}

export const MobileTeachingMode = ({ classPlan, onClose }: MobileTeachingModeProps) => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Get actual exercises (not callouts)
  const exercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
  const currentExercise = exercises[currentExerciseIndex];

  // Initialize timer when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setTimeRemaining((currentExercise.duration || 3) * 60);
    }
  }, [currentExercise]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  }, [currentExerciseIndex, exercises.length]);

  const handlePrevious = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  }, [currentExerciseIndex]);

  const handleReset = useCallback(() => {
    if (currentExercise) {
      setTimeRemaining((currentExercise.duration || 3) * 60);
      setIsPlaying(false);
    }
  }, [currentExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!classPlan || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-sage-400" />
            <h2 className="text-xl font-semibold text-sage-800 mb-2">No Class Plan</h2>
            <p className="text-sage-600 mb-4">Create a class plan first to start teaching.</p>
            <Button onClick={() => navigate('/plan')} className="w-full">
              Create Class Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-sage-200 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-sage-600"
          >
            <Home className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <div className="text-center">
            <h1 className="font-semibold text-sage-800">{classPlan.name}</h1>
            <p className="text-sm text-sage-600">
              {currentExerciseIndex + 1} of {exercises.length}
            </p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Timer Display */}
        <Card className="bg-gradient-to-r from-sage-100 to-white">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-sage-800 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-sage-600">
              {isPlaying ? 'In Progress' : timeRemaining === 0 ? 'Complete' : 'Ready'}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold text-sage-800">{currentExercise.name}</h2>
                <Badge variant="outline" className="text-sage-700">
                  {currentExercise.category}
                </Badge>
              </div>

              {/* Exercise Details - Always show */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-sage-600">
                  <Clock className="h-4 w-4" />
                  <span>{currentExercise.duration || 3} min</span>
                </div>
                
                <div className="flex items-center gap-2 text-sage-600">
                  <Users className="h-4 w-4" />
                  <span className="capitalize">{currentExercise.difficulty}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sage-600">
                  <Dumbbell className="h-4 w-4" />
                  <span className="capitalize">{currentExercise.springs}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sage-600">
                  <Target className="h-4 w-4" />
                  <span>{currentExercise.muscleGroups.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              {/* Description */}
              {currentExercise.description && (
                <div className="bg-sage-50 p-3 rounded-lg">
                  <p className="text-sage-700 text-sm">{currentExercise.description}</p>
                </div>
              )}

              {/* Setup Instructions */}
              {currentExercise.setup && (
                <div>
                  <h4 className="font-medium text-sage-800 mb-2">Setup</h4>
                  <p className="text-sm text-sage-600">{currentExercise.setup}</p>
                </div>
              )}

              {/* Teaching Cues */}
              {currentExercise.cues && currentExercise.cues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sage-800 mb-2">Teaching Cues</h4>
                  <ul className="space-y-1">
                    {currentExercise.cues.map((cue, index) => (
                      <li key={index} className="text-sm text-sage-600 flex items-start gap-2">
                        <span className="text-sage-400 mt-1">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Breathing Cues */}
              {currentExercise.breathingCues && currentExercise.breathingCues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sage-800 mb-2">Breathing</h4>
                  <ul className="space-y-1">
                    {currentExercise.breathingCues.map((cue, index) => (
                      <li key={index} className="text-sm text-sage-600 flex items-start gap-2">
                        <span className="text-sage-400 mt-1">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modifications */}
              {currentExercise.modifications && currentExercise.modifications.length > 0 && (
                <div>
                  <h4 className="font-medium text-sage-800 mb-2">Modifications</h4>
                  <ul className="space-y-1">
                    {currentExercise.modifications.map((mod, index) => (
                      <li key={index} className="text-sm text-sage-600 flex items-start gap-2">
                        <span className="text-sage-400 mt-1">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentExerciseIndex === 0}
            className="aspect-square p-0"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handlePlayPause}
            disabled={timeRemaining === 0}
            className="aspect-square p-0 bg-sage-600 hover:bg-sage-700"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReset}
            className="aspect-square p-0"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentExerciseIndex === exercises.length - 1}
            className="aspect-square p-0"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-sage-600">
            <span>Progress</span>
            <span>{Math.round(((currentExerciseIndex + 1) / exercises.length) * 100)}%</span>
          </div>
          <div className="w-full bg-sage-200 rounded-full h-2">
            <div
              className="bg-sage-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
