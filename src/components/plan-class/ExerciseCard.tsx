
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, Trash2, GripVertical, Clock, ChevronDown, ChevronRight, Target, Zap, AlertTriangle } from 'lucide-react';
import { Exercise } from '@/types/reformer';
import { SpringVisual } from '@/components/SpringVisual';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
  dragHandleProps?: any;
}

export const ExerciseCard = ({
  exercise,
  index,
  onEdit,
  onRemove,
  dragHandleProps
}: ExerciseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderDetailSection = (title: string, content: string[] | string, icon?: React.ReactNode) => {
    if (!content || (Array.isArray(content) && content.length === 0) || content === '') return null;
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="font-semibold text-sage-800 text-sm">{title}</span>
        </div>
        <div className="text-sage-700 text-sm leading-relaxed">
          {Array.isArray(content) ? (
            <ul className="space-y-1">
              {content.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-sage-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{content}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="group shadow-sm border-sage-200/60 mb-3 bg-white/95 backdrop-blur-sm hover:shadow-md transition-all duration-300 ease-out hover:bg-white">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className="p-4">
          {/* Main Exercise Info */}
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div 
              {...dragHandleProps} 
              className="cursor-grab hover:cursor-grabbing text-sage-400 hover:text-sage-600 transition-colors"
            >
              <GripVertical className="h-4 w-4" />
            </div>

            {/* Exercise Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-sage-500 font-mono w-6 flex-shrink-0">
                  {(index + 1).toString().padStart(2, '0')}.
                </span>
                <h4 className="font-semibold text-sage-900 text-sm truncate">
                  {exercise.name}
                </h4>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-sage-50 text-sage-700 border-sage-200 px-2 py-0.5"
                >
                  {exercise.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-sage-600 ml-6">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">{exercise.duration} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Springs:</span>
                  <SpringVisual springs={exercise.springs} />
                </div>
                <Badge 
                  variant="secondary" 
                  className="text-xs capitalize bg-sage-100 text-sage-700"
                >
                  {exercise.difficulty}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-sage-100 rounded-full transition-all duration-200"
                >
                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </CollapsibleTrigger>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all duration-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Expanded Content with Smooth Animation */}
          <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="mt-4 ml-6 border-t border-sage-200/60 pt-4">
              <ScrollArea className="max-h-80 pr-4">
                <div className="space-y-4">
                  {/* Quick Info Bar */}
                  {(exercise.repsOrDuration || exercise.tempo) && (
                    <div className="flex gap-4 p-3 bg-sage-50/80 rounded-xl border border-sage-200/40">
                      {exercise.repsOrDuration && (
                        <div className="text-sm">
                          <span className="font-medium text-sage-700">Reps/Duration:</span>
                          <span className="ml-2 text-sage-600">{exercise.repsOrDuration}</span>
                        </div>
                      )}
                      {exercise.tempo && (
                        <div className="text-sm">
                          <span className="font-medium text-sage-700">Tempo:</span>
                          <span className="ml-2 text-sage-600">{exercise.tempo}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {exercise.description && (
                    <div className="p-3 bg-gradient-to-r from-sage-50/60 to-white rounded-xl border border-sage-200/40">
                      <h5 className="font-semibold text-sage-800 text-sm mb-2">Description</h5>
                      <p className="text-sage-700 text-sm leading-relaxed">{exercise.description}</p>
                    </div>
                  )}

                  {/* Setup */}
                  {renderDetailSection('Setup', exercise.setup)}

                  {/* Cues */}
                  {renderDetailSection('Teaching Cues', exercise.cues, <Zap className="h-4 w-4 text-sage-600" />)}

                  {/* Breathing Cues */}
                  {renderDetailSection('Breathing Cues', exercise.breathingCues)}

                  {/* Target Areas */}
                  {renderDetailSection('Target Areas', exercise.targetAreas, <Target className="h-4 w-4 text-sage-600" />)}

                  {/* Teaching Focus */}
                  {renderDetailSection('Teaching Focus', exercise.teachingFocus)}

                  {/* Modifications */}
                  {renderDetailSection('Modifications', exercise.modifications)}

                  {/* Progressions */}
                  {renderDetailSection('Progressions', exercise.progressions)}

                  {/* Regressions */}
                  {renderDetailSection('Regressions', exercise.regressions)}

                  {/* Contraindications */}
                  {renderDetailSection('Contraindications', exercise.contraindications, <AlertTriangle className="h-4 w-4 text-orange-600" />)}

                  {/* Notes */}
                  {exercise.notes && (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/40">
                      <h5 className="font-semibold text-amber-800 text-sm mb-2">Notes</h5>
                      <p className="text-amber-700 text-sm leading-relaxed">{exercise.notes}</p>
                    </div>
                  )}

                  {/* Exercise Status Badges */}
                  <div className="flex gap-2 pt-2">
                    {exercise.isCustom && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        Custom Exercise
                      </Badge>
                    )}
                    {exercise.isPregnancySafe && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Pregnancy Safe
                      </Badge>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};
