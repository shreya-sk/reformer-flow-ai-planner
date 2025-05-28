
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, X, Timer, Image as ImageIcon, Lightbulb, Shield, TrendingUp, TrendingDown, Settings, Check, XCircle } from 'lucide-react';
import { Exercise, ClassPlan } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';
import { Layers } from 'lucide-react';

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
    const exerciseCues = exercise.cues || [];
    
    // Only return exercise-specific cues
    if (exerciseCues.length > 0) {
      return exerciseCues;
    }
    
    // Optional: Return empty array or a single generic message
    return ["No specific cues available for this exercise"];
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
      {/* Fixed Header */}
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
          
          <div className="flex-1 max-w-md mx-4">
            <div className="mb-2">
              <Progress value={progressPercentage} className="h-4 bg-sage-600" />
            </div>
            <div className="text-center text-sm text-sage-200">
              {Math.round(progressPercentage)}% Complete • {currentExerciseIndex + 1} of {exercises.length}
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-sage-600/50 rounded-xl px-3 py-1">
            <Timer className="h-4 w-4" />
            <span className="text-sm font-medium">{classPlan.classDuration}min class</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-6 max-w-7xl mx-auto">
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
            <Badge variant="outline" className="border-sage-400 text-sage-200 bg-sage-600/30">
              {currentExercise.equipment.join(', ')}
            </Badge>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Setup & Cues & Safety & Timer */}
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg h-32">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-sage-300" />
                  Setup & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sage-100 leading-relaxed">{getSetupInstructions(currentExercise)}</p>
                <div className="flex flex-wrap gap-2">
                  
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg h-35">
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

            {/* Layers Card */}
           
            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                   <Layers className="h-5 w-5 text-white" />
                  Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:items-start">
                <>
                  {currentExercise.regressions && currentExercise.regressions.length > 0 && (
                    <div className="flex flex-col h-full">
                      <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-1 pt-0 mt-0 leading-none">
                        <TrendingDown className="h-4 w-4" />
                        Regressions
                      </h4>
                      <ul className="space-y-1 mt-2">
                        {currentExercise.regressions.slice(0, 3).map((regression, index) => (
                          <li key={index} className="text-sage-100 text-sm flex items-start gap-2">
                            <div className="w-2 h-2 mt-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span>{regression}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {currentExercise.progressions && currentExercise.progressions.length > 0 && (
                    <div className="flex flex-col h-full">
                      <h4 className="text-sm font-semibold text-green-300 flex items-center gap-1 pt-0 mt-0 leading-none">
                        <TrendingUp className="h-4 w-4" />
                        Progressions
                      </h4>
                      <ul className="space-y-1 mt-2">
                        {currentExercise.progressions.slice(0, 3).map((progression, index) => (
                          <li key={index} className="text-sage-100 text-sm flex items-start gap-2">
                            <div className="w-2 h-2 mt-1 bg-green-400 rounded-full flex-shrink-0"></div>
                            <span>{progression}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              </CardContent>
            </Card>

            

          </div> {/* END Left Column */}

          {/* Right Column - Now ONLY contains the Image Card */}
          <div className="space-y-4">
            {/* NEW CONTAINER FOR SAFETY NOTES & TIMER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Use grid for 2-column layout on medium screens */}
              {/* Safety Notes */}
              {/* Safety Notes */}
              {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
                <Card className="bg-amber-900/20 backdrop-blur-sm border-amber-500/30 rounded-2xl shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-200">
                      <Shield className="h-5 w-5" />
                      Safety Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Existing Contraindications List */}
                    {currentExercise.contraindications && currentExercise.contraindications.length > 0 && (
                      <ul className="space-y-1">
                        {currentExercise.contraindications.slice(0, 4).map((item, index) => (
                          <li key={index} className="text-amber-100 text-sm flex items-start gap-2">
                            <span className="text-amber-400">⚠️</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Pregnancy Safety Check */}
                    {/* Only show this section if contraindications exist OR if isPregnancySafe is defined */}
                    {/* Using a div as a container for the pregnancy safety line */}
                    <div className={
                         (currentExercise.contraindications && currentExercise.contraindications.length > 0)
                            ? "mt-3 pt-3 border-t border-amber-500/20" // Add a separator if contraindications exist
                            : ""
                         }>
                      <div className="flex items-center gap-2 text-sm">
                        {currentExercise.isPregnancySafe ? (
                          <>
                            <Check className="h-4 w-4 text-green-400 flex-shrink-0" /> {/* Green tick */}
                            <span className="text-sage-100">Safe for pregnancy</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" /> {/* Red cross */}
                            <span className="text-amber-100">Not recommended for pregnancy</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              

              {/* Timer - MOVED HERE FROM THE RIGHT COLUMN */}
              <Card className="bg-white/15 backdrop-blur-sm border-sage-500/30 rounded-2xl shadow-lg h-35 flex flex-col justify-center"> {/* Added flex flex-col justify-center here */}
              <CardContent className="p-2 text-center flex flex-col justify-center h-full"> {/* Changed p-6 to p-2, added flex flex-col justify-center h-full */}
                {currentExercise.duration && currentExercise.duration > 0 ? (
                  <div className={`text-5xl font-bold mb-0 ${exerciseTimeLeft < 30 ? 'text-red-300' : 'text-white'}`}> {/* Changed text-6xl to text-5xl, mb-1 to mb-0 */}
                    {formatTime(exerciseTimeLeft)}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-white mb-7"> {/* Changed text-3xl to text-2xl, mb-1 to mb-0 */}
                    {currentExercise.repsOrDuration || 'Hold position'}
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-3"> {/* Changed gap-4 to gap-2, consider decreasing button sizes if still too big */}
                  <Button 
                    onClick={previousExercise} 
                    disabled={currentExerciseIndex === 0} 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-sage-600 rounded-xl disabled:opacity-30"
                  >
                    <SkipBack className="h-5 w-5" /> {/* Changed h-6 w-6 to h-5 w-5 */}
                  </Button>
                  
                  <Button 
                    onClick={handlePlayPause} 
                    size="icon" 
                    className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4" 
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />} {/* Changed h-8 w-8 to h-6 w-6 */}
                  </Button>
                  
                  <Button 
                    onClick={nextExercise} 
                    disabled={currentExerciseIndex === exercises.length - 1} 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-sage-600 rounded-xl disabled:opacity-30"
                  >
                    <SkipForward className="h-5 w-5" /> {/* Changed h-6 w-6 to h-5 w-5 */}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div> {/* END NEW CONTAINER */}
            
            {/* Exercise Image*/}
            <Card className="bg-white/10 backdrop-blur-sm border-sage-500/30 rounded-xl shadow-lg overflow-hidden">
              {currentExercise.image ? (
                <div className="relative h-80">
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
                <div className="h-80 bg-sage-600/30 flex flex-col items-center justify-center border-2 border-dashed border-sage-400/50 rounded-xl m-4">
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
          </div> {/* END Right Column */}
        </div> {/* END Two Column Layout */}

        
        {/* Footer */}
        <div className="mt-8 text-center text-sage-300">
          <p className="text-sm">
            Teaching Mode © 2025 - All rights reserved.
          </p>
          <p className="text-xs mt-1">
            Developed by Reformer Team
          </p>
        </div>
      </div> {/* END Main Content */}
    </div> // END Main Container
  );
}