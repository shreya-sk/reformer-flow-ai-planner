
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Dumbbell } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';

interface ExerciseContentProps {
  exercise: Exercise;
  detailPrefs: any;
  preferences: any;
}

export const ExerciseContent = ({ exercise, detailPrefs, preferences }: ExerciseContentProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Exercise image */}
      {detailPrefs.showMedia && exercise.image && (
        <div className="w-full">
          <img 
            src={exercise.image} 
            alt={exercise.name}
            className="w-full h-48 sm:h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Basic info */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary" className="text-xs">
          {exercise.category}
        </Badge>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{exercise.duration} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="capitalize">{exercise.difficulty}</span>
        </div>
        <div className="flex items-center gap-1">
          <Dumbbell className="h-4 w-4" />
          <span className="capitalize">{exercise.intensityLevel}</span>
        </div>
      </div>

      {/* Springs and Equipment */}
      {detailPrefs.showSpringsEquipment && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-sage-700">Springs:</span>
            <SpringVisual springs={exercise.springs} className="flex items-center gap-1" />
          </div>

          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-sage-700">Equipment:</span>
              <div className="flex flex-wrap gap-1">
                {exercise.equipment.map(equip => (
                  <Badge key={equip} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    {equip}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Muscle groups */}
      {detailPrefs.showMuscleGroups && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-sage-700">Target Areas:</span>
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.map(group => (
              <Badge key={group} variant="outline" className="text-xs">
                {group}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Pregnancy safe indicator */}
      {detailPrefs.showPregnancySafety && exercise.isPregnancySafe && (
        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
          <span className="text-emerald-600">✓</span>
          <span className="text-sm font-medium text-emerald-800">Pregnancy Safe</span>
        </div>
      )}

      {/* Description */}
      {detailPrefs.showDescription && exercise.description && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sage-800">Description</h4>
            <p className="text-sm leading-relaxed text-sage-600">
              {exercise.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Setup instructions */}
      {detailPrefs.showSetupInstructions && exercise.setup && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sage-800">Setup Instructions</h4>
            <p className="text-sm leading-relaxed text-sage-600">
              {exercise.setup}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Teaching cues */}
      {detailPrefs.showTeachingCues && exercise.cues && exercise.cues.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-sage-800">Teaching Cues</h4>
            <div className="space-y-2">
              {exercise.cues.map((cue, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-xs font-bold text-sage-700 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-sage-600">
                    {cue}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional sections */}
      {detailPrefs.showBreathingCues && exercise.breathingCues && exercise.breathingCues.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Breathing Cues
            </h4>
            <div className="space-y-2">
              {exercise.breathingCues.map((cue, index) => (
                <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  • {cue}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progressions */}
      {detailPrefs.showProgressions && exercise.progressions && exercise.progressions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Progressions
            </h4>
            <div className="space-y-2">
              {exercise.progressions.map((progression, index) => (
                <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  • {progression}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regressions */}
      {detailPrefs.showRegressions && exercise.regressions && exercise.regressions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Regressions
            </h4>
            <div className="space-y-2">
              {exercise.regressions.map((regression, index) => (
                <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  • {regression}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modifications */}
      {detailPrefs.showModifications && exercise.modifications && exercise.modifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Modifications
            </h4>
            <div className="space-y-2">
              {exercise.modifications.map((modification, index) => (
                <p key={index} className={`text-sm leading-relaxed ${preferences.darkMode ? 'text-gray-300' : 'text-sage-600'}`}>
                  • {modification}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Safety notes */}
      {detailPrefs.showSafetyNotes && exercise.contraindications && exercise.contraindications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className={`font-semibold mb-3 ${preferences.darkMode ? 'text-white' : 'text-sage-800'}`}>
              Safety Notes & Contraindications
            </h4>
            <div className="space-y-2">
              {exercise.contraindications.map((note, index) => (
                <p key={index} className={`text-sm leading-relaxed text-red-600`}>
                  ⚠️ {note}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {exercise.notes && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sage-800">Notes</h4>
            <p className="text-sm leading-relaxed text-sage-600">
              {exercise.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
