
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, Trash2, GripVertical, Clock, ChevronDown, ChevronRight } from 'lucide-react';
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

  return (
    <Card className="shadow-sm border-gray-200 mb-2">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className="p-3">
          {/* Main Exercise Info */}
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <div {...dragHandleProps} className="cursor-grab hover:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            {/* Exercise Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-mono w-6">
                  {(index + 1).toString().padStart(2, '0')}.
                </span>
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {exercise.name}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {exercise.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-600 ml-8">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{exercise.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Springs:</span>
                  <SpringVisual springs={exercise.springs} />
                </div>
                <span className="capitalize">{exercise.difficulty}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Expanded Content */}
          <CollapsibleContent className="mt-3 ml-8">
            <div className="space-y-2 text-xs">
              {exercise.description && (
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 mt-1">{exercise.description}</p>
                </div>
              )}
              
              {exercise.cues && exercise.cues.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Cues:</span>
                  <p className="text-gray-600 mt-1">{exercise.cues.join(', ')}</p>
                </div>
              )}
              
              {exercise.notes && (
                <div>
                  <span className="font-medium text-gray-700">Notes:</span>
                  <p className="text-gray-600 mt-1">{exercise.notes}</p>
                </div>
              )}
              
              {exercise.repsOrDuration && (
                <div>
                  <span className="font-medium text-gray-700">Reps/Duration:</span>
                  <p className="text-gray-600 mt-1">{exercise.repsOrDuration}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};
