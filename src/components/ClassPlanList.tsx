
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit2, Trash2, Copy, Calendar, Clock, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { ClassPlan } from '@/types/reformer';

interface ClassPlanListProps {
  savedClasses: ClassPlan[];
  onDeleteClass: (classId: string) => void;
  onLoadClass: (classPlan: ClassPlan) => void;
  onUpdateClass: (updatedClass: ClassPlan) => Promise<boolean>;
}

export const ClassPlanList = ({
  savedClasses,
  onDeleteClass,
  onLoadClass,
  onUpdateClass
}: ClassPlanListProps) => {
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  const toggleExpanded = (classId: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId);
    } else {
      newExpanded.add(classId);
    }
    setExpandedClasses(newExpanded);
  };

  const duplicateClass = (classPlan: ClassPlan) => {
    const duplicatedClass = {
      ...classPlan,
      id: '',
      name: `${classPlan.name} (Copy)`,
      createdAt: new Date()
    };
    onLoadClass(duplicatedClass);
  };

  const deleteClass = (classId: string, className: string) => {
    if (window.confirm(`Delete "${className}"? This cannot be undone.`)) {
      onDeleteClass(classId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (savedClasses.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-10 w-10 text-sage-500" />
        </div>
        <h3 className="text-xl font-semibold text-sage-700 mb-3">No classes yet</h3>
        <p className="text-sage-500 text-sm max-w-sm mx-auto leading-relaxed">
          Let's create your first class! Tap the ✨ button below to start building an amazing flow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24">
      {savedClasses.map((classPlan) => (
        <Card key={classPlan.id} className="border-sage-200 hover:border-sage-300 transition-all shadow-sm">
          <CardContent className="p-0">
            <Collapsible open={expandedClasses.has(classPlan.id)}>
              <CollapsibleTrigger
                onClick={() => toggleExpanded(classPlan.id)}
                className="w-full p-4 text-left hover:bg-sage-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedClasses.has(classPlan.id) ? (
                      <ChevronDown className="h-4 w-4 text-sage-600 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-sage-600 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sage-800 text-base truncate">{classPlan.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-sage-600 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(classPlan.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(classPlan.totalDuration)}
                        </span>
                        <span>{classPlan.exercises.length} exercises</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 border-t border-sage-100">
                  {/* Quick Actions */}
                  <div className="flex gap-2 py-3 flex-wrap">
                    <Button
                      onClick={() => onLoadClass(classPlan)}
                      size="sm"
                      className="bg-sage-600 hover:bg-sage-700 text-white flex-1 min-w-0"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Use Class
                    </Button>
                    <Button
                      onClick={() => duplicateClass(classPlan)}
                      size="sm"
                      variant="outline"
                      className="border-sage-300 flex-1 min-w-0"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button
                      onClick={() => deleteClass(classPlan.id, classPlan.name)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Class Notes */}
                  {classPlan.notes && (
                    <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">{classPlan.notes}</p>
                    </div>
                  )}

                  {/* Exercises Preview */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-sage-700 text-sm">
                      Exercises ({classPlan.exercises.length})
                    </h5>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {classPlan.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="flex items-center gap-3 p-2 bg-white rounded border border-sage-200">
                          <div className="w-6 h-6 bg-sage-200 rounded-full flex items-center justify-center text-xs font-medium text-sage-700 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sage-800 text-sm truncate">{exercise.name}</div>
                            <div className="text-xs text-sage-600">
                              {exercise.duration}min • {exercise.category} • {exercise.springs} springs
                            </div>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {exercise.muscleGroups.slice(0, 2).map(group => (
                              <Badge key={group} variant="secondary" className="text-xs h-4 bg-sage-100 text-sage-600">
                                {group}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
