
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Edit, Heart, Baby, Check, Target, Zap, AlertTriangle, TrendingUp, TrendingDown, Focus } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { SmartAddButton } from './SmartAddButton';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (exercise: Exercise) => void;
}

export const ExerciseDetailModal = ({ exercise, isOpen, onClose, onUpdate }: ExerciseDetailModalProps) => {
  const { preferences, toggleFavoriteExercise } = useUserPreferences();
  const isFavorite = preferences.favoriteExercises?.includes(exercise.id) || false;

  const getSpringVisual = (springs: string) => {
    const springConfig = {
      'light': [{ color: 'bg-green-500', count: 1 }],
      'medium': [{ color: 'bg-yellow-500', count: 1 }],
      'heavy': [{ color: 'bg-red-500', count: 2 }],
      'mixed': [
        { color: 'bg-red-500', count: 1 },
        { color: 'bg-yellow-500', count: 1 },
        { color: 'bg-green-500', count: 1 }
      ]
    };

    const config = springConfig[springs as keyof typeof springConfig] || springConfig.light;
    
    return (
      <div className="flex items-center gap-1">
        {config.map((spring, index) => (
          <div key={index} className="flex gap-0.5">
            {Array.from({ length: spring.count }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${spring.color}`} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return preferences.darkMode ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return preferences.darkMode ? 'bg-amber-900/50 text-amber-300 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return preferences.darkMode ? 'bg-rose-900/50 text-rose-300 border-rose-700' : 'bg-rose-100 text-rose-800 border-rose-200';
      default: return preferences.darkMode ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] p-0 ${preferences.darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white'}`}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <DialogTitle className={`text-xl font-bold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              {exercise.name}
            </DialogTitle>
            <Button
              onClick={() => toggleFavoriteExercise(exercise.id)}
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${
                isFavorite 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 pt-2 space-y-6">
            {/* Exercise Image */}
            {exercise.image && (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                    <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      Duration & Reps
                    </span>
                  </div>
                  <div className={`text-lg font-semibold ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                    {exercise.duration}min
                  </div>
                  {exercise.repsOrDuration && (
                    <div className={`text-sm ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      {exercise.repsOrDuration}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={`${preferences.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-sage-50 border-sage-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className={`h-4 w-4 ${preferences.darkMode ? 'text-gray-400' : 'text-sage-500'}`} />
                    <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      Springs & Equipment
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {getSpringVisual(exercise.springs)}
                    <span className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-700'}`}>
                      {exercise.springs}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.equipment.map(equip => (
                      <Badge key={equip} variant="outline" className="text-xs">
                        {equip}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              <Badge variant="secondary" className={preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}>
                {exercise.category}
              </Badge>
              <Badge variant="secondary" className={preferences.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}>
                {exercise.intensityLevel} intensity
              </Badge>
              {exercise.isPregnancySafe && (
                <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                  <Baby className="h-3 w-3 mr-1" />
                  Pregnancy Safe
                </Badge>
              )}
            </div>

            {/* Muscle Groups & Target Areas */}
            <div>
              <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                <Target className="h-4 w-4 inline mr-2" />
                Target Areas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                    Muscle Groups:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.muscleGroups.map(group => (
                      <Badge key={group} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
                {exercise.targetAreas && exercise.targetAreas.length > 0 && (
                  <div>
                    <span className={`text-sm font-medium ${preferences.darkMode ? 'text-gray-400' : 'text-sage-600'}`}>
                      Specific Areas:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exercise.targetAreas.map(area => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {exercise.description && (
              <div>
                <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Description
                </h4>
                <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  {exercise.description}
                </p>
              </div>
            )}

            {/* Teaching Focus & Tempo */}
            {(exercise.teachingFocus?.length || exercise.tempo) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.teachingFocus && exercise.teachingFocus.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      <Focus className="h-4 w-4 inline mr-2" />
                      Teaching Focus
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {exercise.teachingFocus.map(focus => (
                        <Badge key={focus} variant="outline" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {exercise.tempo && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      Tempo
                    </h4>
                    <p className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                      {exercise.tempo}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cues */}
            {exercise.cues && exercise.cues.length > 0 && (
              <div>
                <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  Teaching Cues
                </h4>
                <ul className="space-y-1">
                  {exercise.cues.map((cue, index) => (
                    <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'} flex items-start`}>
                      <span className="w-1.5 h-1.5 bg-sage-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Progressions & Regressions */}
            {(exercise.progressions?.length || exercise.regressions?.length) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.progressions && exercise.progressions.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      <TrendingUp className="h-4 w-4 inline mr-2 text-green-500" />
                      Progressions
                    </h4>
                    <ul className="space-y-1">
                      {exercise.progressions.map((progression, index) => (
                        <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                          • {progression}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exercise.regressions && exercise.regressions.length > 0 && (
                  <div>
                    <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                      <TrendingDown className="h-4 w-4 inline mr-2 text-blue-500" />
                      Regressions
                    </h4>
                    <ul className="space-y-1">
                      {exercise.regressions.map((regression, index) => (
                        <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                          • {regression}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Contraindications */}
            {exercise.contraindications && exercise.contraindications.length > 0 && (
              <div>
                <h4 className={`font-semibold mb-2 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
                  <AlertTriangle className="h-4 w-4 inline mr-2 text-red-500" />
                  Contraindications
                </h4>
                <ul className="space-y-1">
                  {exercise.contraindications.map((contraindication, index) => (
                    <li key={index} className={`text-sm ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'} text-red-600`}>
                      • {contraindication}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className={preferences.darkMode ? 'bg-gray-600' : 'bg-sage-200'} />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <SmartAddButton
                exercise={exercise}
                className="flex-1"
                showFeedback={true}
              />
              <Button
                variant="outline"
                size="sm"
                className={`${preferences.darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-sage-300 hover:bg-sage-50'}`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
