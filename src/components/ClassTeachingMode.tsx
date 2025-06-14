
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, RotateCcw, Heart, Share, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';
import { CircularProgress } from '@/components/CircularProgress';

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
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Filter out callouts from exercises
  const exercises = classPlan.exercises.filter(ex => ex.category !== 'callout');
  const currentExercise = exercises[currentExerciseIndex];

  // Calculate overall class progress
  const classProgress = exercises.length > 0 ? ((currentExerciseIndex + 1) / exercises.length) * 100 : 0;

  // Use reformer images
  const reformerImages = [
    '/lovable-uploads/52923e3d-1669-4ae1-9710-9e1c18d8820d.png',
    '/lovable-uploads/4f3b5d45-3013-4b5a-a650-b00727408e73.png',
    '/lovable-uploads/6df53ad2-d4c7-4ef5-9b70-2a57511c5421.png',
    '/lovable-uploads/f2338ebb-8a0c-4afe-9088-9a7ebb481767.png',
    '/lovable-uploads/88ad6c7c-6357-4065-a69f-836c59627047.png',
    '/lovable-uploads/dcef387f-d6db-46cb-8908-cdee0eb3d361.png'
  ];

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

  const resetTimer = () => {
    if (currentExercise && currentExercise.duration) {
      setExerciseTimeLeft(currentExercise.duration * 60);
    }
    setIsPlaying(false);
  };

  const getExerciseImage = () => {
    const index = currentExerciseIndex % reformerImages.length;
    return reformerImages[index];
  };

  const totalDuration = currentExercise?.duration ? currentExercise.duration * 60 : 0;
  const progressPercentage = totalDuration > 0 ? ((totalDuration - exerciseTimeLeft) / totalDuration) * 100 : 0;

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-sage-900 to-black text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage-900/30 to-black/80"></div>
      
      {/* Class Progress Bar at the very top with percentage */}
      <div className="relative z-20 px-6 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Progress 
            value={classProgress} 
            className="h-1 bg-white/20 flex-1"
          />
          <span className="text-white/60 text-sm font-mono min-w-[3rem]">
            {Math.round(classProgress)}%
          </span>
        </div>
      </div>
      
      {/* Top navigation */}
      <div className="relative z-20 flex items-center justify-between px-6">
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Share className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main content - properly spaced layout */}
      <div className="relative z-10 flex flex-col items-center px-8 py-4">
        {/* Exercise name at the top */}
        <div className="text-center mb-8 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{currentExercise.name}</h1>
            <SpringVisual springs={currentExercise.springs} className="scale-125" />
          </div>
          <p className="text-white/70 text-base capitalize">{currentExercise.difficulty} • {currentExercise.duration} min</p>
        </div>

        {/* Large circular image with progress ring */}
        <div className="relative mb-6">
          <CircularProgress 
            percentage={progressPercentage} 
            size={280} 
            strokeWidth={4}
            className="absolute inset-0"
          />
          
          <div className="w-[280px] h-[280px] rounded-full p-1 bg-gradient-to-r from-sage-400 via-sage-500 to-sage-600 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-sage-800">
              <img 
                src={currentExercise.image || getExerciseImage()}
                alt={currentExercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Floating timer */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-mono">{formatTime(exerciseTimeLeft)}</span>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 w-[280px] h-[280px] rounded-full bg-gradient-to-r from-sage-400/20 via-sage-500/20 to-sage-600/20 blur-3xl -z-10"></div>
        </div>

        {/* Media controls positioned just below the image */}
        <div className="mb-6">
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl rounded-full px-5 py-2.5 shadow-2xl">
            <Button 
              onClick={previousExercise} 
              disabled={currentExerciseIndex === 0} 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-white/80 hover:text-white disabled:opacity-30 hover:bg-transparent"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={resetTimer} 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-white/80 hover:text-white hover:bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            {/* Play/pause button */}
            <Button 
              onClick={handlePlayPause} 
              size="icon" 
              className="w-11 h-11 rounded-full bg-white text-black hover:bg-white/90 shadow-xl hover:scale-105 transition-all duration-200" 
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            
            <Button 
              onClick={nextExercise} 
              disabled={currentExerciseIndex === exercises.length - 1} 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9 text-white/80 hover:text-white disabled:opacity-30 hover:bg-transparent rotate-180"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Teaching cues - prominently displayed for instructors */}
        {currentExercise.cues && currentExercise.cues.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8 bg-white/15 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Teaching Cues</h3>
            <div className="space-y-3">
              {currentExercise.cues.slice(0, 4).map((cue, index) => (
                <p key={index} className="text-lg text-white font-light leading-relaxed text-center">
                  • {cue}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Pull up indicator with enhanced styling */}
        <Button
          onClick={() => setShowDetailPanel(true)}
          variant="ghost"
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 mb-20 flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <ChevronUp className="h-5 w-5" />
          <span className="text-base">View all exercise details</span>
        </Button>
      </div>

      {/* Enhanced Detail Panel - Comprehensive slide-up modal */}
      {showDetailPanel && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowDetailPanel(false)}
          />
          
          {/* Comprehensive Detail Panel with ALL exercise information */}
          <div className="fixed inset-x-0 bottom-0 top-1/4 z-50 bg-gradient-to-b from-white to-sage-50 rounded-t-3xl shadow-2xl animate-slide-in-bottom overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sage-200 bg-white/90 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold text-sage-800">{currentExercise.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <SpringVisual springs={currentExercise.springs} />
                  <span className="text-sm text-sage-600 capitalize">{currentExercise.difficulty}</span>
                </div>
              </div>
              <Button
                onClick={() => setShowDetailPanel(false)}
                variant="ghost"
                size="icon"
                className="text-sage-600 hover:bg-sage-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content - ALL exercise details */}
            <div className="p-6 overflow-y-auto h-full pb-20">
              <div className="space-y-6">
                {/* Description */}
                {currentExercise.description && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Description</h3>
                    <p className="text-sage-600 leading-relaxed">{currentExercise.description}</p>
                  </div>
                )}

                {/* Setup */}
                {currentExercise.setup && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Setup</h3>
                    <p className="text-sage-600 leading-relaxed">{currentExercise.setup}</p>
                  </div>
                )}

                {/* Teaching Cues */}
                {currentExercise.cues && currentExercise.cues.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Teaching Cues</h3>
                    <ul className="space-y-2">
                      {currentExercise.cues.map((cue, index) => (
                        <li key={index} className="text-sage-600 flex items-start gap-2">
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
                    <h3 className="font-semibold text-sage-800 mb-2">Breathing</h3>
                    <ul className="space-y-2">
                      {currentExercise.breathingCues.map((cue, index) => (
                        <li key={index} className="text-sage-600 flex items-start gap-2">
                          <span className="text-sage-400 mt-1">•</span>
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Muscles */}
                {currentExercise.muscleGroups && currentExercise.muscleGroups.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Target Muscles</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.muscleGroups.map((muscle, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modifications */}
                {currentExercise.modifications && currentExercise.modifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2 flex items-center gap-2">
                      🔧 Modifications
                    </h3>
                    <ul className="space-y-2">
                      {currentExercise.modifications.map((mod, index) => (
                        <li key={index} className="text-sage-600 flex items-start gap-2">
                          <span className="text-sage-400 mt-1">•</span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show message if no modifications are available */}
                {(!currentExercise.modifications || currentExercise.modifications.length === 0) && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2 flex items-center gap-2">
                      🔧 Modifications
                    </h3>
                    <p className="text-sage-400 text-sm italic">No modifications available for this exercise</p>
                  </div>
                )}

                {/* Progressions */}
                {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      📈 Progressions
                    </h3>
                    <ul className="space-y-2">
                      {currentExercise.progressions.map((prog, index) => (
                        <li key={index} className="text-green-600 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{prog}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show message if no progressions are available */}
                {(!currentExercise.progressions || currentExercise.progressions.length === 0) && (
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      📈 Progressions
                    </h3>
                    <p className="text-green-400 text-sm italic">No progressions available for this exercise</p>
                  </div>
                )}

                {/* Regressions */}
                {currentExercise.regressions && currentExercise.regressions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                      📉 Regressions
                    </h3>
                    <ul className="space-y-2">
                      {currentExercise.regressions.map((reg, index) => (
                        <li key={index} className="text-orange-600 flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>{reg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show message if no regressions are available */}
                {(!currentExercise.regressions || currentExercise.regressions.length === 0) && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                      📉 Regressions
                    </h3>
                    <p className="text-orange-400 text-sm italic">No regressions available for this exercise</p>
                  </div>
                )}

                {/* Contraindications */}
                {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      ⚠️ Contraindications
                    </h3>
                    <ul className="space-y-2">
                      {currentExercise.contraindications.map((contra, index) => (
                        <li key={index} className="text-red-600 flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{contra}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Show message if no contraindications are available */}
                {(!currentExercise.contraindications || currentExercise.contraindications.length === 0) && (
                  <div>
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      ⚠️ Contraindications
                    </h3>
                    <p className="text-red-400 text-sm italic">No specific contraindications noted for this exercise</p>
                  </div>
                )}

                {/* Pregnancy Safety - Always show */}
                <div>
                  <h3 className="font-semibold text-sage-800 mb-2 flex items-center gap-2">
                    🤰 Pregnancy Safety
                  </h3>
                  <div className={`p-3 rounded-lg ${currentExercise.isPregnancySafe ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                    <p className={`text-sm font-medium ${currentExercise.isPregnancySafe ? 'text-green-800' : 'text-red-800'}`}>
                      {currentExercise.isPregnancySafe ? '✓ Safe for pregnancy' : '✗ Not recommended during pregnancy'}
                    </p>
                  </div>
                </div>

                {/* Transitions */}
                {currentExercise.transitions && currentExercise.transitions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2 flex items-center gap-2">
                      🔄 Transitions
                    </h3>
                    <ul className="space-y-2">
                      {currentExercise.transitions.map((transition, index) => (
                        <li key={index} className="text-sage-600 flex items-start gap-2">
                          <span className="text-sage-400 mt-1">•</span>
                          <span>{transition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Teaching Focus */}
                {currentExercise.teachingFocus && currentExercise.teachingFocus.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Teaching Focus</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.teachingFocus.map((focus, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-sm">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {currentExercise.equipment && currentExercise.equipment.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Equipment</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.equipment.map((equip, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-sm">
                          {equip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Areas */}
                {currentExercise.targetAreas && currentExercise.targetAreas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Target Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.targetAreas.map((area, index) => (
                        <span key={index} className="bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {currentExercise.notes && (
                  <div>
                    <h3 className="font-semibold text-sage-800 mb-2">Notes</h3>
                    <p className="text-sage-600 leading-relaxed">{currentExercise.notes}</p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-sage-100 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-sage-700">Duration:</span>
                      <span className="text-sage-600 ml-2">{currentExercise.duration} min</span>
                    </div>
                    <div>
                      <span className="font-medium text-sage-700">Category:</span>
                      <span className="text-sage-600 ml-2 capitalize">{currentExercise.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-sage-700">Position:</span>
                      <span className="text-sage-600 ml-2 capitalize">{currentExercise.position}</span>
                    </div>
                    <div>
                      <span className="font-medium text-sage-700">Intensity:</span>
                      <span className="text-sage-600 ml-2 capitalize">{currentExercise.intensityLevel}</span>
                    </div>
                    {currentExercise.repsOrDuration && (
                      <div className="col-span-2">
                        <span className="font-medium text-sage-700">Reps/Duration:</span>
                        <span className="text-sage-600 ml-2">{currentExercise.repsOrDuration}</span>
                      </div>
                    )}
                    {currentExercise.tempo && (
                      <div className="col-span-2">
                        <span className="font-medium text-sage-700">Tempo:</span>
                        <span className="text-sage-600 ml-2">{currentExercise.tempo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
